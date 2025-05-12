export interface RefreshOptions {
  /**
   * If true, if the page cannot be soft refreshed, the whole page will be
   * reloaded. Otherwise, a soft refresh fail will be ignored.
   *
   * If this option is not provided, implementers should assume it is false.
   */
  forceRefresh?: boolean;
}

export interface ViewSoftRefresherServicePort {
  /**
   * Attempt to soft refresh (refresh without reloading the whole page) the
   * current view if possible.
   */
  refresh(options?: RefreshOptions): void;
}
