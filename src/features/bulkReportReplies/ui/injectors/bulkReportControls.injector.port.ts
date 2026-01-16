export interface BulkReportControlsInjectorPort {
  /**
   * Injects the bulk report controls component to a question or message.
   *
   * @param messageActions The actions container for the message (message
   * actions) or question (question actions).
   */
  inject(actionsContainer: Element): void;
};
