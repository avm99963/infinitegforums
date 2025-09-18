import MainWorldContentScriptBridgeClient from '../base/Client';
import { OptionCodename } from '../../../common/options/optionsPrototype';
import {
  ARE_ENABLED_ACTION,
  GET_OPTION_ACTION,
  GET_OPTIONS_ACTION,
  IS_ENABLED_ACTION,
  OptionsWatcherAction,
  OptionsWatcherActionMap,
} from './types';

/**
 * Main World OptionsWatcher client (used in scripts injected into the Main
 * World (MW) to get the options).
 *
 * @deprecated Use MWOptionsProviderAdapter
 */
export default class MWOptionsWatcherClient extends MainWorldContentScriptBridgeClient<
  OptionsWatcherAction,
  OptionsWatcherActionMap
> {
  protected MWTarget: string;
  protected CSTarget: string;

  private hasStartedSetUp = false;
  private setUpRequest: Promise<void> | undefined = undefined;

  constructor(
    private optionCodenames: OptionCodename[],
    CSTarget: string,
    MWTarget: string,
  ) {
    super();
    this.MWTarget = MWTarget;
    this.CSTarget = CSTarget;
  }

  async getOption(option: OptionCodename) {
    this.setUpIfNotAlready();
    if (!option) return null;
    return this.sendRequest(GET_OPTION_ACTION, { option });
  }

  async getOptions(options: OptionCodename[]) {
    this.setUpIfNotAlready();
    if (!options || options?.length === 0) return {};
    return this.sendRequest(GET_OPTIONS_ACTION, { options });
  }

  async isEnabled(option: OptionCodename) {
    this.setUpIfNotAlready();
    if (!option) return null;
    return this.sendRequest(IS_ENABLED_ACTION, { option });
  }

  async areEnabled(options: OptionCodename[]) {
    this.setUpIfNotAlready();
    if (!options || options?.length === 0) return {};
    return this.sendRequest(ARE_ENABLED_ACTION, { options });
  }

  private async setUpIfNotAlready() {
    if (!this.hasStartedSetUp) {
      this.setUpRequest = this.sendRequest('setUp', {
        options: this.optionCodenames,
      });
      this.hasStartedSetUp = true;
    }
    await this.setUpRequest;
  }
}
