import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const bulkMoveFeature = new Feature({
  optionCodename: 'bulkmove',
  name: msg('Bulk move', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Adds a button to move all selected threads at once.', {
    desc: 'Description of the "Bulk move" feature.',
  }),
  tags: [COMMUNITY_CONSOLE_TAG],
});
