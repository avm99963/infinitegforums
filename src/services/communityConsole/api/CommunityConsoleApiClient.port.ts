import { ProtobufObject } from '@/common/protojs/protojs.types';

export interface CommunityConsoleApiClientPort {
  /**
   * Sends a request via the Community Console API.
   *
   * @param method RPC method to call.
   * @param body Body to pass in the request.
   * @param [options.authenticated] Whether the request will be made
   * authenticated with the current user. By default it will be authenticated.
   * @returns The parsed response.
   * @throws {@link ApiError} If the API returns any error response (either a
   * controlled 400 response or any non-200 response).
   */
  send(
    method: string,
    body: ProtobufObject,
    options?: {
      authenticated?: boolean;
    },
  ): Promise<ProtobufObject>;
}
