import { customElement, property, state } from 'lit/decorators.js';
import { I18nLitElement } from '../../../ui/i18n/i18nLitElement';
import { css, html, nothing } from 'lit';

import './HintText';
import './FeatureTag';
import './SubOptionInput';
import '@material/web/checkbox/checkbox.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/input-chip.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { Feature } from '../../presentation/models/feature';
import { msg, str } from '@lit/localize';
import { map } from 'lit/directives/map.js';
import {
  OptionCodename,
  optionsMap,
  OptionsValues,
} from '../../../common/options/optionsPrototype';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import { OptionChangedEvent } from '../events/events';
import { classMap } from 'lit/directives/class-map.js';
import { DISCUSS_GROUP_URL } from '../../../common/consts';

@customElement('feature-card')
export default class FeatureCard extends I18nLitElement {
  static styles = [
    typescaleStyles,
    css`
      .container {
        display: flex;
        flex-direction: row;
        align-items: start;
        padding: 16px 24px 20px 24px;
        gap: 16px;
      }

      .feature-checkbox {
        margin-top: 10px;

        &.feature-checkbox--kill-switch-enabled {
          --md-checkbox-selected-container-color: var(--md-sys-color-error);
          --md-checkbox-selected-icon-color: var(--md-sys-color-on-error);
          --md-checkbox-selected-focus-container-color: var(
            --md-sys-color-error
          );
          --md-checkbox-selected-focus-icon-color: var(--md-sys-color-on-error);
          --md-checkbox-selected-hover-container-color: var(
            --md-sys-color-error
          );
          --md-checkbox-selected-hover-icon-color: var(--md-sys-color-on-error);
          --md-checkbox-selected-pressed-container-color: var(
            --md-sys-color-error
          );
          --md-checkbox-selected-pressed-icon-color: var(
            --md-sys-color-on-error
          );
        }
      }

      .expand-collapse-button {
        /**
         * This button should appear last even if semantically it's placed
         * before content.
         **/
        order: 1;
      }

      .content {
        display: flex;
        margin-top: 6px;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }

      .title {
        cursor: pointer;
      }

      .description {
        margin-bottom: 4px;
      }

      hint-text {
        margin-bottom: 4px;
      }

      .demo-image,
      .demo-video {
        width: 100%;
        border-radius: 12px;
        margin: 0 4px;
      }

      .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        margin-top: 6px;
        gap: 4px;
      }

      a {
        color: var(--md-sys-color-primary);
      }
    `,
  ];

  @property({ type: Object })
  accessor feature: Feature | undefined;

  @property({ type: Object })
  accessor optionsConfiguration: OptionsConfiguration | undefined;

  @state()
  private accessor isExpanded = false;

  render() {
    const feature = this.feature;
    if (feature === undefined) {
      return nothing;
    }

    const featureName = feature.name;

    const idPrefix = `${feature.optionCodename}-feature`;
    const checkboxId = `${idPrefix}-checkbox`;
    const checkboxClasses = {
      'feature-checkbox': true,
      'feature-checkbox--kill-switch-enabled':
        this.isKillSwitchEnabled(feature),
    };
    const titleId = `${idPrefix}-title`;
    return html`
      <md-filled-card role="group" aria-labelledby=${titleId}>
        <div class="container">
          <md-checkbox
            id=${checkboxId}
            class=${classMap(checkboxClasses)}
            ?checked=${this.isEnabled(feature)}
            aria-label=${msg(str`Enable "${featureName}" feature`, {
              desc: 'Label for the checkbox that lets a user enable a specific feature in the options page (ex: \'Enable "Dark theme" feature\')',
            })}
            @change=${this.onCheckboxChange}
          ></md-checkbox>
          ${this.renderExpandCollapseButton(feature)}
          <div class="content">
            <label
              id=${titleId}
              for=${checkboxId}
              class="title md-typescale-title-medium"
            >
              ${feature.name}
            </label>
            ${this.renderDescription(feature)} ${this.renderNote(feature)}
            ${this.renderKillSwitch(feature)} ${this.renderSubOptions(feature)}
            ${this.isExpanded ? this.renderSupportingMedia(feature) : nothing}
            ${this.renderTags(feature)}
          </div>
        </div>
      </md-filled-card>
    `;
  }

