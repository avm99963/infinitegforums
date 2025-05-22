export interface ThreadListGenericActionButtonOptions {
  /* Material design icon codename for the button. */
  icon: string;

  /* Key which univocally identifies the action. */
  key: string;

  /* Optional text to show in a tooltip. */
  tooltip?: string;
}

export interface ThreadListGenericActionButtonInjectorPort {
  /**
   * Inject a generic button into the thread list bulk actions toolbar.
   *
   * @returns The button element if it could be injected, or null if it already
   * exists.
   */
  execute(options: ThreadListGenericActionButtonOptions): Element | null;
}
