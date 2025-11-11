import { TWPT_UPDATE_BANNER_TAG } from '../../../ui/consts';
import {
  UpdateBannerInjectorPort,
  UpdateBannerInjectReason,
} from '../../../ui/injectors/updateBannerInjector.port';
import { UnexpectedUIError } from '../../../../ui/errors/unexpectedUI.error';

export class UpdateBannerInjectorAdapter implements UpdateBannerInjectorPort {
  execute(reason: UpdateBannerInjectReason): void {
    const main = document.querySelector('.scrollable-content > main');
    if (main === null) {
      throw new UnexpectedUIError(
        `[updateHandlerBanner] Couldn't find main element.`,
      );
    }

    const banner = document.createElement(TWPT_UPDATE_BANNER_TAG);
    if (reason === 'install') banner.setAttribute('isinstall', '');
    main.prepend(banner);
  }
}
