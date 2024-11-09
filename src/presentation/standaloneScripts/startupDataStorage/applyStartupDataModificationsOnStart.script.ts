import { ScriptRunPhase } from '../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../services/communityConsole/StartupDataStorage.port';
import BaseApplyStartupDataModificationsScript from './baseApplyStartupDataModifications.script';

/**
 * Applies pending startup data modifications which have been added by other
 * scripts at the start run phase.
 */
export default class ApplyStartupDataModificationsOnStartScript extends BaseApplyStartupDataModificationsScript {
  runPhase = ScriptRunPhase.Start;

  constructor(startupDataStorage: StartupDataStoragePort) {
    super(startupDataStorage);
  }
}
