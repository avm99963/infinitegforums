import Script from '../../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../../common/contentScriptsUtils';
import { kImportParam } from '../../core/communityConsole/import';

export default class WorkflowsImportStylesheetScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    const searchParams = new URLSearchParams(document.location.search);
    if (searchParams.has(kImportParam)) {
      injectStylesheet(chrome.runtime.getURL('css/workflow_import.css'));
    }
  }
}
