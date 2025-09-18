// Run legacy Javascript entry point
import '../../../contentScripts/publicThreadStart';

import UiSpacingSharedStylesScript from '../../../features/uiSpacing/presentation/scripts/sharedStyles.script';
import UiSpacingTwBasicStylesScript from '../../../features/uiSpacing/presentation/scripts/twBasicStyles.script';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { OptionsConfigurationRepositoryAdapter } from '../../../options/infrastructure/repositories/OptionsConfiguration.repository.adapter';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const optionsProvider = new OptionsProviderAdapter(
    new OptionsConfigurationRepositoryAdapter(),
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Individual feature scripts
        new UiSpacingSharedStylesScript(optionsProvider),
        new UiSpacingTwBasicStylesScript(optionsProvider),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
