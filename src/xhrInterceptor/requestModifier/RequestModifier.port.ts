import { ProtobufObject } from '../../common/protojs/protojs.types';

export interface RequestModifierPort {
  intercept(interception: InterceptedRequest): Promise<Result>;
}

export interface InterceptedRequest {
  url: string;
  originalBody: ProtobufObject;
}

export type Result =
  | { wasModified: false }
  | {
      wasModified: true;
      modifiedBody: ProtobufObject;
    };
