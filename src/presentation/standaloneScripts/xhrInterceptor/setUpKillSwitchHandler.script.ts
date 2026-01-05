import { SyncStorageAreaRepositoryPort } from '@/storage/repositories/syncStorageAreaRepository.port';
import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import XHRProxyKillSwitchHandler from '../../../xhrInterceptor/killSwitchHandler/killSwitchHandler';

export default class XHRInterceptorSetUpKillSwitchHandler extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Main;

  constructor(
    private readonly syncStorageAreaRepository: SyncStorageAreaRepositoryPort,
  ) {
    super();
  }

  // TODO(https://iavm.xyz/b/twpowertools/226): Refactor this to the DI
  // architecture. It will need changes to the classes being initialized here.
  execute() {
    new XHRProxyKillSwitchHandler(this.syncStorageAreaRepository);
  }
}
