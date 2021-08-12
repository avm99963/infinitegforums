import {CCApi} from '../../common/api.js';
import {getAuthUser} from '../../common/communityConsoleUtils.js';

import {createExtBadge} from './utils/common.js';

var authuser = getAuthUser();

const intervalMs = 3 * 60 * 1000;  // 3 minutes
const firstCallDelayMs = 3 * 1000;  // 3 seconds

export default class AutoRefresh {
  constructor() {
    this.isLookingForUpdates = false;
    this.isUpdatePromptShown = false;
    this.lastTimestamp = null;
    this.filter = null;
    this.path = null;
    this.snackbar = null;
    this.interval = null;
    this.firstCallTimeout = null;
  }

  getStartupData() {
    return JSON.parse(
        document.querySelector('html').getAttribute('data-startup'));
  }

  isOrderedByTimestampDescending() {
    var startup = this.getStartupData();
    // Returns orderOptions.by == TIMESTAMP && orderOptions.desc == true
    return (
        startup?.[1]?.[1]?.[3]?.[14]?.[1] == 1 &&
        startup?.[1]?.[1]?.[3]?.[14]?.[2] == true);
  }

  getCustomFilter(path) {
    var searchRegex = /^\/s\/community\/search\/([^\/]*)/;
    var matches = path.match(searchRegex);
    if (matches !== null && matches.length > 1) {
      var search = decodeURIComponent(matches[1]);
      var params = new URLSearchParams(search);
      return params.get('query') || '';
    }

    return '';
  }

  filterHasOverride(filter, override) {
    var escapedOverride = override.replace(/([^\w\d\s])/gi, '\\$1');
    var regex = new RegExp('[^a-zA-Z0-9]?' + escapedOverride + ':');
    return regex.test(filter);
  }

  getFilter(path) {
    var query = this.getCustomFilter(path);

    // Note: This logic has been copied and adapted from the
    // _buildQuery$1$threadId function in the Community Console
    var conditions = '';
    var startup = this.getStartupData();

    // TODO(avm99963): if the selected forums are changed without reloading the
    // page, this will get the old selected forums. Fix this.
    var forums = startup?.[1]?.[1]?.[3]?.[8] ?? [];
    if (!this.filterHasOverride(query, 'forum') && forums !== null &&
        forums.length > 0)
      conditions += ' forum:(' + forums.join(' | ') + ')';

    var langs = startup?.[1]?.[1]?.[3]?.[5] ?? [];
    if (!this.filterHasOverride(query, 'lang') && langs !== null &&
        langs.length > 0)
      conditions += ' lang:(' + langs.map(l => '"' + l + '"').join(' | ') + ')';

    if (query.length !== 0 && conditions.length !== 0)
      return '(' + query + ')' + conditions;
    return query + conditions;
  }

  getLastTimestamp() {
    return CCApi(
               'ViewForum', {
                 1: '0',  // TODO: Change, when only a forum is selected, it
                          // should be set here
                 // options
                 2: {
                   // pagination
                   1: {
                     2: 2,  // maxNum
                   },
                   // order
                   2: {
                     1: 1,     // by
                     2: true,  // desc
                   },
                   12: this.filter,  // forumViewFilters
                 },
               },
               /* authenticated = */ true, authuser)
        .then(body => {
          var timestamp = body?.[1]?.[2]?.[0]?.[2]?.[17];
          if (timestamp === undefined)
            throw new Error(
                'Unexpected body of response (' +
                (body?.[1]?.[2]?.[0] === undefined ?
                     'no threads were returned' :
                     'the timestamp value is not present in the first thread') +
                ').');

          return timestamp;
        });
    // TODO(avm99963): Add retry mechanism (sometimes thread lists are empty,
    // but when loading the next page the thread appears).
    //
    // NOTE(avm99963): It seems like loading the first 2 threads instead of only
    // the first one fixes this (empty lists are now rarely returned).
  }

  unregister() {
    console.debug('autorefresh_list: unregistering');

    if (!this.isLookingForUpdates) return;

    window.clearTimeout(this.firstCallTimeout);
    window.clearInterval(this.interval);
    this.isUpdatePromptShown = false;
    this.isLookingForUpdates = false;
  }

  showUpdatePrompt() {
    this.snackbar.classList.remove('TWPT-hidden');
    document.title = '[!!!] ' + document.title.replace('[!!!] ', '');
    this.isUpdatePromptShown = true;
  }

  hideUpdatePrompt() {
    this.snackbar.classList.add('TWPT-hidden');
    document.title = document.title.replace('[!!!] ', '');
    this.isUpdatePromptShown = false;
  }

  injectUpdatePrompt() {
    var pane = document.createElement('div');
    pane.classList.add('TWPT-pane-for-snackbar');

    var snackbar = document.createElement('material-snackbar-panel');
    snackbar.classList.add('TWPT-snackbar');
    snackbar.classList.add('TWPT-hidden');

    var ac = document.createElement('div');
    ac.classList.add('TWPT-animation-container');

    var nb = document.createElement('div');
    nb.classList.add('TWPT-notification-bar');

    var ft = document.createElement('focus-trap');

    var content = document.createElement('div');
    content.classList.add('TWPT-focus-content-wrapper');

    var badge = createExtBadge();

    var message = document.createElement('div');
    message.classList.add('TWPT-message');
    message.textContent =
        chrome.i18n.getMessage('inject_autorefresh_list_snackbar_message');

    var action = document.createElement('div');
    action.classList.add('TWPT-action');
    action.textContent =
        chrome.i18n.getMessage('inject_autorefresh_list_snackbar_action');

    action.addEventListener('click', e => {
      this.hideUpdatePrompt();
      document.querySelector('.app-title-button').click();
    });

    content.append(badge, message, action);
    ft.append(content);
    nb.append(ft);
    ac.append(nb);
    snackbar.append(ac);
    pane.append(snackbar);
    document.getElementById('default-acx-overlay-container').append(pane);
    this.snackbar = snackbar;
  }

  checkUpdate() {
    if (location.pathname != this.path) {
      this.unregister();
      return;
    }

    if (this.isUpdatePromptShown) return;

    console.debug('Checking for update at: ', new Date());

    this.getLastTimestamp()
        .then(timestamp => {
          if (timestamp != this.lastTimestamp) this.showUpdatePrompt();
        })
        .catch(
            err => console.error(
                'Coudln\'t get last timestamp (while updating): ', err));
  }

  firstCall() {
    console.debug(
        'autorefresh_list: now performing first call to finish setup (filter: [' +
        this.filter + '])');

    if (location.pathname != this.path) {
      this.unregister();
      return;
    }

    this.getLastTimestamp()
        .then(timestamp => {
          this.lastTimestamp = timestamp;
          var checkUpdateCallback = this.checkUpdate.bind(this);
          this.interval = window.setInterval(checkUpdateCallback, intervalMs);
        })
        .catch(
            err => console.error(
                'Couldn\'t get last timestamp (while setting up): ', err));
  }

  setUp() {
    if (!this.isOrderedByTimestampDescending()) return;

    this.unregister();

    console.debug('autorefresh_list: starting set up...');

    if (this.snackbar === null) this.injectUpdatePrompt();
    this.isLookingForUpdates = true;
    this.path = location.pathname;
    this.filter = this.getFilter(this.path);

    var firstCall = this.firstCall.bind(this);
    this.firstCallTimeout = window.setTimeout(firstCall, firstCallDelayMs);
  }
};
