import { ActionPayload } from '../base/types';

export const GET_UI_LANGUAGE_ACTION = 'getUILanguage';
export type GetUILanguageRequest = void;
export type GetUILanguageResponse = string;

export const actions = [GET_UI_LANGUAGE_ACTION] as const;
export type I18nAction = (typeof actions)[number];

export interface I18nActionMap {
  [GET_UI_LANGUAGE_ACTION]: ActionPayload<
    GetUILanguageRequest,
    GetUILanguageResponse
  >;
}
