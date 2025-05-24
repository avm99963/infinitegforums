import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../../common/litI18nUtils';
import { html } from 'lit';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';
import {
  Detail,
  Forum,
  LanguageConfiguration,
} from '../../../../domain/forum';
import { repeat } from 'lit/directives/repeat.js';

import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import { keyed } from 'lit/directives/keyed.js';
import { FORM_STYLES } from './styles';
import { ThreadProperty } from '../../../../domain/threadProperty';
import { msg } from '@lit/localize';

@customElement('twpt-additional-details-picker')
export default class AdditionalDetailsPicker extends I18nLitElement {
  @property({ type: String })
  accessor categoryId: string | undefined;

  @property({ type: Object })
  accessor properties: ThreadProperty[] | undefined;

  @property({ type: String })
  accessor forumId: string | undefined;

  @property({ type: String })
  accessor language: string | undefined;

  @property({ type: Object })
  accessor forums: Forum[] | undefined;

  static styles = [SHARED_MD3_STYLES, FORM_STYLES];

  render() {
    const languageConfiguration = this.getLanguageConfiguration();
    return html`
      <div class="fields">
        ${this.renderCategorySelect(languageConfiguration)}
        ${this.renderDetailSelects(languageConfiguration)}
      </div>
    `;
  }

  private renderCategorySelect(
    languageConfiguration: LanguageConfiguration | undefined,
  ) {
    const categories = languageConfiguration?.categories ?? [];
    return keyed(
      `${this.forumId ?? ''},${this.language ?? ''}`,
      html`
        <md-outlined-select
          label=${msg('Category', {
            id: 'components.additionalDetailsPicker.category',
            desc: 'Label for the thread category select in the additional details picker.',
          })}
          required
          ?disabled=${languageConfiguration === undefined}
          clampMenuWidth
          @change=${this.onCategoryChanged}
        >
          ${repeat(
            categories,
            (category) => category.id,
            (category) => html`
              <md-select-option
                value=${category.id}
                ?selected=${category.id === this.categoryId}
              >
                <div slot="headline">${category.name ?? category.id}</div>
              </md-select-option>
            `,
          )}
        </md-outlined-select>
      `,
    );
  }

  private renderDetailSelects(
    languageConfiguration: LanguageConfiguration | undefined,
  ) {
    const details = languageConfiguration?.details ?? [];
    return keyed(
      `${this.forumId ?? ''},${this.language ?? ''}`,
      repeat(
        details,
        (detail) => detail.id,
        (detail) => this.renderDetailSelect(detail),
      ),
    );
  }

  private renderDetailSelect(detail: Detail) {
    const currentValue = this.properties?.find(
      (property) => property.key === detail.id,
    )?.value;

    return html`
      <md-outlined-select
        label=${detail.name ?? detail.id}
        clampMenuWidth
        @change=${(e: Event) => this.onDetailChanged(e, detail.id)}
      >
        <md-select-option value="" ?selected=${currentValue === undefined}>
          <div slot="headline">
            ${msg('Not selected', {
              id: 'components.additionalDetailsPicker.detailNotSelected',
              desc: 'Default option which lets the user not select any option in a thread detail select, inside the additional details picker.',
            })}
          </div>
        </md-select-option>
        ${repeat(
          detail.options,
          (option) => option.id,
          (option) => html`
            <md-select-option
              value=${option.id}
              ?selected=${currentValue !== undefined &&
              option.id === currentValue}
            >
              <div slot="headline">${option.name ?? option.id}</div>
            </md-select-option>
          `,
        )}
      </md-outlined-select>
    `;
  }

  private getLanguageConfiguration() {
    const forum = this.forums?.find((forum) => forum.id === this.forumId);
    return forum?.languageConfigurations.find((lang) =>
      lang.supportedLanguages.includes(this.language),
    );
  }

  private onCategoryChanged(e: Event) {
    this.categoryId = (e.target as HTMLInputElement).value;
    this.dispatchChangeEvent();
  }

  private onDetailChanged(e: Event, detailId: string) {
    const newValue = (e.target as HTMLInputElement).value;
    this.changePropertiesDetail(detailId, newValue);
    this.dispatchChangeEvent();
  }

  private dispatchChangeEvent() {
    const event = new Event('change');
    this.dispatchEvent(event);
  }

  private changePropertiesDetail(key: string, value: string) {
    let newProperties = structuredClone(this.properties) ?? [];
    const property = newProperties.find((property) => property.key === key);

    if (value !== '') {
      if (property !== undefined) {
        property.value = value;
      } else {
        newProperties.push({ key, value });
      }
    } else {
      newProperties = newProperties.filter((it) => it !== property);
    }

    this.properties = newProperties;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-additional-details-picker': AdditionalDetailsPicker;
  }
}
