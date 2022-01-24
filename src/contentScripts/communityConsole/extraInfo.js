import {MDCTooltip} from '@material/tooltip';
import {waitFor} from 'poll-until-promise';

import {parseUrl} from '../../common/commonUtils.js';
import OptionsWatcher from '../../common/optionsWatcher.js';
import {createPlainTooltip} from '../../common/tooltip.js';

import {createExtBadge} from './utils/common.js';

const kViewUnifiedUserResponseEvent = 'TWPT_ViewUnifiedUserResponse';
const kListCannedResponsesResponse = 'TWPT_ListCannedResponsesResponse';
const kViewThreadResponse = 'TWPT_ViewThreadResponse';

const kAbuseCategories = [
  ['1', 'Account'],
  ['2', 'Display name'],
  ['3', 'Avatar'],
];
const kAbuseViolationCategories = {
  0: 'NO_VIOLATION',
  1: 'COMMUNITY_POLICY_VIOLATION',
  2: 'LEGAL_VIOLATION',
  3: 'CSAI_VIOLATION',
  4: 'OTHER_VIOLATION',
};
const kAbuseViolationTypes = {
  0: 'UNSPECIFIED',
  23: 'ACCOUNT_DISABLED',
  55: 'ACCOUNT_HAS_SERVICES_DISABLED',
  35: 'ACCOUNT_HIJACKED',
  96: 'ACCOUNT_LEAKED_CREDENTIALS',
  92: 'ACCOUNT_NOT_SUPPORTED',
  81: 'ARTISTIC_NUDITY',
  66: 'BAD_BEHAVIOR_PATTERN',
  78: 'BAD_ENGAGEMENT_BEHAVIOR_PATTERN',
  79: 'BORDERLINE_HARASSMENT',
  80: 'BORDERLINE_HATE_SPEECH',
  38: 'BOTNET',
  32: 'BRANDING_VIOLATION',
  100: 'CAPITALIZING_TRAGIC_EVENTS',
  105: 'CLOAKING',
  49: 'COIN_MINING',
  7: 'COMMERCIAL_CONTENT',
  97: 'COPPA_REGULATED',
  57: 'COPYRIGHT_CIRCUMVENTION',
  8: 'COPYRIGHTED_CONTENT',
  58: 'COURT_ORDER',
  51: 'CSAI',
  94: 'CSAI_INSPECT',
  52: 'CSAI_CARTOON_HUMOR',
  53: 'CSAI_SOLICITATION',
  108: 'CSAI_NON_APPARENT',
  67: 'DANGEROUS',
  37: 'DATA_SCRAPING',
  86: 'DECEPTIVE_OAUTH_IMPLEMENTATION',
  46: 'DEFAMATORY_CONTENT',
  36: 'DELINQUENT_BILLING',
  30: 'DISRUPTION_ATTEMPT',
  112: 'DOMESTIC_INTERFERENCE',
  22: 'DOS',
  9: 'DUPLICATE_CONTENT',
  68: 'DUPLICATE_LOCAL_PAGE',
  121: 'NON_QUALIFYING_ORGANIZATION',
  115: 'EGREGIOUS_INTERACTION_WITH_MINOR',
  83: 'ENGAGEMENT_COLLUSION',
  41: 'EXPLOIT_ATTACKS',
  65: 'FAKE_USER',
  2: 'FRAUD',
  21: 'FREE_TRIAL_VIOLATION',
  43: 'GIBBERISH',
  101: 'FOREIGN_INTERFERENCE',
  59: 'GOVERNMENT_ORDER',
  10: 'GRAPHICAL_VIOLENCE',
  11: 'HARASSMENT',
  12: 'HATE_SPEECH',
  90: 'IDENTICAL_PRODUCT_NAME',
  60: 'ILLEGAL_DRUGS',
  13: 'IMPERSONATION',
  69: 'IMPERSONATION_WITH_PII',
  116: 'INAPPROPRIATE_INTERACTION_WITH_MINOR',
  45: 'INAPPROPRIATE_CONTENT_SPEECH',
  106: 'INTENTIONAL_THWARTING',
  27: 'INTRUSION_ATTEMPT',
  87: 'INVALID_API_USAGE',
  14: 'INVALID_CONTENT',
  20: 'INVALID_GCE_USAGE',
  120: 'INVALID_STORAGE_USAGE',
  15: 'INVALID_IMAGE_QUALITY',
  88: 'INVALID_API_PRIVACY_POLICY_DISCLOSURE',
  54: 'INVALID_USAGE_OF_IP_PROXYING',
  99: 'KEYWORD_STUFFING',
  61: 'LEGAL_COUNTERFEIT',
  62: 'LEGAL_EXPORT',
  63: 'LEGAL_PRIVACY',
  33: 'LEGAL_REVIEW',
  91: 'LEGAL_PROTECTED',
  70: 'LOW_QUALITY_CONTENT',
  93: 'LOW_REPUTATION_PHONE_NUMBER',
  6: 'MALICIOUS_SOFTWARE',
  40: 'MALWARE',
  113: 'MISLEADING',
  114: 'MISREP_OF_ID',
  89: 'MEMBER_OF_ABUSIVE_GCE_NETWORK',
  84: 'NON_CONSENSUAL_EXPLICIT_IMAGERY',
  1: 'NONE',
  102: 'OFF_TOPIC',
  31: 'OPEN_PROXY',
  28: 'PAYMENT_FRAUD',
  16: 'PEDOPHILIA',
  71: 'PERSONAL_INFORMATION_CONTENT',
  25: 'PHISHING',
  34: 'POLICY_REVIEW',
  17: 'PORNOGRAPHY',
  29: 'QUOTA_CIRCUMVENTION',
  72: 'QUOTA_EXCEEDED',
  73: 'REGULATED',
  24: 'REPEATED_POLICY_VIOLATION',
  104: 'RESOURCE_COMPROMISED',
  107: 'REWARD_PROGRAMS_ABUSE',
  74: 'ROGUE_PHARMA',
  82: 'ESCORT',
  75: 'SPAMMY_LOCAL_VERTICAL',
  39: 'SEND_EMAIL_SPAM',
  117: 'SEXTORTION',
  118: 'SEX_TRAFFICKING',
  44: 'SEXUALLY_EXPLICIT_CONTENT',
  3: 'SHARDING',
  95: 'SOCIAL_ENGINEERING',
  109: 'SUSPICIOUS',
  19: 'TRADEMARK_CONTENT',
  50: 'TRAFFIC_PUMPING',
  76: 'UNSAFE_RACY',
  103: 'UNUSUAL_ACTIVITY_ALERT',
  64: 'UNWANTED_CONTENT',
  26: 'UNWANTED_SOFTWARE',
  77: 'VIOLENT_EXTREMISM',
  119: 'UNAUTH_IMAGES_OF_MINORS',
  85: 'UNAUTHORIZED_SERVICE_RESELLING',
  98: 'CSAI_EXTERNAL',
  5: 'SPAM',
  4: 'UNSAFE',
  47: 'CHILD_PORNOGRAPHY_INCITATION',
  18: 'TERRORISM_SUPPORT',
  56: 'CSAI_WORST_OF_WORST',
};
const kItemMetadataState = {
  0: 'UNDEFINED',
  1: 'PUBLISHED',
  2: 'DRAFT',
  3: 'AUTOMATED_ABUSE_TAKE_DOWN_HIDE',
  4: 'AUTOMATED_ABUSE_TAKE_DOWN_DELETE',
  13: 'AUTOMATED_ABUSE_REINSTATE',
  10: 'AUTOMATED_OFF_TOPIC_HIDE',
  14: 'AUTOMATED_FLAGGED_PENDING_MANUAL_REVIEW',
  5: 'USER_FLAGGED_PENDING_MANUAL_REVIEW',
  6: 'OWNER_DELETED',
  7: 'MANUAL_TAKE_DOWN_HIDE',
  17: 'MANUAL_PROFILE_TAKE_DOWN_SUSPEND',
  8: 'MANUAL_TAKE_DOWN_DELETE',
  18: 'REINSTATE_PROFILE_TAKEDOWN',
  9: 'REINSTATE_ABUSE_TAKEDOWN',
  11: 'CLEAR_OFF_TOPIC',
  12: 'CONFIRM_OFF_TOPIC',
  15: 'GOOGLER_OFF_TOPIC_HIDE',
  16: 'EXPERT_FLAGGED_PENDING_MANUAL_REVIEW',
};
const kShadowBlockReason = {
  0: 'REASON_UNDEFINED',
  1: 'ULTRON_LOW_QUALITY',
};

