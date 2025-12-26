// Run legacy Javascript entry point
import '@/contentScripts/publicThread';

import ProfileIndicatorStylesScript from '@/features/profileIndicator/presentation/scripts/styles.script';
import ProfileIndicatorTwBasicSetUpScript from '@/features/profileIndicator/presentation/scripts/twBasicSetUp.script';
import ScriptRunner from '@/infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '@/infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '@/infrastructure/presentation/scripts/SortedScriptsProvider.adapter';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Individual feature scripts
        new ProfileIndicatorStylesScript(),
        new ProfileIndicatorTwBasicSetUpScript(),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
