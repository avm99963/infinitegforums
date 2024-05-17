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

  loadCRs() {
    return CCApi(
               'ListCannedResponses', {}, /* authenticated = */ true,
               getAuthUser())
        .then(res => {
          this._CRs = res?.[1] ?? [];
          this._haveCRsBeenLoaded = true;
        });
  }

  _getCRPayload(id) {
    let maybeLoadCRsPromise;
    if (!this._haveCRsBeenLoaded)
      maybeLoadCRsPromise = this.loadCRs();
    else
      maybeLoadCRsPromise = Promise.resolve();

    return maybeLoadCRsPromise.then(() => {
      let cr = this._CRs.find(cr => cr?.[1]?.[1] == id);
      if (!cr) throw new Error(`Couldn't find CR with id ${id}.`);
      return cr?.[3];
    });
  }

  _templateSubstitute(payload, thread) {
    if (!payload.match(kVariablesRegex)) return Promise.resolve(payload);

    return thread.loadThreadDetails().then(() => {
      return payload.replaceAll(kVariablesRegex, (_, p1) => {
        return thread?.[p1] ?? '';
      });
    });
  }

  execute(action, thread) {
    let crId = action?.getCannedResponseId?.();
    if (!crId)
      return Promise.reject(
          new Error('The action doesn\'t contain a valid CR id.'));

    return this._getCRPayload(crId)
        .then(payload => this._templateSubstitute(payload, thread))
        .then(payload => {
          let subscribe = action?.getSubscribe?.() ?? false;
          let markAsAnswer = action?.getMarkAsAnswer?.() ?? false;
          return CCApi(
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
        });
  }
}
