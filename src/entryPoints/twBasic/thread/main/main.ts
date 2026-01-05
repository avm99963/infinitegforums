// Run legacy Javascript entry point
import '@/contentScripts/publicThread';

import ProfileIndicatorStylesScript from '@/features/profileIndicator/presentation/scripts/styles.script';
import ProfileIndicatorTwBasicSetUpScript from '@/features/profileIndicator/presentation/scripts/twBasicSetUp.script';
import ScriptRunner from '@/infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '@/infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '@/infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import ChromeI18nAdapter from '@/infrastructure/services/i18n/chrome/ChromeI18n.adapter';
import OptionsProviderAdapter from '@/infrastructure/services/options/OptionsProvider.adapter';
import { OptionsConfigurationRepositoryAdapter } from '@/options/infrastructure/repositories/OptionsConfiguration.repository.adapter';
import { getSyncStorageAreaRepository } from '@/storage/compositionRoot';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const chromeI18n = new ChromeI18nAdapter();
  const optionsProvider = new OptionsProviderAdapter(
    new OptionsConfigurationRepositoryAdapter(getSyncStorageAreaRepository()),
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Individual feature scripts
        new ProfileIndicatorStylesScript(),
        new ProfileIndicatorTwBasicSetUpScript(optionsProvider, chromeI18n),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
