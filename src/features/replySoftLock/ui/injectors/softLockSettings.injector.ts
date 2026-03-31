export interface SoftLockSettingsInjectorPort {
  /**
   * Injects the settings menu.
   */
  execute(options: {
    /** Element with respect to which the settings menu will be injected. **/
    element: Element;
    /**
     * Whether the checkbox should be:
     * - start: prepended to the element.
     * - end: appended to the element.
     **/
    position: 'start' | 'end';
  }): void;
}
