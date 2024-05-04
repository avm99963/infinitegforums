import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../scripts/Script';

export interface Context {
  page: ScriptPage;
  environment: ScriptEnvironment;
  runPhase: ScriptRunPhase;
}
