import { ChromeI18nPort, GetMessageRequest } from "@/services/i18n/chrome/ChromeI18n.port";

export default class ChromeI18nAdapter implements ChromeI18nPort {
  async getMessage(request: GetMessageRequest) {
    return chrome.i18n.getMessage(request.messageName, request.substitutions);
  }

  async getUILanguage() {
    return chrome.i18n.getUILanguage();
  }
}
