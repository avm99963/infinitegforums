import OptionsProviderAdapter from '@/infrastructure/services/options/OptionsProvider.adapter';
import ScriptRunner from '../../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import XHRInterceptorScript from '../../../../presentation/standaloneScripts/xhrInterceptor/xhrInterceptor.script';
import createMessageRemoveParentRef from '../../../../xhrInterceptor/responseModifiers/createMessageRemoveParentRef';
import flattenThread from '../../../../xhrInterceptor/responseModifiers/flattenThread';
import loadMoreThread from '../../../../xhrInterceptor/responseModifiers/loadMoreThread';
import { MWOptionsConfigurationRepositoryAdapter } from '@/options/infrastructure/repositories/MWOptionsConfiguration.repository.adapter';
import removeAbuseReviewTimestampsFromViewForum from '@/features/fixPEKB381989895/presentation/responseModifiers/viewForum/removeAbuseReviewTimestamps';
import limitViewForumMessages from '../../../../features/fixPEKB381989895/presentation/requestModifiers/viewForum/limitNumMessages';
import { SoftLockAfterReplyRequestModifier } from '@/features/replySoftLock/presentation/requestModifiers/createMessage/softLockAfterReply';
import { ReplySoftLockUserSelectionRepositoryAdapter } from '@/features/replySoftLock/infrastructure/repositories/userSelection.repository.adapter';
import DependenciesProviderSingleton, {
  StartupDataStorageDependency,
} from '@/common/architecture/dependenciesProvider/DependenciesProvider';
import StartupDataStorageAdapter from '@/infrastructure/services/communityConsole/startupDataStorage/StartupDataStorage.adapter';
import { CommunityConsoleApiClientAdapter } from '@/infrastructure/services/communityConsole/api/CommunityConsoleApiClient.adapter';
import { UrlThreadDataParserServiceAdapter } from '@/infrastructure/ui/services/communityConsole/urlThreadDataParser.service.adapter';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const optionsProvider = new OptionsProviderAdapter(
    new MWOptionsConfigurationRepositoryAdapter(),
  );

  const dependenciesProvider = DependenciesProviderSingleton.getInstance();
  const startupDataStorage = dependenciesProvider.getDependency(
    StartupDataStorageDependency,
    () => new StartupDataStorageAdapter(),
  );
  const ccApiClient = new CommunityConsoleApiClientAdapter(
    startupDataStorage.get().getAuthUser(),
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        new XHRInterceptorScript(
          [
            limitViewForumMessages,
            new SoftLockAfterReplyRequestModifier(
              new ReplySoftLockUserSelectionRepositoryAdapter(
                new UrlThreadDataParserServiceAdapter(),
              ),
              ccApiClient,
            ),
          ],
          [
            loadMoreThread,
            flattenThread,
            createMessageRemoveParentRef,
            removeAbuseReviewTimestampsFromViewForum,
          ],
          optionsProvider,
        ),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
