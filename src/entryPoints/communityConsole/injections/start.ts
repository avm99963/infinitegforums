import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import XHRInterceptorScript from '../../../presentation/standaloneScripts/xhrInterceptor/xhrInterceptor.script';
import createMessageRemoveParentRef from '../../../xhrInterceptor/responseModifiers/createMessageRemoveParentRef';
import flattenThread from '../../../xhrInterceptor/responseModifiers/flattenThread';
import loadMoreThread from '../../../xhrInterceptor/responseModifiers/loadMoreThread';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        new XHRInterceptorScript([
          loadMoreThread,
          flattenThread,
          createMessageRemoveParentRef,
        ]),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
