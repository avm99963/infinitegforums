import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { featureCategories } from '../featureCategories';
import '../components/App';
import { isProdVersion } from '../../../common/extUtils';

const SUPPORTED_LANGUAGES: string[] = ['en'];

function main() {
  if (shouldShowOldPage()) {
    window.location.href = chrome.runtime.getURL('options/options_old.html');
    return;
  }

  const container = document.getElementById('container');
  const app = document.createElement('options-app');
  app.optionsProvider = new OptionsProviderAdapter();
  app.optionsModifier = new OptionsModifierAdapter();
  app.featureCategories = featureCategories;
  app.isProdVersion = isProdVersion();
  container.append(app);
}

function shouldShowOldPage() {
  return !isLanguageSupported() && !isNewOptionsPageForced();
}

function isLanguageSupported() {
  const language = chrome.i18n.getUILanguage().toLowerCase();
  return SUPPORTED_LANGUAGES.some((supportedLanguage) =>
    language.startsWith(supportedLanguage),
  );
}

function isNewOptionsPageForced() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('no_redirect') === 'true';
}

main();
