import { UnexpectedUIError } from '../../../../ui/errors/unexpectedUI.error';
import {
  RefreshOptions,
  ViewSoftRefresherServicePort,
} from '../../../../ui/services/viewSoftRefresher.service.port';

export class ViewSoftRefresherServiceAdapter
  implements ViewSoftRefresherServicePort
{
  refresh(options?: RefreshOptions): void {
    const refreshButton = document.querySelector('.app-title-button');
    if (refreshButton !== null && refreshButton instanceof HTMLElement) {
      refreshButton.click();
    } else {
      const shouldForceRefresh = options?.forceRefresh ?? false;
      console.warn(
        new UnexpectedUIError('The app main button cannot be found.'),
        `This error occurred while trying to soft refresh the current view. ${shouldForceRefresh ? 'The whole page will be reloaded instead.' : "The view thus hasn't been refreshed."}`,
      );
      if (shouldForceRefresh) {
        window.location.reload();
      }
    }
  }
}
