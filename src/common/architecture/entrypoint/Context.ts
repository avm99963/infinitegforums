import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../scripts/Script';

/**
 * @deprecated
 */
export interface Context {
  page: ScriptPage;
  environment: ScriptEnvironment;
  runPhase: ScriptRunPhase;
}
