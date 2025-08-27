import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const ccDragAndDropFixFeature = new Feature({
  optionCodename: 'ccdragndropfix',
  name: msg('Fix drag and dropping links', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Allows to drag and drop links to the text editor while preserving the link text.',
    {
      desc: 'Description of the "Fix drag and dropping links" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG],
});
