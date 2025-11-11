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
    if (this.feature === undefined) {
      return nothing;
    }

    const idPrefix = `${this.feature.optionCodename}-feature`;
    const checkboxId = `${idPrefix}-checkbox`;
    const checkboxClasses = {
      'feature-checkbox': true,
      'feature-checkbox--kill-switch-enabled': this.isKillSwitchEnabled(),
    };
    const titleId = `${idPrefix}-title`;
    return html`
      <md-filled-card role="group" aria-labelledby=${titleId}>
        <div class="container">
          <md-checkbox
            id=${checkboxId}
            class=${classMap(checkboxClasses)}
            ?checked=${this.isEnabled()}
            aria-label=${msg(str`Enable "${this.feature.name}" feature`, {
              desc: 'Label for the checkbox that lets a user enable a specific feature in the options page (ex: \'Enable "Dark theme" feature\')',
            })}
            @change=${this.onCheckboxChange}
          ></md-checkbox>
          ${this.renderExpandCollapseButton()}
          <div class="content">
            <label
              id=${titleId}
              for=${checkboxId}
              class="title md-typescale-title-medium"
            >
              ${this.feature.name}
            </label>
            ${this.renderDescription()} ${this.renderNote()}
            ${this.renderKillSwitch()} ${this.renderSubOptions()}
            ${this.isExpanded ? this.renderSupportingMedia() : nothing}
            ${this.renderTags()}
          </div>
        </div>
      </md-filled-card>
    `;
  }

  private isEnabled() {
    return (
      this.optionsConfiguration?.getUserConfiguredOptionValue(
        this.feature.optionCodename,
      ) === true
    );
  }

  private isKillSwitchEnabled() {
    return (
      this.feature?.optionCodename !== undefined &&
      this.optionsConfiguration?.isKillSwitchEnabled(
        this.feature.optionCodename,
      )
    );
  }

  private renderDescription() {
    if (this.feature.description === undefined) {
      return nothing;
    }

    return html`
      <div class="description md-typescale-body-medium">
        ${this.feature.description}
      </div>
    `;
  }

  private renderNote() {
    if (this.feature.note === undefined) {
      return nothing;
    }

    return html`
      <hint-text type="note" size="small">
        <md-icon slot="icon">info</md-icon>
        ${this.feature.note}
      </hint-text>
    `;
  }

  private renderKillSwitch() {
    if (!this.isKillSwitchEnabled()) {
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

  private renderSubOptions() {
    if (this.feature.subOptions === undefined) {
      return nothing;
    }

    return html`
      ${map(
        this.feature.subOptions,
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
      (optionsMap.get(codename).defaultValue as OptionsValues[T])
    );
  }

  private renderSupportingMedia() {
    return html`
      ${this.feature.demoMedia?.imgUrl !== undefined
        ? html`
            <img
              class="demo-image"
              src=${this.feature.demoMedia.imgUrl}
              alt=""
            />
          `
        : nothing}
      ${this.feature.demoMedia?.videoUrl !== undefined
        ? html`
            <video
              class="demo-video"
              src=${this.feature.demoMedia.videoUrl}
              muted
              autoplay
              loop
              aria-hidden="true"
            ></video>
          `
        : nothing}
    `;
  }

  private renderTags() {
    if (this.feature.tags === undefined) {
      return nothing;
    }

    return html`
      <div class="tags">
        ${map(
          this.feature.tags,
          (tag) => html`
            <feature-tag>${tag}</feature-tag>
          `,
        )}
      </div>
    `;
  }

  private renderExpandCollapseButton() {
    if (
      this.feature.demoMedia?.imgUrl === undefined &&
      this.feature.demoMedia?.videoUrl === undefined
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
    const enabled = (e.target as HTMLInputElement).checked ?? false;
    const changeEvent: OptionChangedEvent = new CustomEvent('change', {
      detail: {
        option: this.feature?.optionCodename,
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