export default class ExtraInfo {
  constructor() {
    this.lastProfile = {
      body: {},
      id: -1,
      timestamp: 0,
    };
    this.lastCRsList = {
      body: {},
      id: -1,
      duplicateNames: new Set(),
    };
    this.lastThread = {
      body: {},
      id: -1,
      timestamp: 0,
    };
    this.optionsWatcher = new OptionsWatcher(['extrainfo']);
    this.setUpHandlers();
  }

  setUpHandlers() {
    window.addEventListener(kViewUnifiedUserResponseEvent, e => {
      if (e.detail.id < this.lastProfile.id) return;

      this.lastProfile = {
        body: e.detail.body,
        id: e.detail.id,
        timestamp: Date.now(),
      };
    });
    window.addEventListener(kListCannedResponsesResponse, e => {
      if (e.detail.id < this.lastCRsList.id) return;

      // Look if there are duplicate names
      const crs = e.detail.body?.['1'] ?? [];
      const names = crs.map(cr => cr?.['7']).slice().sort();
      let duplicateNames = new Set();
      for (let i = 1; i < names.length; i++)
        if (names[i - 1] == names[i]) duplicateNames.add(names[i]);

      this.lastCRsList = {
        body: e.detail.body,
        id: e.detail.id,
        duplicateNames,
      };
    });
    window.addEventListener(kViewThreadResponse, e => {
      if (e.detail.id < this.lastThread.id) return;

      this.lastThread = {
        body: e.detail.body,
        id: e.detail.id,
        timestamp: Date.now(),
      };
    });
  }

