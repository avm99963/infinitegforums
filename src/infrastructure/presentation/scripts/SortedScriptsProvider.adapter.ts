import Script from '../../../common/architecture/scripts/Script';
import { ScriptProviderPort } from '../../../presentation/scripts/ScriptProvider.port';
import { ScriptSorterPort } from '../../../presentation/scripts/ScriptSorter.port';

export class SortedScriptsProviderAdapter implements ScriptProviderPort {
  private sortedScripts: Script[] | undefined;

  constructor(
    private scripts: Script[],
    private scriptSorter: ScriptSorterPort,
  ) {}

  getScripts() {
    if (this.sortedScripts === undefined) {
      this.sortedScripts = this.scriptSorter.sort(this.scripts);
    }
    return this.sortedScripts;
  }
}
