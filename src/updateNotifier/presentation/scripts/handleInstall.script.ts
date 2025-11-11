import { BaseUpdateHandlerScript, Reason } from './base.script';

export default class HandleInstallScript extends BaseUpdateHandlerScript {
  reason: Reason = 'install';
}
