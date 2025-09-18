import { OptionsConfigurationRepositoryPort } from '../../../options/repositories/OptionsConfiguration.repository.port';
import MainWorldContentScriptBridgeServer, { Handlers } from '../base/Server';
import {
  OPTIONS_CONFIGURATION_REPOSITORY_CS_TARGET,
  OPTIONS_CONFIGURATION_REPOSITORY_MW_TARGET,
} from './consts';
import {
  GET_ACTION,
  OptionsConfigurationRepositoryAction,
  OptionsConfigurationRepositoryActionMap,
} from './types';

/**
 * Main World options configuration repository server.
 */
export default class MWOptionsConfigurationRepositoryServer extends MainWorldContentScriptBridgeServer<
  OptionsConfigurationRepositoryAction,
  OptionsConfigurationRepositoryActionMap
> {
  protected CSTarget = OPTIONS_CONFIGURATION_REPOSITORY_CS_TARGET;
  protected MWTarget = OPTIONS_CONFIGURATION_REPOSITORY_MW_TARGET;

  protected handlers: Handlers<
    OptionsConfigurationRepositoryAction,
    OptionsConfigurationRepositoryActionMap
  > = {
    [GET_ACTION]: async () => (await this.repository.get()).optionsStatus,
  };

  constructor(private readonly repository: OptionsConfigurationRepositoryPort) {
    super();
  }
}
