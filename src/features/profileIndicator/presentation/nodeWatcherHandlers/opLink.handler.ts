import {
  getOptionsAndHandleIndicators,
  UI,
  UI_COMMUNITY_CONSOLE,
  UI_COMMUNITY_CONSOLE_INTEROP,
  UI_COMMUNITY_CONSOLE_INTEROP_V2,
} from '@/features/profileIndicator/core/profileIndicator';
import CssSelectorNodeWatcherHandler from '@/infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '@/presentation/nodeWatcher/NodeWatcherHandler';
import { ChromeI18nPort } from '@/services/i18n/chrome/ChromeI18n.port';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';

const CC_PROFILE_REGEX =
  /^(?:https:\/\/support\.google\.com)?\/s\/community(?:\/forum\/[0-9]*)?\/user\/(?:[0-9]+)(?:\?.*)?$/;

abstract class BaseOPLinkProfileIndicatorHandler extends CssSelectorNodeWatcherHandler {
  page: never;
  environment: never;
  runPhase: never;

  abstract ui: UI;

  // TODO(https://iavm.xyz/b/twpowertools/176): Add ContextPort, OptionsProvider or whatever.
  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly chromeI18n: ChromeI18nPort,
  ) {
    super();
  }

  onMutatedNode(nodeMutation: NodeMutation<HTMLElement>): void {
    if (!this.isProfileLink(nodeMutation.node)) {
      return;
    }

    // TODO(https://iavm.xyz/b/twpowertools/176): get authuser from ContextPort.
    const startup = JSON.parse(
      document.querySelector('html').getAttribute('data-startup'),
    );
    const authuser = startup[2][1] || '0';

    getOptionsAndHandleIndicators(nodeMutation.node, {
      authuser,
      i18n: this.chromeI18n,
      optionsProvider: this.optionsProvider,
      ui: this.ui,
    });
  }

  private isProfileLink(node: HTMLElement): node is HTMLAnchorElement {
    return (
      node instanceof HTMLAnchorElement && CC_PROFILE_REGEX.test(node.href)
    );
  }
}

export class LegacyOPLinkProfileIndicatorHandler extends BaseOPLinkProfileIndicatorHandler {
  cssSelector = 'ec-question ec-message-header .name-section ec-user-link a';
  ui = UI_COMMUNITY_CONSOLE;
}

export class InteropOPLinkProfileIndicatorHandler extends BaseOPLinkProfileIndicatorHandler {
  cssSelector =
    'sc-tailwind-thread-question-question-card ' +
    'sc-tailwind-thread-post_header-user-info ' +
    '.scTailwindThreadPost_headerUserinfoname a';
  ui = UI_COMMUNITY_CONSOLE_INTEROP;
}

export class InteropV2OPLinkProfileIndicatorHandler extends BaseOPLinkProfileIndicatorHandler {
  cssSelector =
    'sc-tailwind-thread-question-question-card ' +
    'sc-tailwind-thread-post_header-user-info > ' +
    '.scTailwindThreadPost_headerUserinforoot > a';
  ui = UI_COMMUNITY_CONSOLE_INTEROP_V2;
}
