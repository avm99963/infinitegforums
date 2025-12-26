import Script from '@/common/architecture/scripts/Script';
import {
  getOptionsAndHandleIndicators,
  UI_TW_INTEROP,
  UI_TW_INTEROP_V2,
  UI_TW_LEGACY,
} from '@/features/profileIndicator/core/profileIndicator';

const TW_PROFILE_LINK_TYPES = [
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

  execute() {
    // TODO(https://iavm.xyz/b/twpowertools/176): Modify so it comes from ContextPort
    const authuser = new URL(location.href).searchParams.get('authuser') || '0';

    let foundProfileLink = false;
    for (const linkType of TW_PROFILE_LINK_TYPES) {
      const node = document.querySelector(linkType.nodeSelector);
      if (node !== null) {
        foundProfileLink = true;
        getOptionsAndHandleIndicators(node, linkType.ui, authuser);
        break;
      }
    }

    if (!foundProfileLink) {
      console.error("[opindicator] Couldn't find username.");
    }
  }
}