  // Whether the feature is enabled
  isEnabled() {
    return this.optionsWatcher.isEnabled('extrainfo');
  }

  // Add a pretty component which contains |info| to |node|.
  addExtraInfoElement(info, node) {
    // Don't create
    if (info.length == 0) return;

    let container = document.createElement('div');
    container.classList.add('TWPT-extrainfo-container');

    let badgeCell = document.createElement('div');
    badgeCell.classList.add('TWPT-extrainfo-badge-cell');

    const [badge, badgeTooltip] = createExtBadge();
    badgeCell.append(badge);

    let infoCell = document.createElement('div');
    infoCell.classList.add('TWPT-extrainfo-info-cell');

    for (const i of info) {
      let iRow = document.createElement('div');
      iRow.append(i);
      infoCell.append(iRow);
    }

    container.append(badgeCell, infoCell);
    node.append(container);
    new MDCTooltip(badgeTooltip);
  }

  fieldInfo(field, value) {
    let span = document.createElement('span');
    span.append(document.createTextNode(field + ': '));

    let valueEl = document.createElement('span');
    valueEl.style.fontFamily = 'monospace';
    valueEl.textContent = value;

    span.append(valueEl);
    return span;
  }

  /**
   * Profile functionality
   */
  injectAtProfile(card) {
    waitFor(
        () => {
          let now = Date.now();
          if (now - this.lastProfile.timestamp < 15 * 1000)
            return Promise.resolve(this.lastProfile);
          return Promise.reject(
              new Error('Didn\'t receive profile information'));
        },
        {
          interval: 500,
          timeout: 15 * 1000,
        })
        .then(profile => {
          let info = [];
          const abuseViolationCategory = profile.body?.['1']?.['6'];
          if (abuseViolationCategory) {
            info.push(this.fieldInfo(
                'Abuse category',
                kAbuseViolationCategories[abuseViolationCategory] ??
                    abuseViolationCategory));
          }

          const profileAbuse = profile.body?.['1']?.['1']?.['8'];

          for (const [index, category] of kAbuseCategories) {
            const violation = profileAbuse?.[index]?.['1']?.['1'];
            if (violation) {
              info.push(this.fieldInfo(
                  category + ' policy violation',
                  kAbuseViolationTypes[violation]));
            }
          }

          const appealCount = profileAbuse?.['4'];
          if (appealCount !== undefined)
            info.push(this.fieldInfo('Number of appeals', appealCount));

          this.addExtraInfoElement(info, card);
        })
        .catch(err => {
          console.error(
              'extraInfo: error while injecting profile extra info: ', err);
        });
  }

