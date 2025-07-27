import Script from '../../../common/architecture/scripts/Script';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider';

export default class CCForceHideDrawerScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(private optionsProvider: OptionsProviderPort) {
    super();
  }

  async execute() {
    // We only want to hide the drawer on startup if the feature is enabled.
    // Thus, changing the feature won't affect already open tabs.
    if (await this.optionsProvider.isEnabled('ccforcehidedrawer')) {
      this.hideDrawer();
    }
  }

  private hideDrawer() {
    if (this.isDrawerExpanded()) {
      const materialDrawerButton = document.querySelector(
        '.material-drawer-button',
      );
      if (!(materialDrawerButton instanceof HTMLElement)) {
        console.warn(
          '[ccforcehidedrawer] Unexpected error: drawer button is not an instance of HTMLElement. Actual:',
          materialDrawerButton,
        );
        return;
      }
      materialDrawerButton.click();
    }
  }

  private isDrawerExpanded() {
    const drawer = document.querySelector('material-drawer');
    return drawer !== null && drawer.classList.contains('mat-drawer-expanded');
  }
}
