import { html } from 'lit';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';
import { msg } from '@lit/localize';

export const fixPEKB381989895Feature = () =>
  new Feature({
    optionCodename: 'fixpekb381989895',
    name: msg('Attempt to fix performance issues', {
      desc: 'Name of an extension feature.',
    }),
    // prettier-ignore
    description: msg(
      html`Best-effort workaround for the issues discussed at <a href="https://support.google.com/s/community/forum/51488989/thread/381989895" target="_blank">pekb/381989895</a>.
      `,
      {
        desc: 'Description of the "Sticky bulk actions toolbar" feature.',
      },
    ),
    tags: [COMMUNITY_CONSOLE_TAG()],
  });