  injectAtProfileIfEnabled(card) {
    this.isEnabled().then(isEnabled => {
      if (isEnabled) return this.injectAtProfile(card);
    });
  }

  /**
   * Canned responses (CRs) functionality
   */
  getCRName(tags, isExpanded) {
    if (!isExpanded)
      return tags.parentNode?.querySelector?.('.text .name')?.textContent;

    // https://www.youtube.com/watch?v=Z6_ZNW1DACE
    return tags.parentNode?.parentNode?.parentNode?.parentNode?.parentNode
        ?.parentNode?.parentNode?.querySelector?.('.text .name')
        ?.textContent;
  }

  // Inject usage stats in the |tags| component of a CR
  injectAtCR(tags, isExpanded) {
    waitFor(() => {
      if (this.lastCRsList.id != -1) return Promise.resolve(this.lastCRsList);
      return Promise.reject(new Error('Didn\'t receive canned responses list'));
    }, {
      interval: 500,
      timeout: 15 * 1000,
    }).then(crs => {
      let name = this.getCRName(tags, isExpanded);

      // If another CR has the same name, there's no easy way to distinguish
      // them, so don't show the usage stats.
      if (crs.duplicateNames.has(name)) return;

      for (const cr of (crs.body?.['1'] ?? [])) {
        if (cr['7'] == name) {
          let tag = document.createElement('material-chip');
          tag.classList.add('TWPT-tag');

          let container = document.createElement('div');
          container.classList.add('TWPT-chip-content-container');

          let content = document.createElement('div');
          content.classList.add('TWPT-content');

          const [badge, badgeTooltip] = createExtBadge();

          let label = document.createElement('span');
          label.textContent = 'Used ' + (cr['8'] ?? '0') + ' times';

          content.append(badge, label);
          container.append(content);
          tag.append(container);
          tags.append(tag);

          new MDCTooltip(badgeTooltip);

          if (cr['9']) {
            const lastUsedTime = Math.floor(parseInt(cr['9']) / 1e3);
            let date = (new Date(lastUsedTime)).toLocaleString();
            createPlainTooltip(label, 'Last used: ' + date);
          }

          break;
        }
      }
    });
  }

  injectAtCRIfEnabled(tags, isExpanded) {
    // If the tag has already been injected, exit.
    if (tags.querySelector('.TWPT-tag')) return;

    this.isEnabled().then(isEnabled => {
      if (isEnabled) return this.injectAtCR(tags, isExpanded);
    });
  }

  /**
   * Thread view functionality
   */

  getPendingStateInfo(endPendingStateTimestampMicros) {
    const endPendingStateTimestamp =
        Math.floor(endPendingStateTimestampMicros / 1e3);
    const now = Date.now();
    if (endPendingStateTimestampMicros && endPendingStateTimestamp > now) {
      let span = document.createElement('span');
      span.textContent = 'Only visible to badged users';

      let date = new Date(endPendingStateTimestamp).toLocaleString();
      let pendingTooltip =
          createPlainTooltip(span, 'Visible after ' + date, false);
      return [span, pendingTooltip];
    }

    return [null, null];
  }

  getMetadataInfo(itemMetadata) {
    let info = [];

    const state = itemMetadata?.['1'];
    if (state && state != 1)
      info.push(this.fieldInfo('State', kItemMetadataState[state] ?? state));

    const shadowBlockInfo = itemMetadata?.['10'];
    const blockedTimestampMicros = shadowBlockInfo?.['2'];
    if (blockedTimestampMicros) {
      const isBlocked = shadowBlockInfo?.['1'];
      let span = document.createElement('span');
      span.textContent =
          isBlocked ? 'Shadow block active' : 'Shadow block no longer active';
      if (isBlocked) span.classList.add('TWPT-extrainfo-bad');
      info.push(span);
    }

    return info;
  }

