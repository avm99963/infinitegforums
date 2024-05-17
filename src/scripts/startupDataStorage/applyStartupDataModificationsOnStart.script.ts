import { ScriptRunPhase } from '../../common/architecture/scripts/Script';
import BaseApplyStartupDataModificationsScript from './baseApplyStartupDataModifications.script';

/**
 * Applies pending startup data modifications which have been added by other
 * scripts at the start run phase.
 */
export default class ApplyStartupDataModificationsOnStartScript extends BaseApplyStartupDataModificationsScript {
  runPhase = ScriptRunPhase.Start;
}
