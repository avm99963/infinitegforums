import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { css, html } from 'lit';

import './SubOptionInput';
import './FeatureTag';
import '@material/web/checkbox/checkbox.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/input-chip.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { classMap } from 'lit/directives/class-map.js';

@customElement('hint-text')
export default class HintText extends I18nLitElement {
  static styles = [
    typescaleStyles,
    css`
      :host {
        display: block;
      }

      .hint {
        display: flex;
        flex-direction: row;
        gap: 4px;
        color: var(--md-sys-color-on-surface-variant);

        &.hint--error {
          color: var(--md-sys-color-error);
        }

        &.hint--small {
          --hint-icon-size: 16px;
          --hint-icon-size-in-text: 12px;
        }

        &.hint--medium {
          --hint-icon-size: 20px;
          --hint-icon-size-in-text: 14px;
        }

        &.hint--large {
          --hint-icon-size: 24px;
          --hint-icon-size-in-text: 16px;
        }

        .icon {
          min-width: var(--hint-icon-size);
          height: var(--hint-icon-size);
          font-size: var(--hint-icon-size);

          slot {
            display: flex;
            height: 100%;
            width: 100%;
            align-items: center;
            justify-content: center;
          }

          ::slotted(*) {
            width: inherit;
            height: inherit;
            font-size: inherit;
          }
        }

        .text {
          ::slotted(*) {
            --md-icon-size: var(--hint-icon-size-in-text);
          }
        }
      }
    `,
  ];

  @property({ type: String })
  accessor type: 'note' | 'error';

  @property({ type: String })
  accessor size: 'small' | 'medium' | 'large';

  render() {
    const classes = {
      hint: true,
      [`hint--${this.getSize()}`]: true,
      [typescaleClassBySize[this.getSize()]]: true,
      'hint--error': this.type === 'error',
    };

    return html`
      <div class=${classMap(classes)}>
        <div class="icon"><slot name="icon"></slot></div>
        <div class="text"><slot></slot></div>
      </div>
    `;
  }

  private getSize() {
    const validSizes = ['small', 'medium', 'large'];
    return validSizes.includes(this.size) ? this.size : 'medium';
  }
}

const typescaleClassBySize = {
  small: 'md-typescale-body-small',
  medium: 'md-typescale-body-medium',
  large: 'md-typescale-body-large',
};

declare global {
  interface HTMLElementTagNameMap {
    'hint-text': HintText;
  }
}
