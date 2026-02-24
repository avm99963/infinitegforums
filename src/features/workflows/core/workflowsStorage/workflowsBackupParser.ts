import { Backup } from './workflowsBackup';
import WorkflowsStorage, { StoredWorkflow } from './workflowsStorage';

const WORKFLOW_STRING_PROPERTIES = ['uuid', 'data'] as const;

export class WorkflowsBackupsParser {
  parse(stringifiedBackup: string): Backup {
    const backup = JSON.parse(stringifiedBackup);
    this.ensureHasBackupProperties(backup);
    this.ensureIsV1Backup(backup);
    this.ensureWorkflowsIsStoredWorkflowsArray(backup);
    this.ensureWorkflowsAreParseable(backup);
    return backup;
  }

  private ensureHasBackupProperties(
    backup: unknown,
  ): asserts backup is { backupVersion: unknown; workflows: unknown } {
    for (const property of ['backupVersion', 'workflows']) {
      if (!backup.hasOwnProperty(property)) {
        throw new Error(
          `The backup does not contain the ${property} property.`,
        );
      }
    }
  }

  private ensureIsV1Backup(backup: {
    backupVersion: unknown;
    workflows: unknown;
  }): asserts backup is { backupVersion: 1; workflows: unknown } {
    if (backup.backupVersion !== 1) {
      throw new Error(
        `The backup version is not recognized (we only accept v1 backups).`,
      );
    }
  }

  private ensureWorkflowsIsStoredWorkflowsArray(backup: {
    backupVersion: 1;
    workflows: unknown;
  }): asserts backup is { backupVersion: 1; workflows: StoredWorkflow[] } {
    if (!Array.isArray(backup.workflows)) {
      throw new Error(`The workflows property must be an array.`);
    }

    for (const workflow of backup.workflows) {
      this.ensureIsStoredWorkflow(workflow);
    }
  }

  private ensureIsStoredWorkflow(
    workflow: unknown,
  ): asserts workflow is StoredWorkflow {
    this.ensureHasStoredWorkflowProperties(workflow);

    for (const property of WORKFLOW_STRING_PROPERTIES) {
      if (typeof workflow[property] !== 'string') {
        throw new Error(
          `Property ${property} of workflow ${JSON.stringify(workflow)} must be a string.`,
        );
      }
    }
  }

  private ensureHasStoredWorkflowProperties(
    workflow: unknown,
  ): asserts workflow is { uuid: unknown; data: unknown } {
    for (const property of WORKFLOW_STRING_PROPERTIES) {
      if (!workflow.hasOwnProperty(property)) {
        throw new Error(
          `Workflow ${JSON.stringify(workflow)} must have property ${property}.`,
        );
      }
    }
  }

  private ensureWorkflowsAreParseable(backup: Backup) {
    try {
      WorkflowsStorage.convertRawListToProtobuf(backup.workflows);
    } catch (err) {
      throw new Error(
        `At least one of the backed up workflows is corrupted and cannot be parsed.`,
        { cause: err },
      );
    }
  }
}
