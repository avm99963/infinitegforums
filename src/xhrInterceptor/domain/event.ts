export const EVENT_START_BULK_MOVE = 'twpt-start-bulk-move';

export type InterceptorEvent<Body = unknown> = CustomEvent<{
  /** Unique ID identifying the interceptor event. */
  id: number;

  /** Body that describes the event. */
  body: Body;
}>;
