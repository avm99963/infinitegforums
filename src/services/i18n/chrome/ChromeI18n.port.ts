export type GetMessageRequest = {
  messageName: string;
  substitutions?: string[];
};

export interface ChromeI18nPort {
  /**
   * Retrieves the UI language set in Chrome.
   */
  getUILanguage(): Promise<string>;

  /**
   * Gets a message from the chrome.i18n API.
   */
  getMessage(request: GetMessageRequest): Promise<string>;
}
