import { ActionPayload } from '../base/types';
import {
  OptionCodename,
  OptionsValues,
} from '../../../common/options/optionsPrototype';

export const SET_UP_ACTION = 'setUp';
export type SetUpRequest = { options: OptionCodename[] };
export type SetUpResponse = void;

export const GET_OPTION_ACTION = 'getOption';
export type GetOptionRequest = { option: OptionCodename };
export type GetOptionResponse = OptionsValues[OptionCodename];

export const GET_OPTIONS_ACTION = 'getOptions';
export type GetOptionsRequest = { options: OptionCodename[] };
export type GetOptionsResponse = Partial<OptionsValues>;

export const IS_ENABLED_ACTION = 'isEnabled';
export type IsEnabledRequest = { option: OptionCodename };
export type IsEnabledResponse = boolean;

export const ARE_ENABLED_ACTION = 'areEnabled';
export type AreEnabledRequest = { options: OptionCodename[] };
export type AreEnabledResponse = Partial<Record<OptionCodename, boolean>>;

export const actions = [
  SET_UP_ACTION,
  GET_OPTION_ACTION,
  GET_OPTIONS_ACTION,
  IS_ENABLED_ACTION,
  ARE_ENABLED_ACTION,
] as const;
export type OptionsWatcherAction = (typeof actions)[number];

export interface OptionsWatcherActionMap {
  [SET_UP_ACTION]: ActionPayload<SetUpRequest, SetUpResponse>;
  [GET_OPTION_ACTION]: ActionPayload<GetOptionRequest, GetOptionResponse>;
  [GET_OPTIONS_ACTION]: ActionPayload<GetOptionsRequest, GetOptionsResponse>;
  [IS_ENABLED_ACTION]: ActionPayload<IsEnabledRequest, IsEnabledResponse>;
  [ARE_ENABLED_ACTION]: ActionPayload<AreEnabledRequest, AreEnabledResponse>;
}
