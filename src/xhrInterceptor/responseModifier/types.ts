import { OptionsConfiguration } from '@/common/options/OptionsConfiguration';
import { OptionCodename } from '../../common/options/optionsPrototype';
import { ProtobufObject } from '../../common/protojs/protojs.types';

export interface ResponseModifier {
  urlRegex: RegExp;
  isEnabled(options: OptionsConfiguration): Boolean;
  interceptor(response: ProtobufObject, url: string): Promise<ProtobufObject>;
}
