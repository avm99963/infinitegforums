import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const avatarsFeature = new Feature({
  optionCodename: 'threadlistavatars',
  name: msg('Avatars', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Shows avatars of participants next to each thread.', {
    desc: 'Description of the "Avatars" feature.',
  }),
  tags: [COMMUNITY_CONSOLE_TAG],
});
