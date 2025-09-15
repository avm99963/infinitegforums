import {CCApi} from '../../../../../common/api.js';
import {getAuthUser} from '../../../../../common/communityConsoleUtils.js';

const kPiiScanType_ScanNone = 0;
const kType_Reply = 1;
const kType_RecommendedAnswer = 3;
const kPostMethodCommunityConsole = 4;

const kVariablesRegex = /\$([A-Za-z_]+)/g;

export default class CRRunner {
  constructor() {
    this._CRs = [];
    this._haveCRsBeenLoaded = false;
  }

  async execute(action, thread) {
    // #!if !enable_bulk_crs
    return Promise.reject(new Error('Bulk CRs are not allowed temporarily.'));
    // #!else
    let crId = action?.getCannedResponseId?.();
    if (!crId)
      return Promise.reject(
          new Error('The action doesn\'t contain a valid CR id.'));

    const original_payload = await this._getCRPayload(crId);
    const payload = await this._templateSubstitute(original_payload, thread);
    let subscribe = action?.getSubscribe?.() ?? false;
    let markAsAnswer = action?.getMarkAsAnswer?.() ?? false;
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
      },
      4: subscribe,
      6: kPiiScanType_ScanNone,
    },
    /* authenticated = */ true, getAuthUser());
    // #!endif
  }

  async _getCRPayload(id) {
    if (!this._haveCRsBeenLoaded) {
      await this.loadCRs();
    }
    const cr = this._CRs.find(cr => cr?.[1]?.[1] == id);
    if (!cr) throw new Error(`Couldn't find CR with id ${id}.`);
    return cr?.[3];
  }

  async loadCRs() {
    const res = await CCApi(
      'ListCannedResponses', {}, /* authenticated = */ true,
      getAuthUser());
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
}
