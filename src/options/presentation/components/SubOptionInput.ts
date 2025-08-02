import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { css, html, nothing } from 'lit';

import '@material/web/icon/icon.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/outlined-text-field.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { SubOption } from '../models/subOption';
import { map } from 'lit/directives/map.js';

@customElement('sub-option-input')
export default class SubOptionInput extends I18nLitElement {
  static styles = [
    typescaleStyles,
    css`
      .sub-option {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 12px 0 8px 0;
      }

      md-outlined-text-field,
      md-outlined-select {
        min-width: 220px;
      }
    `,
  ];

  @property({ type: Object })
  accessor subOption: SubOption | undefined;

  @property()
  accessor value: unknown;

  render() {
    if (this.subOption === undefined) {
      return nothing;
    }

    return html`
      <div class="sub-option">${this.renderField()}</div>
    `;
  }

  private renderField() {
    switch (this.subOption.type.type) {
      case 'integer':
        return this.renderInteger();

      case 'dropdown':
        return this.renderDropdown();

      default:
        console.warn(
          'SubOptionComponent: unexpected subOption type:',
          this.subOption.type,
        );
        return nothing;
    }
  }

  private renderInteger() {
    if (this.subOption.type.type !== 'integer') {
      return nothing;
    }

    return html`
      <md-outlined-text-field
        type="number"
        label=${this.subOption.label}
        value=${this.value}
        min=${this.subOption.type.min}
        max=${this.subOption.type.max}
        step="1"
      ></md-outlined-text-field>
    `;
  }

  private renderDropdown() {
    if (this.subOption.type.type !== 'dropdown') {
      return nothing;
    }

    return html`
      <md-outlined-select label=${this.subOption.label} clampMenuWidth>
        ${map(
          this.subOption.type.options,
          (option) => html`
            <md-select-option
              value=${option.value}
              ?selected=${option.value === this.value}
            >
              <div slot="headline">${option.label}</div>
            </md-select-option>
          `,
        )}
      </md-outlined-select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sub-option-input': SubOptionInput;
  }
}
