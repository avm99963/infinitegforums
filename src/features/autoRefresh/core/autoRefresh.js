import {MDCTooltip} from '@material/tooltip';

import {CCApi} from '../../../common/api.js';
import {getAuthUser} from '../../../common/communityConsoleUtils.js';
import {isOptionEnabled} from '../../../common/optionsUtils.js';
import {createPlainTooltip} from '../../../common/tooltip.js';

import {createExtBadge, softRefreshView} from '../../../contentScripts/communityConsole/utils/common.js';

var authuser = getAuthUser();

const threadListRequestEvent = 'TWPT_ViewForumRequest';
const threadListLoadEvent = 'TWPT_ViewForumResponse';
const intervalMs = 3 * 60 * 1000;  // 3 minutes

export default class AutoRefresh {
  constructor() {
    this.isLookingForUpdates = false;
    this.isUpdatePromptShown = false;
    this.lastTimestamp = null;
    this.forumId = null;
    this.filter = null;
    this.path = null;
    this.requestId = null;
    this.requestOrderOptions = null;
    this.snackbar = null;
    this.statusIndicator = null;
    this.interval = null;

    this.setUpHandlers();
  }

  isOrderedByTimestampDescending() {
    // This means we didn't intercept the request.
    if (!this.requestOrderOptions) return false;

    // Returns orderOptions.by == TIMESTAMP && orderOptions.desc == true
    return (
        this.requestOrderOptions?.[1] == 1 &&
        this.requestOrderOptions?.[2] == true);
  }

  getLastTimestamp() {
    return CCApi(
               'ViewForum', {
                 1: this.forumId,
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

    window.clearInterval(this.interval);
    this.isUpdatePromptShown = false;
    this.isLookingForUpdates = false;
  }

  showUpdatePrompt() {
    this.snackbar.classList.remove('TWPT-hidden');
    document.title = '[!!!] ' + document.title.replace('[!!!] ', '');
    this.isUpdatePromptShown = true;
  }

  // This function can be called even if the update prompt is not shown.
  hideUpdatePrompt() {
    if (this.snackbar) this.snackbar.classList.add('TWPT-hidden');
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

    let badge, badgeTooltip;
    [badge, badgeTooltip] = createExtBadge();

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
      softRefreshView();
    });

    content.append(badge, message, action);
    ft.append(content);
    nb.append(ft);
    ac.append(nb);
    snackbar.append(ac);
    pane.append(snackbar);
    document.getElementById('default-acx-overlay-container').append(pane);
    new MDCTooltip(badgeTooltip);
    this.snackbar = snackbar;
  }

  // Create an indicator element.
  createStatusIndicator(isSetUp) {
    var container = document.createElement('div');
    container.classList.add('TWPT-autorefresh-status-indicator-container');

    var indicator = document.createElement('div');
    indicator.classList.add(
        'TWPT-autorefresh-status-indicator',
        isSetUp ? 'TWPT-autorefresh-status-indicator--active' :
                  'TWPT-autorefresh-status-indicator--disabled');
    indicator.textContent =
        isSetUp ? 'notifications_active' : 'notifications_off';
    let label = chrome.i18n.getMessage(
        isSetUp ? 'inject_autorefresh_list_status_indicator_label_active' :
                  'inject_autorefresh_list_status_indicator_label_disabled');
    let statusTooltip = createPlainTooltip(indicator, label, false);

    let badge, badgeTooltip;
    [badge, badgeTooltip] = createExtBadge();

    container.append(indicator, badge);
    return [container, badgeTooltip, statusTooltip];
  }

  injectStatusIndicator(isSetUp) {
    let badgeTooltip, statusTooltip;
    [this.statusIndicator, badgeTooltip, statusTooltip] = this.createStatusIndicator(isSetUp);

    var sortOptionsDiv = document.querySelector('ec-thread-list .sort-options');
    if (sortOptionsDiv) {
      sortOptionsDiv.prepend(this.statusIndicator);
      new MDCTooltip(badgeTooltip);
      new MDCTooltip(statusTooltip);
      return;
    }

    console.error('threadListAvatars: Couldn\'t inject status indicator.');
  }

  checkUpdate() {
    if (location.pathname != this.path) {
      this.unregister();
      return;
    }

    if (!this.lastTimestamp) {
      console.error('autorefresh_list: this.lastTimestamp is not set.');
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

  setUpHandlers() {
    window.addEventListener(
        threadListRequestEvent, e => this.handleListRequest(e));
    window.addEventListener(threadListLoadEvent, e => this.handleListLoad(e));
  }

  // This will set the forum ID and filter which is going to be used to check
  // for new updates in the thread list.
  handleListRequest(e) {
    // If the request was made before the last known one, return.
    if (this.requestId !== null && e.detail.id < this.requestId) return;

    // Ignore ViewForum requests made by the chat feature and the "Mark as
    // duplicate" dialog.
    //
    // All those requests have |maxNum| set to 10 and 20 respectively, while the
    // request that we want to handle is the initial request to load the thread
    // list which currently requests 100 threads.
    var maxNum = e.detail.body?.['2']?.['1']?.['2'];
    if (maxNum == 10 || maxNum == 20) return;

    // Ignore requests to load more threads in the current thread list. All
    // those requests include a PaginationToken, and also have |maxNum| set
    // to 50.
    var token = e.detail.body?.['2']?.['1']?.['3'];
    if (token) return;

    this.requestId = e.detail.id;
    this.requestOrderOptions = e.detail.body?.['2']?.['2'];
    this.forumId = e.detail.body?.['1'] ?? '0';
    this.filter = e.detail.body?.['2']?.['12'] ?? '';

    console.debug(
        'autorefresh_list: handled valid ViewForum request (forumId: ' +
        this.forumId + ', filter: [' + this.filter + '])');
  }

  // This will set the timestamp of the first thread in the list, so we can
  // decide in the future whether there is an update or not.
  handleListLoad(e) {
    // We ignore past requests and only consider the most recent one.
    if (this.requestId !== e.detail.id) return;

    console.debug(
        'autorefresh_list: handling corresponding ViewForum response');

    this.lastTimestamp = e.detail.body?.['1']?.['2']?.[0]?.['2']?.['17'];
    if (this.lastTimestamp === undefined)
      console.error(
          'autorefresh_list: Unexpected body of response (' +
          (e.detail.body?.['1']?.['2']?.[0] === undefined ?
               'no threads were returned' :
               'the timestamp value is not present in the first thread') +
          ').');
  }

  // This is called when a thread list node is detected in the page. This
  // initializes the interval to check for updates, and several other things.
  setUp() {
    isOptionEnabled('autorefreshlist').then(isEnabled => {
      if (!isEnabled) return;

      if (!this.isOrderedByTimestampDescending()) {
        this.injectStatusIndicator(false);
        console.debug(
            'autorefresh_list: refused to start up because the order is not by timestamp descending.');
        return;
      }

      this.unregister();

      console.debug('autorefresh_list: starting set up...');

      if (this.snackbar === null) this.injectUpdatePrompt();
      this.injectStatusIndicator(true);

      this.isLookingForUpdates = true;
      this.path = location.pathname;

      var checkUpdateCallback = this.checkUpdate.bind(this);
      this.interval = window.setInterval(checkUpdateCallback, intervalMs);
    });
  }
};
