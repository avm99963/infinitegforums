import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const ccForceHideDrawerFeature = () => new Feature({
  optionCodename: 'ccforcehidedrawer',
  name: msg('Hide sidebar by default', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Hides the sidebar when opening the Community Console.', {
    desc: 'Description of the "Hide sidebar by default" feature.',
  }),
  tags: [COMMUNITY_CONSOLE_TAG()],
});
