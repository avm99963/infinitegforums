import { ActionPayload } from '../base/types';

export const GET_MESSAGE_ACTION = 'getMessage';
export type GetMessageRequest = {
  messageName: string;
  substitutions?: string[];
};
export type GetMessageResponse = string;

export const GET_UI_LANGUAGE_ACTION = 'getUILanguage';
export type GetUILanguageRequest = void;
export type GetUILanguageResponse = string;

export const actions = [GET_MESSAGE_ACTION, GET_UI_LANGUAGE_ACTION] as const;
export type I18nAction = (typeof actions)[number];

export interface I18nActionMap {
  [GET_MESSAGE_ACTION]: ActionPayload<GetMessageRequest, GetMessageResponse>;
  [GET_UI_LANGUAGE_ACTION]: ActionPayload<
    GetUILanguageRequest,
    GetUILanguageResponse
  >;
}
