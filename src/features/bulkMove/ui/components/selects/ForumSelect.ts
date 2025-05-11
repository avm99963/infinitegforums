import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../../../common/litI18nUtils';
import { html } from 'lit';
import { SHARED_MD3_STYLES } from '../../../../../common/styles/md3';
import { Forum } from '../../../../../domain/forum';
import { repeat } from 'lit/directives/repeat.js';

import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import { keyed } from 'lit/directives/keyed.js';
import { FORM_STYLES } from './styles';
import { EVENT_LOADED_FULL_FORUM_INFO } from '../events';
import { GetForumRepositoryAdapter } from '../../../infrastructure/repositories/api/getForum.repository.adapter';
import { GetForumRepositoryPort } from '../../ports/getForum.repository.port';

@customElement('twpt-forum-select')
export default class ForumSelect extends I18nLitElement {
  @property({ type: String })
  accessor forumId: string | undefined;

  @property({ type: String })
  accessor language: string | undefined;

  @property({ type: Object })
  accessor forums: Forum[] | undefined;

  /**
   * Authenticated user ID, used for API calls.
   */
  @property({ type: String })
  accessor authuser: string | undefined;

  /**
   * Display language code set by the user in the Community Console.
   */
  @property({ type: String })
  accessor displayLanguage: string | undefined;

  static styles = [SHARED_MD3_STYLES, FORM_STYLES];

  private readonly getForumRepository: GetForumRepositoryPort =
    new GetForumRepositoryAdapter();

  render() {
    return html`
      <div class="fields">
        ${this.renderForumSelect()} ${this.renderLanguageSelect()}
      </div>
    `;
  }

  private renderForumSelect() {
    const sortedForums =
      this.forums?.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'accent' }),
      ) ?? [];

    return html`
      <md-outlined-select
        label="Community Forum"
        required
        clampMenuWidth
        @change=${this.onForumChanged}
      >
        ${repeat(
          sortedForums,
          (forum) => forum.id,
          (forum) => html`
            <md-select-option
              value=${forum.id}
              ?selected=${forum.id === this.forumId}
            >
              <div slot="headline">${forum.name ?? forum.id}</div>
            </md-select-option>
          `,
        )}
      </md-outlined-select>
    `;
  }

  renderLanguageSelect() {
    const selectedForum = this.getSelectedForum();
    const isForumSelected = selectedForum !== undefined;

    const sortedLanguageConfigurations =
      selectedForum?.languageConfigurations.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'accent' }),
      ) ?? [];

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
          ${repeat(
            sortedLanguageConfigurations,
            (language) => language.id,
            (language) => html`
              <md-select-option
                value=${language.id}
                ?selected=${language.id === this.language}
              >
                <div slot="headline">${language.name ?? language.id}</div>
              </md-select-option>
            `,
          )}
        </md-outlined-select>
      `,
    );
  }

  private getSelectedForum(): Forum | undefined {
    return this.forums?.find((forum) => forum.id === this.forumId);
  }

  private async onForumChanged(e: Event) {
    this.forumId = (e.target as HTMLInputElement).value;

    const forum = await this.loadFullSelectedForumInfo();
    if (
      !forum.languageConfigurations.some(
        (language) => language.id === this.language,
      )
    ) {
      this.language = undefined;
    }
    const changeEvent = new Event('change');
    this.dispatchEvent(changeEvent);

    const loadedFullForumInfoEvent = new CustomEvent(
      EVENT_LOADED_FULL_FORUM_INFO,
      { detail: { forum } },
    );
    this.dispatchEvent(loadedFullForumInfoEvent);
  }

  private onLanguageChanged(e: Event) {
    this.language = (e.target as HTMLInputElement).value;

    const event = new Event('change');
    this.dispatchEvent(event);
  }

  private async loadFullSelectedForumInfo(): Promise<Forum> {
    return this.getForumRepository.getForum(
      this.forumId,
      this.displayLanguage,
      this.authuser,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-forum-select': ForumSelect;
  }
}
