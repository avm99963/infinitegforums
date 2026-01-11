import { customElement, property } from 'lit/decorators.js';
import { css, html, LitElement, nothing } from 'lit';

import '@material/web/icon/icon.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/outlined-text-field.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { SubOption } from '../../presentation/models/subOption';
import { map } from 'lit/directives/map.js';
import { OptionChangedEvent } from '../events/events';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js';

@customElement('sub-option-input')
export default class SubOptionInput extends LitElement {
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

  private integerField: Ref<MdOutlinedTextField> = createRef();
  private textField: Ref<MdOutlinedTextField> = createRef();
  private selectField: Ref<MdOutlinedSelect> = createRef();

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

      case 'text':
        return this.renderText();

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
        required
        no-asterisk
        @change=${this.onIntegerChange}
        ${ref(this.integerField)}
      ></md-outlined-text-field>
    `;
  }

  private renderText() {
    if (this.subOption.type.type !== 'text') {
      return nothing;
    }

    return html`
      <md-outlined-text-field
        type="text"
        label=${this.subOption.label}
        value=${this.value}
        ?required=${this.subOption.type.required}
        no-asterisk
        @change=${this.onTextChange}
        ${ref(this.textField)}
      ></md-outlined-text-field>
    `;
  }

  private renderDropdown() {
    if (this.subOption.type.type !== 'dropdown') {
      return nothing;
    }

    return html`
      <md-outlined-select
        label=${this.subOption.label}
        required
        no-asterisk
        @change=${this.onSelectChange}
        ${ref(this.selectField)}
      >
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

  private onIntegerChange() {
    const field = this.integerField.value;
    if (field === undefined) {
      console.error('Integer field cannot be found.');
      return;
    }

    if (field.reportValidity()) {
      this.onValueChange(field.value);
    }
  }

  private onTextChange() {
    const field = this.textField.value;
    if (field === undefined) {
      console.error('Text field cannot be found.');
      return;
    }

    if (field.reportValidity()) {
      this.onValueChange(field.value);
    }
  }

  private onSelectChange() {
    const field = this.selectField.value;
    if (field === undefined) {
      console.error('Select field cannot be found.');
      return;
    }

    if (field.reportValidity()) {
      this.onValueChange(field.value);
    }
  }

  private onValueChange(value: unknown) {
    const changeEvent: OptionChangedEvent = new CustomEvent('change', {
      detail: {
        option: this.subOption?.optionCodename,
        value,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(changeEvent);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sub-option-input': SubOptionInput;
  }
}
