import { ScriptRunPhase } from '../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../services/communityConsole/startupDataStorage/StartupDataStorage.port';
import BaseApplyStartupDataModificationsScript from './baseApplyStartupDataModifications.script';

/**
 * Applies pending startup data modifications which have been added by other
 * scripts at the main run phase.
 */
export default class ApplyStartupDataModificationsOnMainScript extends BaseApplyStartupDataModificationsScript {
  runPhase = ScriptRunPhase.Main;

  constructor(startupDataStorage: StartupDataStoragePort) {
    super(startupDataStorage);
  }
}
