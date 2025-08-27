import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { TAILWIND_BASIC_TAG } from '../../../../options/presentation/utils/featureUtils';

export const redirectFeature = new Feature({
  optionCodename: 'redirect',
  name: msg('Redirect to the Community Console', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Redirects all threads opened in Tailwind Basic to the Community Console.',
    { desc: 'Description of the "Redirect to the Community Console" feature.' },
  ),
  tags: [TAILWIND_BASIC_TAG],
});
