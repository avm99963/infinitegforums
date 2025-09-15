import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const stickySidebarHeadersFeature = () => new Feature({
  optionCodename: 'stickysidebarheaders',
  name: msg('Sticky sidebar headers', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    "Makes the headers of the collapsible sections in the sidebar sticky so they don't disappear when scrolling down.",
    { desc: 'Description of the "Sticky sidebar headers" feature.' },
  ),
  tags: [COMMUNITY_CONSOLE_TAG()],
});
