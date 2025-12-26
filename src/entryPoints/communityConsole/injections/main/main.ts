import {
  InteropOPLinkProfileIndicatorHandler,
  InteropV2OPLinkProfileIndicatorHandler,
  LegacyOPLinkProfileIndicatorHandler,
} from '@/features/profileIndicator/presentation/nodeWatcherHandlers/opLink.handler';
import FixInsertLinkCommandHandler from '../../../../features/linkDialogFix/presentation/nodeWatcherHandlers/fixInsertLinkCommand.handler';
import { NodeWatcherAdapter } from '../../../../infrastructure/presentation/nodeWatcher/NodeWatcher.adapter';
import NodeWatcherScriptAdapter from '../../../../infrastructure/presentation/scripts/NodeWatcherScript.adapter';
import ScriptRunner from '../../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import OptionsProviderAdapter from '../../../../infrastructure/services/options/OptionsProvider.adapter';
import { MWOptionsConfigurationRepositoryAdapter } from '../../../../options/infrastructure/repositories/MWOptionsConfiguration.repository.adapter';
import { NodeWatcherHandler } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import MWI18nClient from '@/presentation/mainWorldContentScriptBridge/i18n/Client';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const chromeI18n = new MWI18nClient();
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
            [
              'legacyOpLinkProfileIndicator',
              new LegacyOPLinkProfileIndicatorHandler(optionsProvider, chromeI18n),
            ],
            [
              'interopOpLinkProfileIndicator',
              new InteropOPLinkProfileIndicatorHandler(optionsProvider, chromeI18n),
            ],
            [
              'interopV2OpLinkProfileIndicator',
              new InteropV2OPLinkProfileIndicatorHandler(optionsProvider, chromeI18n),
            ],
          ]),
        ),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
