import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';

export const fixCrPopupFeature = () =>
  new Feature({
    optionCodename: 'fixcrpopup',
    name: msg('Fix canned responses popup', {
      desc: 'Name of an extension feature.',
    }),
    description: msg(
      'Fixes the selection popup that appears when inserting a CR, so it is shown correctly when some CR has a very long title.',
      {
        desc: 'Description of the "Fix canned responses popup" feature.',
      },
    ),
    tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
  });
