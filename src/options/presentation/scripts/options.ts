import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { getFeatureCategories } from '../data/featureCategories';
import '../../ui/components/App';
import { isProdVersion } from '../../../common/extUtils';
import { OptionsConfigurationRepositoryAdapter } from '../../infrastructure/repositories/OptionsConfiguration.repository.adapter';

const SUPPORTED_LANGUAGES: string[] = ['en', 'es', 'ko', 'pt', 'ru'];

function main() {
  if (shouldShowOldPage()) {
    window.location.href = chrome.runtime.getURL('options/options_old.html');
    return;
  }

  const container = document.getElementById('container');
  const app = document.createElement('options-app');
  app.optionsProvider = new OptionsProviderAdapter(
    new OptionsConfigurationRepositoryAdapter(),
  );
  app.optionsModifier = new OptionsModifierAdapter();
  app.getFeatureCategories = getFeatureCategories;
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
