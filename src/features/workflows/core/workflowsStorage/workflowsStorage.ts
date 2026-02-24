import * as pb from '../proto/main_pb.js';

export const kWorkflowsDataKey = 'workflowsData';

/** Base64 representation of a workflow protobuf message. */
export type Base64Workflow = string;

export interface StoredWorkflow {
  /**
   * Unique identifier for the workflow.
   *
   * If a workflow is exported, it will preserve this UUID to help prevent deduplication.
   */
  uuid: string;

  /**
   * Workflow serialized into bytes, saved as a base64 string.
   */
  data: Base64Workflow;
}

export interface IdentifiableWorkflow {
  /**
   * Unique identifier for the workflow.
   *
   * If a workflow is exported, it will preserve this UUID to help prevent deduplication.
   */
  uuid: string;

  /**
   * Protobuf message representation.
   */
  proto: pb.workflows.Workflow;
}

export default class WorkflowsStorage {
  static watch(callback: (workflows: StoredWorkflow[]) => void): void {
    // Function which will be called when the watcher is initialized and every
    // time the workflows storage changes.
    const callOnChanged = async () => {
      callback(await this.getAll());
    };

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName == 'local' && changes[kWorkflowsDataKey]) callOnChanged();
    });

    callOnChanged();
  }

  static convertRawListToProtobuf(
    workflows: StoredWorkflow[],
  ): IdentifiableWorkflow[] {
    return workflows.map((w) => {
      return {
        uuid: w.uuid,
        proto: pb.workflows.Workflow.deserializeBinary(
          Uint8Array.fromBase64(w?.data),
        ),
      };
    });
  }

  static getAll(): Promise<StoredWorkflow[]> {
    return new Promise((res) => {
      chrome.storage.local.get(kWorkflowsDataKey, (items) => {
        const workflows = items[kWorkflowsDataKey];
        if (!Array.isArray(workflows)) return res([]);
        return res(workflows);
      });
    });
  }

  static async get(uuid: string): Promise<StoredWorkflow | null> {
    const workflows = await this.getAll();
    for (const w of workflows) {
      if (w.uuid == uuid) return w;
    }
    return null;
  }

  static async exists(uuid: string): Promise<boolean> {
    const workflow = await this.get(uuid);
    return workflow !== null;
  }

  static async addRaw(base64Workflow: Base64Workflow): Promise<void> {
    const w: StoredWorkflow = {
      uuid: self.crypto.randomUUID(),
      data: base64Workflow,
    };

    const workflows = await this.getAll();
    workflows.push(w);
    this._saveWorkflows(workflows);
  }

  static add(workflow: pb.workflows.Workflow): Promise<void> {
    const data = this._proto2Base64(workflow);
    return this.addRaw(data);
  }

  static async updateRaw(
    uuid: string,
    base64Workflow: Base64Workflow,
  ): Promise<void> {
    const workflows = await this.getAll();
    workflows.forEach((w) => {
      if (w.uuid === uuid) {
        w.data = base64Workflow;
      }
    });
    this._saveWorkflows(workflows);
  }

  static update(uuid: string, workflow: pb.workflows.Workflow): Promise<void> {
    const data = this._proto2Base64(workflow);
    return this.updateRaw(uuid, data);
  }

  static async remove(uuid: string): Promise<void> {
    const oldWorkflows = await this.getAll();
    const workflows = oldWorkflows.filter((w) => w.uuid != uuid);
    this._saveWorkflows(workflows);
  }

  static async moveUp(uuid: string): Promise<void> {
    await this.moveToRelativePosition(uuid, -1);
  }

  static async moveDown(uuid: string): Promise<void> {
    await this.moveToRelativePosition(uuid, 1);
  }

  /**
   * Swaps the workflow with the one saved in the specified position relative to
   * the workflow's position. Example: position = 1 swaps the workflow with the
   * next workflow, so it appears afterwards.
   */
  static async moveToRelativePosition(
    uuid: string,
    relativePosition: number,
  ): Promise<void> {
    const workflows = await this.getAll();
    const index = workflows.findIndex((workflow) => workflow.uuid === uuid);
    if (index === -1) {
      throw new Error(
        "Couldn't move the workflow because it couldn't be found.",
      );
    }
    if (workflows[index + relativePosition] === undefined) {
      throw new Error(
        "Couldn't move the workflow because the specified relative position is out of bounds.",
      );
    }
    [workflows[index], workflows[index + relativePosition]] = [
      workflows[index + relativePosition],
      workflows[index],
    ];
    this._saveWorkflows(workflows);
  }

  /**
   * Adds these workflows on top of the existing ones, so that:
   *
   * - New workflows are added to the list of workflows.
   * - Existing workflows are updated with the imported data.
   */
  static async importWorkflows(
    workflowsToImport: StoredWorkflow[],
  ): Promise<void> {
    const storedWorkflows = await this.getAll();

    // Create a map for O(1) lookups.
    const storedWorkflowsMap = new Map<string, StoredWorkflow>(
      storedWorkflows.map((wf) => [wf.uuid, wf]),
    );

    for (const workflowToImport of workflowsToImport) {
      const existingWorkflow = storedWorkflowsMap.get(workflowToImport.uuid);
      if (existingWorkflow) {
        storedWorkflowsMap.set(workflowToImport.uuid, {
          ...existingWorkflow,
          data: workflowToImport.data,
        });
      } else {
        storedWorkflowsMap.set(workflowToImport.uuid, workflowToImport);
      }
    }

    await this._saveWorkflows([...storedWorkflowsMap.values()]);
  }

  static _saveWorkflows(workflows: StoredWorkflow[]): Promise<void> {
    return new Promise((res, rej) => {
      chrome.storage.local.set({ [kWorkflowsDataKey]: workflows }, () => {
        if (chrome.runtime.lastError === undefined) {
          res();
        } else {
          rej(
            new Error(
              `Error saving workflows: ${chrome.runtime.lastError.message}`,
            ),
          );
        }
      });
    });
  }

  static _proto2Base64(workflow: pb.workflows.Workflow): Base64Workflow {
    const binaryWorkflow = workflow.serializeBinary();
    return binaryWorkflow.toBase64();
  }
}
