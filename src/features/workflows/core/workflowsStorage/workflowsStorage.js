import * as pb from '../proto/main_pb.js';

export const kWorkflowsDataKey = 'workflowsData';

export default class WorkflowsStorage {
  static watch(callback) {
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

  static convertRawListToProtobuf(workflows) {
    return workflows.map((w) => {
      return {
        uuid: w.uuid,
        proto: pb.workflows.Workflow.deserializeBinary(
            Uint8Array.fromBase64(w?.data),
            ),
      };
    });
  }

  static getAll() {
    return new Promise((res) => {
      chrome.storage.local.get(kWorkflowsDataKey, (items) => {
        const workflows = items[kWorkflowsDataKey];
        if (!Array.isArray(workflows)) return res([]);
        return res(workflows);
      });
    });
  }

  static async get(uuid) {
    const workflows = await this.getAll();
    for (const w of workflows) {
      if (w.uuid == uuid) return w;
    }
    return null;
  }

  static exists(uuid) {
    return this.get(uuid).then(w => w !== null);
  }

  static addRaw(base64Workflow) {
    const w = {
      uuid: self.crypto.randomUUID(),
      data: base64Workflow,
    };
    return this.getAll().then(workflows => {
      workflows.push(w);
      const items = {};
      items[kWorkflowsDataKey] = workflows;
      chrome.storage.local.set(items);
    });
  }

  static add(workflow) {
    const data = this._proto2Base64(workflow);
    return this.addRaw(data);
  }

  static updateRaw(uuid, base64Workflow) {
    return this.getAll().then(workflows => {
      workflows.map(w => {
        if (w.uuid !== uuid) return w;
        w.data = base64Workflow;
        return w;
      });
      const items = {};
      items[kWorkflowsDataKey] = workflows;
      chrome.storage.local.set(items);
    });
  }

  static update(uuid, workflow) {
    const data = this._proto2Base64(workflow);
    return this.updateRaw(uuid, data);
  }

  static remove(uuid) {
    return this.getAll().then(workflows => {
      const items = {};
      items[kWorkflowsDataKey] = workflows.filter(w => w.uuid != uuid);
      chrome.storage.local.set(items);
    });
  }

  static async moveUp(uuid) {
    await this.moveToRelativePosition(uuid, -1);
  }

  static async moveDown(uuid) {
    await this.moveToRelativePosition(uuid, 1);
  }

  /**
   * Swaps the workflow with the one saved in the specified position relative to
   * the workflow's position. Example: position = 1 swaps the workflow with the
   * next workflow, so it appears afterwards.
   */
  static async moveToRelativePosition(uuid, relativePosition) {
    const workflows = await this.getAll();
    const index = workflows.findIndex((workflow) => workflow.uuid === uuid);
    if (index === -1) {
      throw new Error(
          'Couldn\'t move the workflow because it couldn\'t be found.',
      );
    }
    if (workflows[index + relativePosition] === undefined) {
      throw new Error(
          'Couldn\'t move the workflow because the specified relative position is out of bounds.',
      );
    }
    [workflows[index], workflows[index + relativePosition]] =
        [workflows[index + relativePosition], workflows[index]];
    const items = {[kWorkflowsDataKey]: workflows};
    await chrome.storage.local.set(items);
  }

  static _proto2Base64(workflow) {
    const binaryWorkflow = workflow.serializeBinary();
    return binaryWorkflow.toBase64();
  }
}
