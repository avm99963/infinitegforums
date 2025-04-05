/** Status of a specific type of report. */
export const ReportStatusValues = {
  /**
   * This report hasn't yet been initiated or it has completed with an error and
   * is ready to be retried.
   */
  Idle: 'idle',
  /* The user initiated the report and the request hasn't completed. */
  Processing: 'processing',
  /* The reporting request has completed successfully. */
  Done: 'done',
} as const;

export type ReportStatus =
  (typeof ReportStatusValues)[keyof typeof ReportStatusValues];
