import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../../../common/litI18nUtils';
import { html, nothing } from 'lit';
import { SHARED_MD3_STYLES } from '../../../../../common/styles/md3';
import { Forum } from '../../../../../domain/forum';
import { repeat } from 'lit/directives/repeat.js';

import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import { keyed } from 'lit/directives/keyed.js';
import { FORM_STYLES } from './styles';

@customElement('twpt-forum-select')
export default class ForumSelect extends I18nLitElement {
  @property({ type: String })
  accessor forumId: string | undefined;

  @property({ type: String })
  accessor language: string | undefined;

  @property({ type: Object })
  private accessor forums: Forum[] | undefined;

  static styles = [SHARED_MD3_STYLES, FORM_STYLES];

  render() {
    return html`
      <div class="fields">
        ${this.renderForumSelect()} ${this.renderLanguageSelect()}
      </div>
    `;
  }

  private renderForumSelect() {
    return html`
      <md-outlined-select
        label="Community Forum"
        required
        clampMenuWidth
        @change=${this.onForumChanged}
      >
        ${this.forums
          ? repeat(
              this.forums,
              (forum) => forum.id,
              (forum) => html`
                <md-select-option
                  value=${forum.id}
                  ?selected=${forum.id === this.forumId}
                >
                  <div slot="headline">${forum.name}</div>
                </md-select-option>
              `,
            )
          : nothing}
      </md-outlined-select>
    `;
  }

  renderLanguageSelect() {
    const selectedForum = this.getSelectedForum();
    const isForumSelected = selectedForum !== undefined;

    // We use keyed since otherwise when changing forums the new language is not
    // properly set.
    return keyed(
      this.forumId,
      html`
        <md-outlined-select
          label="Language"
          required
          ?disabled=${!isForumSelected}
          clampMenuWidth
          @change=${this.onLanguageChanged}
        >
          ${isForumSelected
            ? repeat(
                selectedForum.languageConfigurations,
                (language) => language.id,
                (language) => html`
                  <md-select-option
                    value=${language.id}
                    ?selected=${language.id === this.language}
                  >
                    <div slot="headline">${language.name}</div>
                  </md-select-option>
                `,
              )
            : nothing}
        </md-outlined-select>
      `,
    );
  }

  private getSelectedForum(): Forum | undefined {
    return this.forums?.find((forum) => forum.id === this.forumId);
  }

  private onForumChanged(e: Event) {
    this.forumId = (e.target as HTMLInputElement).value;

    const selectedForum = this.getSelectedForum();
    if (
      !selectedForum.languageConfigurations.some(
        (language) => language.id === this.language,
      )
    ) {
      this.language = undefined;
    }
    const event = new Event('change');
    this.dispatchEvent(event);
  }

  private onLanguageChanged(e: Event) {
    this.language = (e.target as HTMLInputElement).value;

    const event = new Event('change');
    this.dispatchEvent(event);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-forum-select': ForumSelect;
  }
}
