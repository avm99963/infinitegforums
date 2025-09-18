import { OptionsStatus } from '../../../common/options/OptionsConfiguration';
import { ActionPayload } from '../base/types';

export const GET_ACTION = 'get';
export type GetRequest = void;
export type GetResponse = OptionsStatus;

export const actions = [GET_ACTION] as const;
export type OptionsConfigurationRepositoryAction = (typeof actions)[number];

export interface OptionsConfigurationRepositoryActionMap {
  [GET_ACTION]: ActionPayload<GetRequest, GetResponse>;
}
