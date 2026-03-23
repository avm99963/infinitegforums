import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@material/web/icon/icon.js';

/**
 * TW Power Tools badge component.
 *
 * This elment is based on createExtBadge() in
 * src/contentScripts/communityConsole/utils/common.js and the styles in
 * src/static/css/common/console.css.
 */
@customElement('twpt-badge')
export default class Badge extends LitElement {
  static styles = [
    css`
      :host {
        display: inline-block;
      }

      .TWPT-badge {
        width: calc(18 / 13 * var(--icon-size, 16px));
        height: calc(18 / 13 * var(--icon-size, 16px));
        border-radius: 50%;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        align-items: center;

        background-color: #009688;
        color: #fff;
        box-shadow:
          0 1px 1px 0 rgba(0, 0, 0, 0.22),
          0 2px 2px 0 rgba(0, 0, 0, 0.12);

        user-select: none;
      }

      .TWPT-badge md-icon {
        --md-icon-size: var(--icon-size, 16px);
      }
    `,
  ];

  render() {
    return html`
      <div class="TWPT-badge">
        <md-icon>repeat</md-icon>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-badge': Badge;
  }
}
