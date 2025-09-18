import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import MainWorldContentScriptBridgeClient from '../../../presentation/mainWorldContentScriptBridge/base/Client';
import {
  OPTIONS_CONFIGURATION_REPOSITORY_CS_TARGET,
  OPTIONS_CONFIGURATION_REPOSITORY_MW_TARGET,
} from '../../../presentation/mainWorldContentScriptBridge/optionsConfigurationRepository/consts';
import {
  GET_ACTION,
  OptionsConfigurationRepositoryAction,
  OptionsConfigurationRepositoryActionMap,
} from '../../../presentation/mainWorldContentScriptBridge/optionsConfigurationRepository/types';
import { OptionsConfigurationRepositoryPort } from '../../repositories/OptionsConfiguration.repository.port';

/**
 * Implementation of the repository of OptionsConfiguration for Main World
 * scripts that retrieves options from a Content Script server over a bridge.
 */
export class MWOptionsConfigurationRepositoryAdapter
  extends MainWorldContentScriptBridgeClient<
    OptionsConfigurationRepositoryAction,
    OptionsConfigurationRepositoryActionMap
  >
  implements OptionsConfigurationRepositoryPort
{
  protected CSTarget = OPTIONS_CONFIGURATION_REPOSITORY_CS_TARGET;
  protected MWTarget = OPTIONS_CONFIGURATION_REPOSITORY_MW_TARGET;

  async get(): Promise<OptionsConfiguration> {
    const optionsStatus = await this.sendRequest(GET_ACTION, undefined);
    return new OptionsConfiguration(optionsStatus);
  }

  addListener(): void {
    throw new Error('Not implemented.');
  }
}
