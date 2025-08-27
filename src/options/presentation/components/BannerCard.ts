import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';

import '@material/web/labs/card/filled-card.js';

@customElement('banner-card')
export default class BannerCard extends LitElement {
  @property({ type: String })
  accessor type: 'regular' | 'error';

  render() {
    const className = this.getType();
    return html`
      <md-filled-card
        class=${className}
        aria-labelledby="kill-switch-enabled-title"
      >
        <div class="title md-typescale-title-large">
          <slot name="icon"></slot>
          <slot name="title"></slot>
        </div>
        <div class="description md-typescale-body-medium">
          <slot name="description"></slot>
        </div>
      </md-filled-card>
    `;
  }

  private getType() {
    return ['normal', 'error'].includes(this.type)
      ? this.type
      : 'regular';
  }

  static styles = [
    typescaleStyles,
    css`
      :host {
        display: block;
      }

      md-filled-card {
        padding: 20px 24px;

        &.error {
          --md-filled-card-container-color: var(--md-sys-color-error-container);
          color: var(--md-sys-color-on-error-container);
        }

        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'banner-card': BannerCard;
  }
}
