import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';
import { SubOption } from '../../../../options/presentation/models/subOption';

export const interopThreadPageFeature = () => new Feature({
  optionCodename: 'interopthreadpage',
  name: msg('Change thread page design', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Forces showing the new or old thread page design.', {
    desc: 'Description of the "Change thread page design" feature.',
  }),
  note: msg(
    'The old thread page design is partially broken, but this feature is kept since some PEs rely on it to access some features that are missing in the new design.',
    {
      desc: 'Additional information shown in the options page about the "Change thread page design" feature.',
    },
  ),
  subOptions: [
    new SubOption({
      optionCodename: 'interopthreadpage_mode',
      label: msg('Design to show', {
        desc: 'Suboption for the "Change thread page design" feature.',
      }),
      type: {
        type: 'dropdown',
        options: [
          {
            label: msg('Old design', {
              desc: 'Selectable option for the "Design to show" suboption of the "Change thread page design" feature.',
            }),
            value: 'previous',
          },
          {
            label: msg('New design', {
              desc: 'Selectable option for the "Design to show" suboption of the "Change thread page design" feature.',
            }),
            value: 'next',
          },
        ],
      },
    }),
  ],
  tags: [COMMUNITY_CONSOLE_TAG()],
});
