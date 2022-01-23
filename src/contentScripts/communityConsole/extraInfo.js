import {MDCTooltip} from '@material/tooltip';
import {waitFor} from 'poll-until-promise';

import {isOptionEnabled} from '../../common/optionsUtils.js';
import {createPlainTooltip} from '../../common/tooltip.js';

import {createExtBadge} from './utils/common.js';

const kViewUnifiedUserResponseEvent = 'TWPT_ViewUnifiedUserResponse';
const kListCannedResponsesResponse = 'TWPT_ListCannedResponsesResponse';

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
  }

  // Whether the feature is enabled
  isEnabled() {
    return isOptionEnabled('extrainfo');
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

  // Profile functionality
  injectAtProfile(card) {
    waitFor(
        () => {
          let now = Date.now();
          if (now - this.lastProfile.timestamp < 15 * 1000)
            return Promise.resolve(this.lastProfile);
          return Promise.reject('Didn\'t receive profile information');
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

  // Canned responses (CRs) functionality

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
      return Promise.reject('Didn\'t receive canned responses list');
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
}
