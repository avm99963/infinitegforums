import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const fixLinkDialogFeature = () => new Feature({
  optionCodename: 'fixlinkdialog',
  name: msg('Fix link dialog', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Patches the bug that incorrectly opens the link dialog multiple times when adding or editing a link.', {
    desc: 'Description of the "Fix link dialog" feature.',
  }),
  tags: [COMMUNITY_CONSOLE_TAG()],
});
