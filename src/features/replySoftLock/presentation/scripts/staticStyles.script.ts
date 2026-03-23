import { ScriptPage } from '@/common/architecture/scripts/Script';
import StylesheetScript from '@/common/architecture/scripts/stylesheet/StylesheetScript';

/**
 * Script that injects dynamically the static styles for the "soft lock" checkbox.
 */
export default class ReplySoftLockStaticStylesScript extends StylesheetScript {
  stylesheet = 'css/reply_soft_lock.css';
  page = ScriptPage.CommunityConsole;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('replysoftlock');
  }
}
