export type ActionCodename = string;

/**
 * Request and response payloads for a single action.
 *
 * @template Req The type of the request payload.
 * @template Res The type of the response payload.
 */
export type ActionPayload<Req = void, Res = void> = {
  request: Req;
  response: Res;
};

/**
 * A map between action names and their payloads.
 */
export type ActionMap<A extends ActionCodename> = {
  [action in A]: ActionPayload<unknown, unknown>;
};

/**
 * Raw request data passed via the window.postMessage API for a certain action.
 */
export type ActionRequestData<
  A extends ActionCodename,
  M extends ActionMap<A>,
> = {
  target: string;
  uuid: string;
  action: A;
  request: ActionRequest<A, M>;
};

/**
 * Type for the request(s) of action(s) A according to action map M.
 */
export type ActionRequest<
  A extends ActionCodename,
  M extends ActionMap<A>,
> = M[A]['request'];

/**
 * A union type representing all possible request data objects defined in the
 * ActionMap.
 */
export type RequestData<A extends ActionCodename, M extends ActionMap<A>> = {
  [T in A]: ActionRequestData<T, M>;
}[A];

/**
 * Raw response data passed via the window.postMessage API for a certain action.
 */
export type ActionResponseData<
  A extends ActionCodename,
  M extends ActionMap<A>,
> = {
  target: string;
  uuid: string;
  response: ActionResponse<A, M>;
};

/**
 * Type for the response(s) of action(s) A according to action map M.
 */
export type ActionResponse<
  A extends ActionCodename,
  M extends ActionMap<A>,
> = M[A]['response'];

/**
 * A union type representing all possible response data objects defined in the
 * ActionMap.
 */
export type ResponseData<A extends ActionCodename, M extends ActionMap<A>> = {
  [T in A]: ActionResponseData<T, M>;
}[A];
