import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import { OptionsConfigurationRepositoryPort } from '../../../options/repositories/OptionsConfiguration.repository.port';
import MWOptionsConfigurationRepositoryServer from '../../mainWorldContentScriptBridge/optionsConfigurationRepository/Server';

export default class MWOptionsConfigurationRepositoryServerScript extends Script {
  // The server should be available as soon as possible.
  priority = 0;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  constructor(private readonly repository: OptionsConfigurationRepositoryPort) {
    super();
  }

  execute() {
    const server = new MWOptionsConfigurationRepositoryServer(this.repository);
    server.register();
  }
}
