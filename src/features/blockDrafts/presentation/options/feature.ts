import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const blockDraftsFeature = () => new Feature({
  optionCodename: 'blockdrafts',
  name: msg('Block saving drafts', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Blocks saving drafts of your replies as you type to Google servers in the Community Console.',
    {
      desc: 'Description of the "Block saving drafts" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG()],
});
