import { ScriptRunPhase } from '../../common/architecture/scripts/Script';
import BaseApplyStartupDataModificationsScript from './baseApplyStartupDataModifications.script';

/**
 * Applies pending startup data modifications which have been added by other
 * scripts at the main run phase.
 */
export default class ApplyStartupDataModificationsOnMainScript extends BaseApplyStartupDataModificationsScript {
  runPhase = ScriptRunPhase.Main;
}
