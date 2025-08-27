import { msg } from '@lit/localize';
import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { Feature } from '../models/feature';
import { SubOption } from '../models/subOption';
import '../components/App';
import { FeatureCategory } from '../models/category';
import { FeatureSection } from '../models/section';
import { html } from 'lit';

const categories = [
  new FeatureCategory({
    id: 'general',
    name: msg('General', {
      desc: 'Name of the category of extension features which apply to multiple areas to the forums platform.',
    }),
    features: [
      new Feature({
        optionCodename: 'ccdarktheme',
        name: msg('Dark theme', {
          desc: 'Name of an extension feature.',
        }),
        description: msg(
          'Enables choosing between a custom-built dark theme and the vanilla light theme in the Community Console.',
          { desc: 'Description of the "Dark theme" feature.' },
        ),
        note: msg(
          html`
            <i>Automatic:</i>
            will use the theme defined in the system settings.
            <br />
            <i>Manual:</i>
            will add a button to the Community Console which lets you switch the
            theme.
          `,
          {
            desc: 'Note for the "Theme" feature.',
          },
        ),
        subOptions: [
          new SubOption({
            optionCodename: 'ccdarktheme_mode',
            label: msg('Theme', {
              desc: 'Name of a suboption of the "Dark theme" feature.',
            }),
            type: {
              type: 'dropdown',
              options: [
                {
                  label: msg('Automatic', {
                    desc: 'Selectable option for the "Theme" suboption of the "Dark theme" feature.',
                  }),
                  value: 'system',
                },
                {
                  label: msg('Manual', {
                    desc: 'Selectable option for the "Theme" suboption of the "Dark theme" feature.',
                  }),
                  value: 'switch',
                },
              ],
            },
          }),
        ],
        demoMedia: {},
        tags: ['Community Console'],
      }),
    ],
  }),
  new FeatureCategory({
    id: 'threads',
    name: msg('Threads', {
      desc: 'Name of the category of extension features related to threads.',
    }),
    note: 'Test',
    features: [
      new Feature({
        optionCodename: 'profileindicatoralt',
        name: msg('OP messages count', {
          desc: 'Name of an extension feature.',
        }),
        description: msg(
          "Shows a badge next to the OP's username with the number of messages posted by them.",
          { desc: 'Description of the "OP messages count" feature.' },
        ),
        subOptions: [
          new SubOption({
            optionCodename: 'profileindicatoralt_months',
            label: msg('Months', {
              desc: 'Name of the suboption which lets you choose the number of months to show in the OP messages count badge.',
            }),
            type: { type: 'integer', min: 1, max: 12 },
          }),
        ],
        demoMedia: {},
        tags: ['Community Console'],
      }),
      new Feature({
        optionCodename: 'interopthreadpage',
        name: msg('Change thread page design', {
          desc: 'Name of an extension feature.',
        }),
        description: msg('Forces showing the new or old thread page design.', {
          desc: 'Description of the "Change thread page design" feature.',
        }),
        note: msg(
          'The old thread page design is partially broken, but this feature is kept since some PEs rely on the old design to access some missing features.',
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
        tags: ['Community Console'],
      }),
    ],
    sections: [
      new FeatureSection({
        name: msg('Bulk actions', {
          desc: 'Name of a section inside the feature category "Threads".',
        }),
        note: 'Test',
        features: [
          new Feature({
            optionCodename: 'bulkreportreplies',
            name: msg('Report replies quickly', {
              desc: 'Name of an extension feature.',
            }),
            description: msg(
              'Adds quick report buttons to all replies, so you can report each one with a single click.',
              { desc: 'Description of the "Report replies quickly" feature.' },
            ),
            tags: ['Tailwind Basic', 'Community Console'],
          }),
        ],
      }),
    ],
  }),
];

const container = document.getElementById('container');
const app = document.createElement('options-app');
app.optionsProvider = new OptionsProviderAdapter();
app.optionsModifier = new OptionsModifierAdapter();
app.featureCategories = categories;
container.append(app);
