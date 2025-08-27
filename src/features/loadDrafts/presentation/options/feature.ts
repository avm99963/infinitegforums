import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';
import { html } from 'lit';

export const loadDraftsFeature = new Feature({
  optionCodename: 'loaddrafts',
  name: msg('Load draft messages when replying', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    html`
      Enables the
      <code>enableLoadingDraftMessages</code>
      Community Console flag, which enables recovering an existing draft saved
      in the Google servers when you start a new reply.
    `,
    {
      desc: 'Description of the "Load draft messages when replying" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG],
});
