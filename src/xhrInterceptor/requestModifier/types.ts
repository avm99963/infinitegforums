import { ProtobufObject } from '../../common/protojs/protojs.types';
import { MatchableModifier } from '../modifierMatcher/types';

export interface RequestModifier extends MatchableModifier {
  interceptor(body: ProtobufObject, url: string): Promise<ProtobufObject>;
}