  getLiveReviewStatusInfo(liveReviewStatus) {
    const verdict = liveReviewStatus?.['1'];
    if (!verdict) return [null, null];
    let label, labelClass;
    switch (verdict) {
      case 1:  // LIVE_REVIEW_RELEVANT
        label = 'Relevant';
        labelClass = 'TWPT-extrainfo-good';
        break;

      case 2:  // LIVE_REVIEW_OFF_TOPIC
        label = 'Off-topic';
        labelClass = 'TWPT-extrainfo-bad';
        break;

      case 3:  // LIVE_REVIEW_ABUSE
        label = 'Abuse';
        labelClass = 'TWPT-extrainfo-bad';
        break;
    }
    const reviewedBy = liveReviewStatus?.['2'];
    const timestamp = liveReviewStatus?.['3'];
    const date = (new Date(Math.floor(timestamp / 1e3))).toLocaleString();

    let a = document.createElement('a');
    a.href = 'https://support.google.com/s/community/user/' + reviewedBy;
    a.classList.add(labelClass);
    a.textContent = 'Live review verdict: ' + label;
    let liveReviewTooltip = createPlainTooltip(a, date, false);
    return [a, liveReviewTooltip];
  }

  injectAtQuestion(question) {
    let currentPage = parseUrl(location.href);
    if (currentPage === false) return;

    let content = question.querySelector('ec-question > .content');
    if (!content) return;

    waitFor(() => {
      let now = Date.now();
      let threadInfo = this.lastThread.body['1']?.['2']?.['1'];
      if (now - this.lastThread.timestamp < 15 * 1000 &&
          threadInfo?.['1'] == currentPage.thread &&
          threadInfo?.['3'] == currentPage.forum)
        return Promise.resolve(this.lastThread);
      return Promise.reject(new Error('Didn\'t receive thread information'));
    }, {
      interval: 500,
      timeout: 15 * 1000,
    }).then(thread => {
      let info = [];

      const endPendingStateTimestampMicros = thread.body['1']?.['2']?.['39'];
      const [pendingStateInfo, pendingTooltip] =
          this.getPendingStateInfo(endPendingStateTimestampMicros);
      if (pendingStateInfo) info.push(pendingStateInfo);

      // NOTE: These attributes don't seem to be included when calling
      // ViewThread (but are included when calling ViewForum).
      const isTrending = thread.body['1']?.['2']?.['25'];
      const isTrendingAutoMarked = thread.body['1']?.['39'];
      if (isTrendingAutoMarked)
        info.push(document.createTextNode('Automatically marked as trending'));
      else if (isTrending)
        info.push(document.createTextNode('Trending'));

      const itemMetadata = thread.body['1']?.['2']?.['12'];
      const mdInfo = this.getMetadataInfo(itemMetadata);
      info.push(...mdInfo);

      const liveReviewStatus = thread.body['1']?.['2']?.['38'];
      const [liveReviewInfo, liveReviewTooltip] =
          this.getLiveReviewStatusInfo(liveReviewStatus);
      if (liveReviewInfo) info.push(liveReviewInfo);

      this.addExtraInfoElement(info, content);
      if (pendingTooltip) new MDCTooltip(pendingTooltip);
      if (liveReviewTooltip) new MDCTooltip(liveReviewTooltip);
    });
  }

  injectAtQuestionIfEnabled(question) {
    this.isEnabled().then(isEnabled => {
      if (isEnabled) return this.injectAtQuestion(question);
    });
  }

  getMessagesByType(thread, type) {
    if (type === 'reply') return thread?.['1']?.['3'];
    if (type === 'lastMessage') return thread?.['1']?.['17']?.['3'];
    if (type === 'suggested') return thread?.['1']?.['17']?.['4'];
    if (type === 'recommended') return thread?.['1']?.['17']?.['1'];
  }

  getMessageByTypeAndIndex(thread, type, index) {
    return this.getMessagesByType(thread, type)?.[index];
  }

