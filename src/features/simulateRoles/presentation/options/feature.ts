import { html } from 'lit';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';
import { SubOption } from '@/options/presentation/models/subOption';

export const simulateRolesFeature = () =>
  new Feature({
    optionCodename: 'simulateroles',
    name: 'Simulate roles',
    description:
      'Make the frontend think you have a different role for some forums.',
    // prettier-ignore
    note: html`
      The following roles exist:
      <ul style="margin-top: 0; margin-bottom: 0; padding-inline-start: 30px;">
        <li><b>User</b>: 0
        <li><b>Bronze</b>: 1
        <li><b>Silver</b>: 2
        <li><b>Gold</b>: 3
        <li><b>Platinum</b>: 4
        <li><b>Diamond</b>: 5
        <li><b>CM</b>: 10
        <li><b>CS</b>: 20
        <li><b>Googler</b>: 100
        <li><b>Alumnus</b>: 30
        <li><b>Robot</b>: 40
      </ul>
      Write pairs <code>forum_id,role_id</code> separated by <code>|</code>
      (pipe characters).
    `,
    subOptions: [
      new SubOption({
        optionCodename: 'simulateroles_config',
        label: 'Config',
        type: {
          type: 'text',
          required: false,
        },
      }),
    ],
    tags: [COMMUNITY_CONSOLE_TAG()],
  });
