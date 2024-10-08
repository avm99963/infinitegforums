import {arrayBufferToBase64} from './common.js';
import * as pb from './proto/main_pb.js';

export const kWorkflowsDataKey = 'workflowsData';

export default class WorkflowsStorage {
  static watch(callback, asProtobuf = false) {
    // Function which will be called when the watcher is initialized and every
    // time the workflows storage changes.
    const callOnChanged = () => {
      this.getAll(asProtobuf).then(workflows => callback(workflows));
    };

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName == 'local' && changes[kWorkflowsDataKey]) callOnChanged();
    });

    callOnChanged();
  }

  static convertRawListToProtobuf(workflows) {
    workflows.forEach(w => {
      w.proto = pb.workflows.Workflow.deserializeBinary(w?.data);
      delete w.data;
    });
  }

  static getAll(asProtobuf = false) {
    return new Promise(res => {
      chrome.storage.local.get(kWorkflowsDataKey, items => {
        const workflows = items[kWorkflowsDataKey];
        if (!Array.isArray(workflows)) return res([]);
        if (!asProtobuf) return res(workflows);

        this.convertRawListToProtobuf(workflows);
        return res(workflows);
      });
    });
  }

  static get(uuid, asProtobuf = false) {
    return this.getAll(asProtobuf).then(workflows => {
      for (const w of workflows) {
        if (w.uuid == uuid) return w;
      }
      return null;
    });
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
    return this._proto2Base64(workflow).then(data => {
      return this.addRaw(data);
    });
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
    return this._proto2Base64(workflow).then(data => {
      return this.updateRaw(uuid, data);
    });
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
    return arrayBufferToBase64(binaryWorkflow);
  }
}