  private isEnabled(feature: Feature) {
    return (
      this.optionsConfiguration?.getUserConfiguredOptionValue(
        feature.optionCodename,
      ) === true
    );
  }

  private isKillSwitchEnabled(feature: Feature) {
    return (
      feature.optionCodename !== undefined &&
      (this.optionsConfiguration?.isKillSwitchEnabled(feature.optionCodename) ??
        false)
    );
  }

  private renderDescription(feature: Feature) {
    if (feature.description === undefined) {
      return nothing;
    }

    return html`
      <div class="description md-typescale-body-medium">
        ${feature.description}
      </div>
    `;
  }

  private renderNote(feature: Feature) {
    if (feature.note === undefined) {
      return nothing;
    }

    return html`
      <hint-text type="note" size="small">
        <md-icon slot="icon">info</md-icon>
        ${feature.note}
      </hint-text>
    `;
  }

  private renderKillSwitch(feature: Feature) {
    if (!this.isKillSwitchEnabled(feature)) {
      return nothing;
    }

    return html`
      <hint-text type="error" size="small">
        <md-icon slot="icon">error</md-icon>
        ${msg(
          html`
            This feature has been disabled remotely for everyone.
            <a
              href=${DISCUSS_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn why.
            </a>
          `,
          {
            desc: 'Text that appears in a feature card in the options page when the feature has been disabled remotely (i.e., the feature kill switch is active).',
          },
        )}
      </hint-text>
    `;
  }

  private renderSubOptions(feature: Feature) {
    if (feature.subOptions === undefined) {
      return nothing;
    }

    return html`
      ${map(
        feature.subOptions,
        (subOption) => html`
          <sub-option-input
            .subOption=${subOption}
            value=${this.getSubOptionValue(subOption.optionCodename)}
          ></sub-option-input>
        `,
      )}
    `;
  }

  private getSubOptionValue<T extends OptionCodename>(
    codename: T,
  ): OptionsValues[T] | undefined {
    return (
      this.optionsConfiguration?.getOptionValue(codename) ??
      (optionsMap.get(codename)?.defaultValue as OptionsValues[T] | undefined)
    );
  }

  private renderSupportingMedia(feature: Feature) {
    return html`
      ${feature.demoMedia?.imgUrl !== undefined
        ? html`
            <img class="demo-image" src=${feature.demoMedia.imgUrl} alt="" />
          `
        : nothing}
      ${feature.demoMedia?.videoUrl !== undefined
        ? html`
            <video
              class="demo-video"
              src=${feature.demoMedia.videoUrl}
              muted
              autoplay
              loop
              aria-hidden="true"
            ></video>
          `
        : nothing}
    `;
  }

  private renderTags(feature: Feature) {
    if (feature.tags === undefined) {
      return nothing;
    }

    return html`
      <div class="tags">
        ${map(
          feature.tags,
          (tag) => html`
            <feature-tag>${tag}</feature-tag>
          `,
        )}
      </div>
    `;
  }

  private renderExpandCollapseButton(feature: Feature) {
    if (
      feature.demoMedia?.imgUrl === undefined &&
      feature.demoMedia?.videoUrl === undefined
    ) {
      return nothing;
    }

    return html`
      <md-icon-button
        class="expand-collapse-button"
        aria-hidden="true"
        @click=${this.toggleExpand}
      >
        <md-icon>
          ${this.isExpanded ? 'expand_circle_up' : 'expand_circle_down'}
        </md-icon>
      </md-icon-button>
    `;
  }

  private toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  private onCheckboxChange(e: Event) {
    if (this.feature === undefined) {
      // This shouldn't happen since we're only rendering the card when
      // this.feature is not undefined.
      return;
    }

    const enabled = (e.target as HTMLInputElement).checked ?? false;
    const changeEvent: OptionChangedEvent = new CustomEvent('change', {
      detail: {
        option: this.feature.optionCodename,
        value: enabled,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(changeEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-card': FeatureCard;
  }
}
