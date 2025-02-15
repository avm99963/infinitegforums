import { ProtobufObject } from "../common/protojs.types";

export interface ResponseModifierPort {
  intercept(interception: InterceptedResponse): Promise<Result>;
}

/**
 * Represents an intercepted response.
 */
export interface InterceptedResponse {
  /**
   * URL of the original request.
   */
  url: string;

  /**
   * Object with the response as intercepted without any modification.
   */
  originalResponse: ProtobufObject;
}

export type Result =
  | { wasModified: false }
  | {
      wasModified: true;
      modifiedResponse: ProtobufObject;
    };
