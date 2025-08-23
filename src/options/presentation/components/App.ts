import { customElement, property, state } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider';
import { OptionsModifierPort } from '../../../services/options/OptionsModifier.port';
import { css, html, nothing, PropertyValues } from 'lit';
import './FeatureCard';
import './KillSwitchEnabledBanner';
import { Feature } from '../models/feature';
import { msg } from '@lit/localize';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { SubOption } from '../models/subOption';
import '../styles/styles.scss';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import { makeAbortable, PromiseAbortError } from '../../../common/abortable';
import { OptionChangedEvent } from '../events/events';
import { optionCodenames } from '../../../common/options/optionsPrototype';

@customElement('options-app')
export default class OptionsApp extends I18nLitElement {
  @property({ type: Object })
  accessor optionsProvider: OptionsProviderPort | undefined;

  @property({ type: Object })
  accessor optionsModifier: OptionsModifierPort | undefined;

  @state()
  accessor optionsConfiguration: OptionsConfiguration | undefined;

  private configurationReqAbortController: AbortController | undefined;

  static styles = [
    typescaleStyles,
    css`
      :host {
        font-family:
          'Roboto',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Helvetica,
          Arial,
          sans-serif,
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol' !important;

        display: block;
        position: relative;
        width: 100%;
        min-height: 100%;
        color: var(--md-sys-color-on-surface);
        background: var(--md-sys-color-surface);
      }

      main {
        display: flex;
        padding: 16px 0;
        margin: auto;
        max-width: min(512px, calc(100% - 2 * 16px));
        flex-direction: column;
        gap: 8px;
      }
    `,
  ];

  willUpdate(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('optionsProvider') &&
      this.optionsProvider !== undefined
    ) {
      this.setUpOptionsProvider();
    }
  }

  private setUpOptionsProvider() {
    // TODO: If we keep changing the optionsProvider, we should remove the
    // previous listener in the previous provider. We don't currently handle
    // this case since we don't change the optionsProvider.
    this.optionsProvider.addListener((_, newConfiguration) =>
      this.onProviderChangedOptions(newConfiguration),
    );
    this.loadConfiguration();
  }

  private onProviderChangedOptions(newConfiguration: OptionsConfiguration) {
    this.abortConfigurationRequest();
    this.optionsConfiguration = newConfiguration;
  }

  private async loadConfiguration() {
    this.abortConfigurationRequest();
    this.configurationReqAbortController = new AbortController();
    const signal = this.configurationReqAbortController.signal;
    const abortableGetOptionsConfiguration = makeAbortable(
      this.optionsProvider.getOptionsConfiguration.bind(this.optionsProvider),
    );
    try {
      // If the call is aborted, it will throw PromiseAbortError and the
      // assignment will not be made.
      this.optionsConfiguration = await abortableGetOptionsConfiguration({
        signal,
      });
    } catch (error: unknown) {
      if (error instanceof PromiseAbortError) {
        console.debug(
          'Ignoring aborted request to load the current configuration.',
        );
      } else {
        throw error;
      }
    }
  }

  private abortConfigurationRequest() {
    if (this.configurationReqAbortController !== undefined) {
      this.configurationReqAbortController.abort();
      this.configurationReqAbortController = undefined;
    }
  }

  render() {
    const features = [
      new Feature({
        optionCodename: 'bulkreportreplies',
        name: msg('Report replies quickly'),
        description: msg(
          'Adds quick report buttons to all replies, so you can report each one with a single click.',
        ),
        demoMedia: {
          imgUrl:
            'https://raw.githubusercontent.com/avm99963/infinitegforums/refs/heads/master/docs/resources/bulk_report_replies.gif',
        },
        tags: ['Tailwind Basic', 'Community Console'],
      }),
      new Feature({
        optionCodename: 'interopthreadpage',
        name: msg('Thread page design'),
        description: msg('Forces showing the new or old thread page design.'),
        note: 'The old thread page design is partially broken, but this feature is kept since some PEs rely on the old design to access some missing features.',
        subOptions: [
          new SubOption({
            optionCodename: 'interopthreadpage_mode',
            label: msg('Design to show'),
            type: {
              type: 'dropdown',
              options: [
                { label: msg('Old design'), value: 'previous' },
                { label: msg('New design'), value: 'next' },
              ],
            },
          }),
        ],
        demoMedia: {
          videoUrl:
            'https://private-user-images.githubusercontent.com/682310/464158376-47d0d05d-a00f-46a2-9596-01cb15bbf380.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTQxNDk2NjEsIm5iZiI6MTc1NDE0OTM2MSwicGF0aCI6Ii82ODIzMTAvNDY0MTU4Mzc2LTQ3ZDBkMDVkLWEwMGYtNDZhMi05NTk2LTAxY2IxNWJiZjM4MC5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwODAyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDgwMlQxNTQyNDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0wNTlmZDlhMzFjYjFkMDJiMDk2NDlmZGE1MWY5NGVkMmI3OWExMDBiNjI3ZWIwNWE2ZTJlYTBmM2FlNWNmMjgyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.OYDESeTjjyqvD_A-zeqe9MdoTU5QlgeGqprKnROzHwk',
        },
        tags: ['Community Console'],
      }),
      new Feature({
        optionCodename: 'profileindicatoralt',
        name: msg('OP messages count'),
        description: msg(
          "Shows a badge next to the OP's username with the number of messages posted by them.",
        ),
        subOptions: [
          new SubOption({
            optionCodename: 'profileindicatoralt_months',
            label: msg('Months'),
            type: { type: 'integer', min: 1, max: 12 },
          }),
        ],
        demoMedia: {},
        tags: ['Community Console'],
      }),
    ];

    return html`
      <main>
        <h1 class="md-typescale-display-small">Options</h1>
        ${this.maybeRenderKillSwitchEnabledBanner()}
        ${features.map((f) => this.renderFeatureCard(f))}
      </main>
    `;
  }

  private maybeRenderKillSwitchEnabledBanner() {
    if (!this.isSomeKillSwitchEnabled()) {
      return nothing;
    }

    return html`
      <kill-switch-enabled-banner></kill-switch-enabled-banner>
    `;
  }

  private isSomeKillSwitchEnabled() {
    return optionCodenames.some((codename) =>
      this.optionsConfiguration.isKillSwitchEnabled(codename),
    );
  }

  private renderFeatureCard(feature: Feature) {
    return html`
      <feature-card
        .feature=${feature}
        .optionsConfiguration=${this.optionsConfiguration}
        @change=${this.onOptionChangedByUser}
      ></feature-card>
    `;
  }

  private onOptionChangedByUser(e: OptionChangedEvent) {
    if (this.optionsModifier === undefined) {
      console.error(
        "The options can't be saved because an optionsModifier instance was not supplied.",
      );
      return;
    }
    this.optionsModifier.set(e.detail.option, e.detail.value);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'options-app': OptionsApp;
  }
}
