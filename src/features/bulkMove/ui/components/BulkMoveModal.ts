import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { I18nLitElement } from '../../../../common/litI18nUtils';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';
import { Forum, LanguageConfiguration } from '../../../../domain/forum';
import { ThreadProperty } from '../../../../domain/threadProperty';
import ForumSelect from './selects/ForumSelect';
import AdditionalDetailsSelect from './selects/AdditionalDetailsSelect';

import './selects/AdditionalDetailsSelect';
import './selects/ForumSelect';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/icon/icon.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import { EVENT_LOADED_FULL_FORUM_INFO } from './events';

@customElement('twpt-bulk-move-modal')
export default class BulkMoveModal extends I18nLitElement {
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  /**
   * Array with partial preloaded forums data. In specific, all forums
   * to be shown should be available in this array, but not all language
   * configurations need to be passed here.
   *
   * The modal will look up the full language configurations array when
   * the forum is selected.
   */
  @property({ type: Object })
  accessor preloadedForums: Forum[] | undefined;

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

  @state()
  private accessor forumId: string | undefined;

  @state()
  private accessor language: string | undefined;

  @state()
  private accessor categoryId: string | undefined;

  @state()
  private accessor properties: ThreadProperty[] | undefined = [];

  /**
   * Map which contains complete forums data, loaded via GetForum.
   */
  @state()
  private accessor fullForumInfo = new Map<string, Forum>([]);

  static styles = [
    SHARED_MD3_STYLES,
    typescaleStyles,
    css`
      :host {
        pointer-events: auto;
      }

      .content {
        .section-title {
          margin-bottom: 16px;
        }
      }
    `,
  ];

  forumSelectRef: Ref<ForumSelect> = createRef();
  additionalDetailsSelectRef: Ref<AdditionalDetailsSelect> = createRef();

  render() {
    return html`
      <md-dialog
        aria-label="Move threads dialog"
        ?open=${this.open}
        @open=${this.openingDialog}
        @close=${this.closingDialog}
        @keydown=${(e: Event) => e.stopPropagation()}
      >
        <md-icon slot="icon">arrow_right_alt</md-icon>
        <span slot="headline">Move threads</span>
        <div class="content" slot="content">
          <div class="section-title md-typescale-title-medium">
            Destination forum
          </div>
          <twpt-forum-select
            forumId=${this.forumId}
            language=${this.language}
            .forums=${this.forums}
            authuser=${this.authuser}
            displayLanguage=${this.displayLanguage}
            @change=${this.onForumChanged}
            @loaded-full-forum-info=${this.onLoadedFullForumInfo}
            ${ref(this.forumSelectRef)}
          ></twpt-forum-select>
          <div class="section-title md-typescale-title-medium">
            Additional details
          </div>
          <twpt-additional-details-select
            forumId=${this.forumId}
            language=${this.language}
            categoryId=${this.categoryId}
            .properties=${this.properties}
            .forums=${this.forums}
            @change=${this.onAdditionalDetailsChanged}
            ${ref(this.additionalDetailsSelectRef)}
          ></twpt-additional-details-select>
        </div>
        <div slot="actions">
          <md-text-button @click=${this.cancel}>Cancel</md-text-button>
          <md-text-button>Move</md-text-button>
        </div>
      </md-dialog>
    `;
  }

  /**
   * Retrieves a forums array with the maximum amount of information
   * possible.
   *
   * In particular, it combines the data from `this.initialForums` with
   * the full data found in `this.fullForumInfo`.
   */
  private get forums() {
    const forums = structuredClone(this.preloadedForums);
    for (const fullForum of this.fullForumInfo.values()) {
      const existingForumIndex = forums.findIndex(
        (forum) => forum.id === fullForum.id,
      );
      if (existingForumIndex) {
        forums[existingForumIndex] = fullForum;
      } else {
        forums.push(fullForum);
      }
    }
    return forums;
  }

  private cancel() {
    this.open = false;
    this.resetForm();
  }

  private resetForm() {
    this.forumId = undefined;
    this.language = undefined;
    this.categoryId = undefined;
    this.properties = [];
  }

  private openingDialog() {
    this.open = true;
  }

  private closingDialog() {
    this.open = false;
  }

  private onForumChanged() {
    const previousCategoryId = this.categoryId;
    const previousProperties: Readonly<ThreadProperty[]> = this.properties;

    this.categoryId = undefined;
    this.properties = [];
    this.forumId = this.forumSelectRef.value?.forumId;
    this.language = this.forumSelectRef.value?.language;

    const newLanguageConfiguration = this.getLanguageConfiguration();
    this.attemptToSetPreviousCategory(
      previousCategoryId,
      newLanguageConfiguration,
    );
    this.attemptToSetPreviousProperties(
      previousProperties,
      newLanguageConfiguration,
    );
  }

  private attemptToSetPreviousCategory(
    previousCategoryId: string,
    newLanguageConfiguration: LanguageConfiguration,
  ) {
    if (
      (newLanguageConfiguration?.categories ?? []).some(
        (category) => category.id === previousCategoryId,
      )
    ) {
      this.categoryId = previousCategoryId;
    }
  }

  private attemptToSetPreviousProperties(
    previousProperties: Readonly<ThreadProperty[]>,
    newLanguageConfiguration: LanguageConfiguration,
  ) {
    this.properties = previousProperties.filter((prevProperty) => {
      return newLanguageConfiguration.details.some(
        (detail) =>
          detail.id === prevProperty.key &&
          detail.options.some((option) => option.id === prevProperty.value),
      );
    });
  }

  private onAdditionalDetailsChanged() {
    const additionalDetailsSelect = this.additionalDetailsSelectRef.value;
    this.categoryId = additionalDetailsSelect?.categoryId;
    this.properties = additionalDetailsSelect?.properties;
  }

  private getLanguageConfiguration() {
    const forum = this.forums?.find((forum) => forum.id === this.forumId);
    return forum?.languageConfigurations.find((configuration) =>
      configuration.supportedLanguages.includes(this.language),
    );
  }

  private onLoadedFullForumInfo(
    e: WindowEventMap[typeof EVENT_LOADED_FULL_FORUM_INFO],
  ) {
    const forum = e.detail.forum;
    this.fullForumInfo.set(forum.id, forum);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-bulk-move-modal': BulkMoveModal;
  }
}
