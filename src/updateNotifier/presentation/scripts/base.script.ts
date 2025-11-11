import { injectScript } from '../../../common/contentScriptsUtils';
import { UpdateBannerInjectorPort } from '../../ui/injectors/updateBannerInjector.port';
import MWI18nServerScript from '../../../presentation/standaloneScripts/mainWorldServers/MWI18nServerScript.script';

import Script from '../../../common/architecture/scripts/Script';

export type Reason = 'install' | 'update';

export abstract class BaseUpdateHandlerScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  runAfter = [
    // The extension was just updated, so we need to start everything from
    // scratch.
    MWI18nServerScript,
  ];

  abstract reason: Reason;

  constructor(private readonly bannerInjector: UpdateBannerInjectorPort) {
    super();
  }

  execute() {
    console.debug(`Handling extension update (reason: ${this.reason}).`);
    injectScript(chrome.runtime.getURL('updateHandlerLitComponents.bundle.js'));
    this.bannerInjector.execute(this.reason);
  }
}
