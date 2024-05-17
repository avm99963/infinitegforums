import {CCApi} from '../../../../../common/api.js';
import {getAuthUser} from '../../../../../common/communityConsoleUtils.js';

export default class AttributeRunner {
  async execute(attributeAction, thread) {
    if (!attributeAction) {
      throw new Error(
          'The workflow is malformed. The attribute action is missing.');
    }
    const action = attributeAction.getAttributeAction();

    return await CCApi(
        'SetThreadAttribute', {
          1: thread.forumId,
          2: thread.threadId,
          3: action,
        },
        /* authenticated = */ true, getAuthUser());
  }
}
