import {css, html, LitElement} from 'lit';

/**
 * Lite component inspired in the now removed material-web's Formfield.
 * https://github.com/material-components/material-web/commit/753a03be963f7b5242e98b73d1309abbe9f5bf51
 */
export default class TwptFormField extends LitElement {
  static styles = [
    css`
    .formfield {
      align-items: center;
      display: inline-flex;
      vertical-align: middle;
    }

    label {
      margin-inline: 0px auto;
      order: 0;
      padding-inline: 4px 0px;
    }
    `,
  ];

  render() {
    return html`
      <span class="formfield">
        <slot></slot>
        <label @click="${this._labelClick}">
          <slot name="label"></slot>
        </label>
      </span>
    `;
  }

  _labelClick() {
    const input = this._input;
    if (!input || !this.shadowRoot) return;

    input.focus();
    input.click();
  }

  get _input() {
    return this._slottedChildren?.[0] ?? null;
  }

  get _slottedChildren() {
    if (!this.shadowRoot) return null;
    const slot = this.shadowRoot.querySelector('slot');
    return slot.assignedElements({flatten: true});
  }
}
window.customElements.define('twpt-form-field', TwptFormField);
