import {
  OptionCodename,
  OptionsValues,
} from '../../common/options/optionsPrototype';
import { ProtobufObject } from '../../common/protojs.types';

export interface Modifier {
  urlRegex: RegExp;
  featureGated: Boolean;
  features: OptionCodename[];
  isEnabled(options: OptionsValues): Boolean;
  interceptor(response: ProtobufObject, url: string): Promise<ProtobufObject>;
}
