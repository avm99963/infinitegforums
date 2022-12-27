import OptionsWatcher from '../../common/optionsWatcher.js';

// Main World OptionsWatcher server (used in content scripts to be able to serve
// the options to Main World (MW) scripts).
export default class MWOptionsWatcherServer {
  constructor(CSTarget, MWTarget) {
    if (!CSTarget || !MWTarget)
      throw new Error(
          `[MWOptionsWatcherServer] CSTarget and MWTarget are compulsory.`);

    this.optionsWatcher = null;
    this.CSTarget = CSTarget;
    this.MWTarget = MWTarget;

    window.addEventListener('message', e => this.handleMessage(e));
  }

  handleMessage(e) {
    const uuid = e.data?.uuid;
    if (e.source !== window || e.data?.target !== this.CSTarget || !uuid)
      return;

    if (e.data?.action === 'setUp') {
      this.optionsWatcher = new OptionsWatcher(e.data?.request?.options);
      return;
    }

    if (!this.optionsWatcher) {
      console.warn(`[MWOptionsWatcherServer] Action '${
          e.data?.action}' called before setting up options watcher.`);
      return;
    }

    switch (e.data?.action) {
      case 'getOption':
        this.optionsWatcher.getOption(e.data?.request?.option).then(value => {
          this.respond(uuid, value);
        });
        return;

      case 'getOptions':
        var promises = [];
        var options = e.data?.request?.options ?? [];
        for (const option of options) {
          promises.push(this.optionsWatcher.getOption(option));
        }
        Promise.all(promises).then(responses => {
          const response = {};
          for (let i = 0; i < responses.length; i++) {
            response[options[i]] = responses[i];
          }
          this.respond(uuid, response);
        });
        return;

      case 'isEnabled':
        this.optionsWatcher.isEnabled(e.data?.request?.option).then(value => {
          this.respond(uuid, value);
        });
        return;

      case 'areEnabled':
        var promises = [];
        var options = e.data?.request?.options ?? [];
        for (const option of options) {
          promises.push(this.optionsWatcher.isEnabled(option));
        }
        Promise.all(promises).then(responses => {
          const response = {};
          for (let i = 0; i < responses.length; i++) {
            response[options[i]] = responses[i];
          }
          this.respond(uuid, response);
        });
        return;

      default:
        console.error(`[MWOptionsWatcherServer] Invalid action received (${
            e.data?.action})`);
    }
  }

  respond(uuid, response) {
    const data = {
      target: this.MWTarget,
      uuid,
      response,
    };
    window.postMessage(data, window.origin);
  }
}
