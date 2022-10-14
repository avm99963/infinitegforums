import {arrayBufferToBase64} from './common.js';
import * as pb from './proto/main_pb.js';

export const kWorkflowsDataKey = 'workflowsData';

export default class WorkflowsStorage {
  static getAll(asProtobuf = false) {
    return new Promise(res => {
      chrome.storage.local.get(kWorkflowsDataKey, items => {
        const workflows = items[kWorkflowsDataKey];
        if (!Array.isArray(workflows)) return res([]);
        if (!asProtobuf) return res(workflows);

        workflows.map(w => {
          w.proto = pb.workflows.Workflow.deserializeBinary(w?.data);
          delete w.data;
        });
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
    const binaryWorkflow = workflow.serializeBinary();
    return arrayBufferToBase64(binaryWorkflow).then(data => {
      return this.addRaw(data);
    });
  }

  static remove(uuid) {
    return this.getAll().then(workflows => {
      const items = {};
      items[kWorkflowsDataKey] = workflows.filter(w => w.uuid != uuid);
      chrome.storage.local.set(items);
    });
  }
}
