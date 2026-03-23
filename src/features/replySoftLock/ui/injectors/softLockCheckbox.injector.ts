export interface SoftLockCheckboxInjectorPort {
  execute(options: {
    /** Container where the checkbox will be injected. **/
    container: Element;
    /**
     * Whether the checkbox should be prepended ('start') or appended ('end')
     * to the container.
     **/
    position: 'start' | 'end';
  }): void;
}
