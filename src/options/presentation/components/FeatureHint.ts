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

@customElement('feature-hint')
export default class FeatureHint extends I18nLitElement {
  static styles = [
    typescaleStyles,
    css`
      .hint {
        display: flex;
        flex-direction: row;
        gap: 4px;
        margin-bottom: 4px;
        color: var(--md-sys-color-on-surface-variant);

        &--error {
          color: var(--md-sys-color-error);
        }

        .icon {
          min-width: 16px;
          height: 16px;
          font-size: 16px;

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
      }
    `,
  ];

  @property({ type: String })
  accessor type: 'note' | 'error';

  render() {
    const classes = {
      hint: true,
      'md-typescale-body-small': true,
      'hint--error': this.type === 'error',
    };

    return html`
      <div class=${classMap(classes)}>
        <div class="icon"><slot name="icon"></slot></div>
        <div class="text"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-hint': FeatureHint;
  }
}
