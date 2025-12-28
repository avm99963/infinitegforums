import { ProtobufObject } from '../../common/protojs/protojs.types';
import { MatchableModifier } from '../modifierMatcher/types';

export interface ResponseModifier extends MatchableModifier {
  interceptor(response: ProtobufObject, url: string): Promise<ProtobufObject>;
}
