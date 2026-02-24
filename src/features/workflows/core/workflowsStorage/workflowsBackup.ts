import { WorkflowsBackupsParser } from './workflowsBackupParser';
import WorkflowsStorage, { StoredWorkflow } from './workflowsStorage';

export interface Backup {
  backupVersion: 1;
  workflows: StoredWorkflow[];
}

export class WorkflowsBackups {
  // TODO(https://iavm.xyz/b/twpowertools/176): pass this dependency via
  // dependency injection.
  private parser = new WorkflowsBackupsParser();

  async create(): Promise<string> {
    const backup: Backup = {
      backupVersion: 1,
      workflows: await WorkflowsStorage.getAll(),
    };
    return JSON.stringify(backup);
  }

  async import(backup: Backup) {
    try {
      WorkflowsStorage.importWorkflows(backup.workflows);
    } catch (err) {
      throw new Error('The workflows backup cannot be imported.', {
        cause: err,
      });
    }
  }

  parse(stringifiedBackup: string): Backup {
    try {
      return this.parser.parse(stringifiedBackup);
    } catch (err) {
      throw new Error('The workflows backup is invalid and cannot be parsed.', {
        cause: err,
      });
    }
  }
}
