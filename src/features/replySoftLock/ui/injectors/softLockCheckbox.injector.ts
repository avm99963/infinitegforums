export interface SoftLockCheckboxInjectorPort {
  execute(options: {
    /** Element with respect to which the checkbox will be injected. **/
    element: Element;
    /**
     * Whether the checkbox should be:
     * - start: prepended to the element.
     * - end: appended to the element.
     **/
    position: 'start' | 'end';
  }): void;
}
