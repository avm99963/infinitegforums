import FixInsertLinkCommandHandler from '../../../features/linkDialogFix/nodeWatcherHandlers/fixInsertLinkCommand.handler';
import { NodeWatcherAdapter } from '../../../infrastructure/presentation/nodeWatcher/NodeWatcher.adapter';
import NodeWatcherScriptAdapter from '../../../infrastructure/presentation/scripts/NodeWatcherScript.adapter';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { MWOptionsConfigurationRepositoryAdapter } from '../../../options/infrastructure/repositories/MWOptionsConfiguration.repository.adapter';
import { NodeWatcherHandler } from '../../../presentation/nodeWatcher/NodeWatcherHandler';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const optionsProvider = new OptionsProviderAdapter(
    new MWOptionsConfigurationRepositoryAdapter(),
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        new NodeWatcherScriptAdapter(
          new NodeWatcherAdapter(),
          new Map<string, NodeWatcherHandler>([
            [
              'fixInsertLinkCommand',
              new FixInsertLinkCommandHandler(optionsProvider),
            ],
          ]),
        ),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
