import { css, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';

@customElement('feature-tag')
export default class FeatureTag extends I18nLitElement {
  static styles = [
    typescaleStyles,
    css`
      :host {
        display: inline-flex;
        min-width: 0;
        border-radius: 8px;
        height: 24px;
        align-items: center;
        border: 1px solid var(--md-sys-color-outline);
        padding: 0 16px;
      }

      .tag {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
      }
    `,
  ];

  render() {
    return html`
      <span class="tag md-typescale-label-large"><slot></slot></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-tag': FeatureTag;
  }
}
