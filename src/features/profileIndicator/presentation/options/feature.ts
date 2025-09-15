import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { SubOption } from '../../../../options/presentation/models/subOption';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import { html } from 'lit';

export const profileIndicatorFeature = () => new Feature({
  optionCodename: 'profileindicatoralt',
  name: msg('OP messages count', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    "Shows a badge next to the OP's username with the number of messages posted by them.",
    { desc: 'Description of the "OP messages count" feature.' },
  ),
  subOptions: [
    new SubOption({
      optionCodename: 'profileindicatoralt_months',
      label: msg('Months', {
        desc: 'Name of the suboption which lets you choose the number of months to show in the OP messages count badge.',
      }),
      type: { type: 'integer', min: 1, max: 12 },
    }),
  ],
  tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
});

// TODO(https://iavm.xyz/b/twpowertools/251): remove this feature once deprecated.
export const profileIndicatorDotFeature = () => new Feature({
  optionCodename: 'profileindicator',
  name: 'OP messages dot',
  description:
    "Shows a dot next to the OP's username colored depending on whether the OP has participated in other threads.",
  note: html`
    <b style="color: var(--md-sys-color-primary)">NOTE:</b>
    This option will be merged into the "OP messages count" option in the
    future.
  `,
  tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
});
