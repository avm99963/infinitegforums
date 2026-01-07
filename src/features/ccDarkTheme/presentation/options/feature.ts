import { msg } from '@lit/localize';
import { html } from 'lit';
import { Feature } from '../../../../options/presentation/models/feature';
import { SubOption } from '../../../../options/presentation/models/subOption';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';
import screenshot from './assets/screenshot.avif';

const automaticOptionLabel = msg('Automatic', {
  desc: 'Selectable option for the "Theme" suboption of the "Dark theme" feature.',
});
const manualOptionLabel = msg('Manual', {
  desc: 'Selectable option for the "Theme" suboption of the "Dark theme" feature.',
});

export const ccDarkThemeFeature = () =>
  new Feature({
    optionCodename: 'ccdarktheme',
    name: msg('Dark theme', {
      desc: 'Name of an extension feature.',
    }),
    description: msg(
      'Enables choosing between a custom-built dark theme and the vanilla light theme in the Community Console.',
      { desc: 'Description of the "Dark theme" feature.' },
    ),
    // prettier-ignore
    note: msg(
      html`
      <i>${automaticOptionLabel}:</i>
      will use the theme defined in the system settings.
      <br />
      <i>${manualOptionLabel}:</i>
      will add a button to the Community Console that lets you switch the theme.
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
              label: automaticOptionLabel,
              value: 'system',
            },
            {
              label: manualOptionLabel,
              value: 'switch',
            },
          ],
        },
      }),
    ],
    demoMedia: {
      imgUrl: screenshot,
    },
    tags: [COMMUNITY_CONSOLE_TAG()],
  });
