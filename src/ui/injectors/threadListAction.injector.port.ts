export interface ThreadListActionInjectorOptions {
  /* Element to insert into the bulk actions toolbar. */
  element: Element;

  /**
   * Unique key to identify the action being added. This prevents inserting it
   * multiple times in the toolbar.
   */
  key: string;
};

export interface ThreadListActionInjectorPort {
  /**
   * Inject a bulk action element into the thread list bulk actions toolbar.
   *
   * @returns True if the element was injected, or false if it already exists.
   */
  execute(options: ThreadListActionInjectorOptions): boolean;
}
