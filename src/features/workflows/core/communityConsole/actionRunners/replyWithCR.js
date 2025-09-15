import {CCApi} from '../../../../../common/api.js';
import {getAuthUser} from '../../../../../common/communityConsoleUtils.js';

const kPiiScanType_ScanNone = 0;
const kType_Reply = 1;
const kType_RecommendedAnswer = 3;
const kPostMethodCommunityConsole = 4;
const kSourceMessageTypeCannedResponse = 9;

const kVariablesRegex = /\$([A-Za-z_]+)/g;
const kLicense =
    'I AGREE TO USE THE WORKFLOWS FUNCTIONALITY ETHICALLY AND ACCORDING TO THE PE PROGRAM AND FORUM RULES. I UNDERSTAND THAT MAINTAINERS MAY REVOKE MY ACCESS TO THIS FEATURE AT THEIR SOLE DISCRETION IF THEY BELIEVE I HAVE MISUSED IT.';

export default class CRRunner {
  constructor() {
    this._CRs = [];
    this._haveCRsBeenLoaded = false;
  }

  async execute(action, thread) {
    let crId = action?.getCannedResponseId?.();
    if (!crId)
      return Promise.reject(
          new Error('The action doesn\'t contain a valid CR id.'));

    const tags = await this._getCRTags(crId);
    // #!if !enable_bulk_crs
    if (!tags.some(tag => tag.trim() == kLicense)) {
      return Promise.reject(new Error('Bulk CRs are not allowed temporarily.'));
    }
    // #!endif

    const original_payload = await this._getCRPayload(crId);
    const payload = this._addFingerprint(
        await this._templateSubstitute(original_payload, thread));
    let subscribe = action?.getSubscribe?.() ?? false;
    let markAsAnswer = action?.getMarkAsAnswer?.() ?? false;
    const sourceCannedResponse = {
      // source_message_id
      1: crId,
      2: kSourceMessageTypeCannedResponse,
      // attribution
      6: [{
        // title
        1: 'TW Power Tools (workflows feature)',
        // url
        2: 'https://s.iavm.xyz/twpt-bulk-crs-in-workflows',
      }],
    };
    return await CCApi(
        'CreateMessage', {
          1: thread.forumId,
          2: thread.threadId,
          // message
          3: {
            4: payload,
            6: {
              1: markAsAnswer ? kType_RecommendedAnswer : kType_Reply,
            },
            11: kPostMethodCommunityConsole,
            // source_message
            42: sourceCannedResponse,
            // canned_response_sources
            44: [sourceCannedResponse],
          },
          4: subscribe,
          6: kPiiScanType_ScanNone,
        },
        /* authenticated = */ true, getAuthUser());
  }

  async _getCRTags(id) {
    const cr = await this._getCR(id);
    return cr?.[6] ?? [];
  }

  async _getCRPayload(id) {
    const cr = await this._getCR(id);
    return cr?.[3];
  }

  async _getCR(id) {
    if (!this._haveCRsBeenLoaded) {
      await this.loadCRs();
    }
    const cr = this._CRs.find(cr => cr?.[1]?.[1] == id);
    if (!cr) throw new Error(`Couldn't find CR with id ${id}.`);
    return cr;
  }

  async loadCRs() {
    const res = await CCApi(
        'ListCannedResponses', {}, /* authenticated = */ true, getAuthUser());
    this._CRs = res?.[1] ?? [];
    this._haveCRsBeenLoaded = true;
  }

  async _templateSubstitute(payload, thread) {
    if (!payload.match(kVariablesRegex)) {
      return payload;
    }

    await thread.loadThreadDetails();
    return payload.replaceAll(kVariablesRegex, (_, p1) => {
      return thread?.[p1] ?? '';
    });
  }

  _addFingerprint(payload) {
    return `${
        payload}<div aria-label=""><div><div aria-label=""></div></div></div>`;
  }
}
