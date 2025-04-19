import PartialOptionsWatcher from '../../../common/options/partialOptionsWatcher.js';
import MainWorldContentScriptBridgeServer, { Handlers } from '../base/Server';
import {
  ARE_ENABLED_ACTION,
  GET_OPTION_ACTION,
  GET_OPTIONS_ACTION,
  IS_ENABLED_ACTION,
  OptionsWatcherAction,
  OptionsWatcherActionMap,
  SET_UP_ACTION,
} from './types';
import { OptionCodename } from '../../../common/options/optionsPrototype.js';

/**
 * Main World OptionsWatcher server (used in content scripts to be able to serve
 * the options to Main World (MW) scripts).
 */
export default class MWOptionsWatcherServer extends MainWorldContentScriptBridgeServer<
  OptionsWatcherAction,
  OptionsWatcherActionMap
> {
  protected CSTarget: string;
  protected MWTarget: string;

  protected handlers: Handlers<OptionsWatcherAction, OptionsWatcherActionMap> =
    {
      [SET_UP_ACTION]: ({ options }) => {
        this.optionsWatcher = new PartialOptionsWatcher(options);
      },
      [GET_OPTION_ACTION]: ({ option }) => {
        this.validateHasBeenSetUp();
        return this.optionsWatcher.getOption(option);
      },
      [GET_OPTIONS_ACTION]: ({ options }) => {
        this.validateHasBeenSetUp();
        return this.runActionForSeveralOptions(
          (option) => this.optionsWatcher.getOption(option),
          options,
        );
      },
      [IS_ENABLED_ACTION]: ({ option }) => {
        this.validateHasBeenSetUp();
        return this.optionsWatcher.isEnabled(option);
      },
      [ARE_ENABLED_ACTION]: async ({ options }) => {
        this.validateHasBeenSetUp();
        return this.runActionForSeveralOptions(
          (option) => this.optionsWatcher.isEnabled(option),
          options,
        );
      },
    };

  private optionsWatcher: PartialOptionsWatcher | undefined;

  constructor(CSTarget: string, MWTarget: string) {
    super();
    this.CSTarget = CSTarget;
    this.MWTarget = MWTarget;
    this.optionsWatcher = null;
  }

  private validateHasBeenSetUp() {
    if (this.optionsWatcher === undefined) {
      throw new Error(
        '[MWOptionsWatcherServer] An action was called before setting up the options watcher.',
      );
    }
  }

  private async runActionForSeveralOptions<R>(
    action: (option: OptionCodename) => R | Promise<R>,
    options: OptionCodename[],
  ) {
    options = options ?? [];

    const promises = options.map(async (option) => {
      const value = await action(option);
      return { option, value };
    });

    const results = await Promise.all(promises);
    const optionValues = Object.fromEntries(
      results.map((response) => [response.option, response.value]),
    );
    return optionValues;
  }
}
