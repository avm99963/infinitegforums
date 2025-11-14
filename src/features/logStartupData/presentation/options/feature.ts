import { html } from 'lit';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const logStartupDataFeature = () =>
  new Feature({
    optionCodename: 'logstartupdata',
    name: 'Log startup data',
    // prettier-ignore
    description: html`
      Logs a JSON-parsed copy of the startup data to the Javascript console, as
      well as making it available under <code>window.startupData</code>.
    `,
    tags: [COMMUNITY_CONSOLE_TAG()],
  });
