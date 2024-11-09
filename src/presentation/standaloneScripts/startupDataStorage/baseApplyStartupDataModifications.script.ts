import Script, {
  ScriptEnvironment,
  ScriptPage,
} from '../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../services/communityConsole/StartupDataStorage.port';

/**
 * Base class which applies pending startup data modifications which have been
 * added by other scripts.
 */
export default abstract class BaseApplyStartupDataModificationsScript extends Script {
  priority = 2 ** 32;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;

  constructor(private startupDataStorage: StartupDataStoragePort) {
    super();
  }

  execute() {
    this.startupDataStorage.applyModifications();
  }
}
