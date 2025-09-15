import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const enhancedAnnouncementsDotFeature = () => new Feature({
  optionCodename: 'enhancedannouncementsdot',
  name: msg('Highlight announcements notification dot', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Shows more prominently the dot that appears in the Community Console when Googlers publish a new announcement.',
    {
      desc: 'Description of the "Highlight announcements notification dot" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG()],
});
