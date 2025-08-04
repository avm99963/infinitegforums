import { customElement, property, state } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { css, html, nothing } from 'lit';

import './SubOptionInput';
import './FeatureTag';
import '@material/web/checkbox/checkbox.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/input-chip.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { Feature } from '../models/feature';
import { msg } from '@lit/localize';
import { map } from 'lit/directives/map.js';
import {
  OptionCodename,
  optionsMap,
  OptionsValues,
} from '../../../common/options/optionsPrototype';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';

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

      .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }

      .feature-checkbox {
        margin-top: 10px;
      }

      .content {
        margin-top: 6px;
      }

      .title {
        cursor: pointer;
      }

      .description {
        margin-bottom: 4px;
      }

      .note {
        display: flex;
        flex-direction: row;
        gap: 4px;
        margin-bottom: 4px;
        color: var(--md-sys-color-on-surface-variant);

        md-icon {
          --md-icon-size: 16px;
        }
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
    const titleId = `${idPrefix}-title`;
    return html`
      <md-filled-card role="group" aria-labelledby=${titleId}>
        <div class="container">
          <md-checkbox
            id=${checkboxId}
            class="feature-checkbox"
            ?checked=${this.isEnabled()}
            aria-label=${msg(`Enable "${this.feature.name}" feature`)}
          ></md-checkbox>
          <div class="content">
            <label
              id=${titleId}
              for=${checkboxId}
              class="title md-typescale-title-medium"
            >
              ${this.feature.name}
            </label>
            ${this.renderDescription()} ${this.renderNote()}
            ${this.renderSubOptions()}
            ${this.isExpanded ? this.renderSupportingMedia() : nothing}
            ${this.renderTags()}
          </div>
          ${this.renderExpandCollapseButton()}
        </div>
      </md-filled-card>
    `;
  }

  private isEnabled() {
    return (
      this.optionsConfiguration?.isEnabled(this.feature.optionCodename) ?? false
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
      <div class="note md-typescale-body-small">
        <md-icon>info</md-icon>
        <div>${this.feature.note}</div>
      </div>
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
        @click=${this.toggleExpand}
        aria-hidden="true"
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
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-card': FeatureCard;
  }
}
