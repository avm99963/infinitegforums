export const ReportTypeValues = {
  OffTopic: 'off-topic',
  Abuse: 'abuse',
} as const;

export type ReportType =
  (typeof ReportTypeValues)[keyof typeof ReportTypeValues];
