import Script from '@/common/architecture/scripts/Script';
import {
  getOptionsAndHandleIndicators,
  UI,
  UI_TW_INTEROP,
  UI_TW_INTEROP_V2,
  UI_TW_LEGACY,
} from '@/features/profileIndicator/core/profileIndicator';
import { ChromeI18nPort } from '@/services/i18n/chrome/ChromeI18n.port';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';

const TW_PROFILE_LINK_TYPES: Array<{
  ui: UI;
  nodeSelector: string;
}> = [
  {
    // Legacy
    ui: UI_TW_LEGACY,
    nodeSelector: '.thread-question a.user-info-display-name',
  },
  {
    // Interop (legacy)
    ui: UI_TW_INTEROP,
    nodeSelector:
      'sc-tailwind-thread-question-question-card ' +
      'sc-tailwind-thread-post_header-user-info ' +
      '.scTailwindThreadPost_headerUserinfoname a',
  },
  {
    // Interop v2
    ui: UI_TW_INTEROP_V2,
    nodeSelector:
      'sc-tailwind-thread-question-question-card ' +
      'sc-tailwind-thread-post_header-user-info > ' +
      '.scTailwindThreadPost_headerUserinforoot > a',
  },
];

export default class ProfileIndicatorTwBasicSetUpScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly chromeI18n: ChromeI18nPort,
  ) {
    super();
  }

  execute() {
    // TODO(https://iavm.xyz/b/twpowertools/176): Modify so it comes from ContextPort
    const authuser = new URL(location.href).searchParams.get('authuser') || '0';

    let foundProfileLink = false;
    for (const linkType of TW_PROFILE_LINK_TYPES) {
      const node = document.querySelector(linkType.nodeSelector);
      if (node !== null && node instanceof HTMLAnchorElement) {
        foundProfileLink = true;
        getOptionsAndHandleIndicators(node, {
          authuser,
          i18n: this.chromeI18n,
          optionsProvider: this.optionsProvider,
          ui: linkType.ui,
        });
        break;
      }
    }

    if (!foundProfileLink) {
      console.error("[opindicator] Couldn't find username.");
    }
  }
}
