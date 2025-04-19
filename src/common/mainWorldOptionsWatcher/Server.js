import PartialOptionsWatcher from '../options/partialOptionsWatcher.js';
import MainWorldContentScriptBridgeServer from '../../presentation/mainWorldContentScriptBridge/Server';

// Main World OptionsWatcher server (used in content scripts to be able to serve
// the options to Main World (MW) scripts).
export default class MWOptionsWatcherServer extends
    MainWorldContentScriptBridgeServer {
  constructor(CSTarget, MWTarget) {
    super(CSTarget, MWTarget);
    this.optionsWatcher = null;
    this.setUpHandler(this.handleMessage);
  }

  handleMessage(uuid, action, request) {
    if (action === 'setUp') {
      this.optionsWatcher = new PartialOptionsWatcher(request?.options);
      return;
    }

    if (!this.optionsWatcher) {
      console.warn(`[MWOptionsWatcherServer] Action '${
          action}' called before setting up options watcher.`);
      return;
    }

    switch (action) {
      case 'getOption':
        this.optionsWatcher.getOption(request?.option).then(value => {
          this._respond(uuid, value);
        });
        return;

      case 'getOptions':
        var promises = [];
        var options = request?.options ?? [];
        for (const option of options) {
          promises.push(this.optionsWatcher.getOption(option));
        }
        Promise.all(promises).then(responses => {
          const response = {};
          for (let i = 0; i < responses.length; i++) {
            response[options[i]] = responses[i];
          }
          this._respond(uuid, response);
        });
        return;

      case 'isEnabled':
        this.optionsWatcher.isEnabled(request?.option).then(value => {
          this._respond(uuid, value);
        });
        return;

      case 'areEnabled':
        var promises = [];
        var options = request?.options ?? [];
        for (const option of options) {
          promises.push(this.optionsWatcher.isEnabled(option));
        }
        Promise.all(promises).then(responses => {
          const response = {};
          for (let i = 0; i < responses.length; i++) {
            response[options[i]] = responses[i];
          }
          this._respond(uuid, response);
        });
        return;

      default:
        console.error(
            `[MWOptionsWatcherServer] Invalid action received (${action})`);
    }
  }
}
