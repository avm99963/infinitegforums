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
import limitViewForumMessages from '../../../../features/fixPEKB381989895/presentation/requestModifiers/viewForum/limitNumMessages'; // New import

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const optionsProvider = new OptionsProviderAdapter(
    new MWOptionsConfigurationRepositoryAdapter(),
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        new XHRInterceptorScript(
          [
            limitViewForumMessages,
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