  // Returns true if the last message is included in the messages array (in the
  // extension context, we say those messages are of the type "reply").
  lastMessageInReplies(thread) {
    const lastMessageId = thread?.['1']?.['17']?.['3']?.[0]?.['1']?.['1'];
    if (!lastMessageId) return true;

    // If the last message is included in the lastMessage array, check if it
    // also exists in the messages/replies array.
    const replies = thread?.['1']?.['3'];
    if (!replies?.length) return false;
    const lastReplyIndex = replies.length - 1;
    const lastReplyId = replies[lastReplyIndex]?.['1']?.['1'];
    return lastMessageId && lastMessageId == lastReplyId;
  }

  getMessageInfo(thread, message) {
    const section = message.parentNode;

    let type = 'reply';
    if (section?.querySelector?.('.heading material-icon[icon="auto_awesome"]'))
      type = 'suggested';
    if (section?.querySelector?.('.heading material-icon[icon="check_circle"]'))
      type = 'recommended';

    let index = -1;
    let messagesInDom = section.querySelectorAll('ec-message');

    // Number of messages in the DOM.
    const n = messagesInDom.length;

    if (type !== 'reply') {
      for (let i = 0; i < n; ++i) {
        if (message.isEqualNode(messagesInDom[i])) {
          index = i;
          break;
        }
      }
    } else {
      // If the type of the message is a reply, things are slightly more
      // complex, since replies are paginated and the last message should be
      // treated separately (it is included diferently in the API response).
      let lastMessageInReplies = this.lastMessageInReplies(thread);
      if (message.isEqualNode(messagesInDom[n - 1]) && !lastMessageInReplies) {
        type = 'lastMessage';
        index = 0
      } else {
        // Number of messages in the current API response.
        const messagesInResponse = this.getMessagesByType(thread, type);
        const m = messagesInResponse.length;
        // If the last message is included in the replies array, we also have to
        // consider the last message in the DOM.
        let modifier = lastMessageInReplies ? 1 : 0;
        for (let k = 0; k < m; ++k) {
          let i = n - 2 - k + modifier;
          if (message.isEqualNode(messagesInDom[i])) {
            index = m - 1 - k;
            break;
          }
        }
      }
    }

    return [type, index];
  }

  injectAtMessage(messageNode) {
    let currentPage = parseUrl(location.href);
    if (currentPage === false) return;

    let footer = messageNode.querySelector('.footer-fill');
    if (!footer) return;

    const [type, index] =
        this.getMessageInfo(this.lastThread.body, messageNode);

    waitFor(() => {
      let now = Date.now();
      let threadInfo = this.lastThread.body['1']?.['2']?.['1'];
      if (now - this.lastThread.timestamp < 15 * 1000 &&
          threadInfo?.['1'] == currentPage.thread &&
          threadInfo?.['3'] == currentPage.forum) {
        const message =
            this.getMessageByTypeAndIndex(this.lastThread.body, type, index);
        if (message) return Promise.resolve(message);
      }

      return Promise.reject(new Error(
          'Didn\'t receive thread information (type: ' + type +
          ', index: ' + index + ')'));
    }, {
      interval: 1000,
      timeout: 15 * 1000,
    }).then(message => {
      let info = [];

      const endPendingStateTimestampMicros = message['1']?.['17'];
      const [pendingStateInfo, pendingTooltip] =
          this.getPendingStateInfo(endPendingStateTimestampMicros);
      if (pendingStateInfo) info.push(pendingStateInfo);

      const itemMetadata = message['1']?.['5'];
      const mdInfo = this.getMetadataInfo(itemMetadata);
      info.push(...mdInfo);

      const liveReviewStatus = message['1']?.['36'];
      const [liveReviewInfo, liveReviewTooltip] =
          this.getLiveReviewStatusInfo(liveReviewStatus);
      if (liveReviewInfo) info.push(liveReviewInfo);

      this.addExtraInfoElement(info, footer);
      if (pendingTooltip) new MDCTooltip(pendingTooltip);
      if (liveReviewTooltip) new MDCTooltip(liveReviewTooltip);
    });
  }

  injectAtMessageIfEnabled(message) {
    this.isEnabled().then(isEnabled => {
      if (isEnabled) return this.injectAtMessage(message);
    });
  }
}
