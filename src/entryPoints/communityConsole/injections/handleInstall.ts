import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import HandleInstallScript from '../../../updateNotifier/presentation/scripts/handleInstall.script';
import { UpdateBannerInjectorAdapter } from '../../../updateNotifier/infrastructure/ui/injectors/updateBannerInjector.adapter';
import MWI18nServerScript from '../../../presentation/standaloneScripts/mainWorldServers/MWI18nServerScript.script';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        new MWI18nServerScript(),
        new HandleInstallScript(new UpdateBannerInjectorAdapter()),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
