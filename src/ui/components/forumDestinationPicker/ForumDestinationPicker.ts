import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { Forum, LanguageConfiguration } from '../../../domain/forum';
import { ThreadProperty } from '../../../domain/threadProperty';
import { SHARED_MD3_STYLES } from '../../../common/styles/md3';
import { EVENT_LOADED_FULL_FORUM_INFO } from './events';
import ForumPicker from './selects/ForumPicker';
import AdditionalDetailsPicker from './selects/AdditionalDetailsPicker';
import { msg } from '@lit/localize';

@customElement('twpt-forum-destination-picker')
export default class ForumDestinationPicker extends I18nLitElement {
  /**
   * Array with partial preloaded forums data. In specific, all forums
   * to be shown should be available in this array, but not all language
   * configurations need to be passed here.
   *
   * This component will look up the full language configurations array
   * when the forum is selected.
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

  @property({ type: String })
  accessor forumId: string | undefined;

  @property({ type: String })
  accessor language: string | undefined;

  @property({ type: String })
  accessor categoryId: string | undefined;

  @property({ type: Array })
  accessor properties: ThreadProperty[] | undefined = [];

  /**
   * Map which contains complete forums data, loaded via GetForum.
   */
  @state()
  private accessor fullForumInfo = new Map<string, Forum>([]);

  static styles = [
    SHARED_MD3_STYLES,
    typescaleStyles,
    css`
      .section-title {
        margin-bottom: 16px;
      }
    `,
  ];

  private forumPickerRef: Ref<ForumPicker> = createRef();
  private additionalDetailsPickerRef: Ref<AdditionalDetailsPicker> =
    createRef();

  render() {
    return html`
      <div class="section-title md-typescale-title-medium">
        ${msg('Destination forum', {
          id: 'components.forumDestinationPicker.destinationForum',
          desc: 'Title of the section in the forum destination picker which contains the destination forum and language selects.',
        })}
      </div>
      <twpt-forum-picker
        forumId=${this.forumId}
        language=${this.language}
        .forums=${this.forums}
        authuser=${this.authuser}
        displayLanguage=${this.displayLanguage}
        autofocus
        @change=${this.onForumChanged}
        @loaded-full-forum-info=${this.onLoadedFullForumInfo}
        ${ref(this.forumPickerRef)}
      ></twpt-forum-picker>
      <div class="section-title md-typescale-title-medium">
        ${msg('Additional details', {
          id: 'components.forumDestinationPicker.additionalDetails',
          desc: 'Title of the section in the forum destination picker with the category/details selects.',
        })}
      </div>
      <twpt-additional-details-picker
        forumId=${this.forumId}
        language=${this.language}
        categoryId=${this.categoryId}
        .properties=${this.properties}
        .forums=${this.forums}
        @change=${this.onAdditionalDetailsChanged}
        ${ref(this.additionalDetailsPickerRef)}
      ></twpt-additional-details-picker>
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
      if (existingForumIndex !== -1) {
        forums[existingForumIndex] = fullForum;
      } else {
        forums.push(fullForum);
      }
    }
    return forums;
  }

  private onForumChanged() {
    const previousCategoryId = this.categoryId;
    const previousProperties: Readonly<ThreadProperty[] | undefined> =
      this.properties;

    this.categoryId = undefined;
    this.properties = [];
    this.forumId = this.forumPickerRef.value?.forumId;
    this.language = this.forumPickerRef.value?.language;

    const newLanguageConfiguration = this.getLanguageConfiguration();
    this.attemptToSetPreviousCategory(
      previousCategoryId,
      newLanguageConfiguration,
    );
    this.attemptToSetPreviousProperties(
      previousProperties,
      newLanguageConfiguration,
    );

    this.dispatchChangeEvent();
  }

  private getLanguageConfiguration() {
    const forum = this.forums?.find((forum) => forum.id === this.forumId);
    return forum?.languageConfigurations.find((configuration) =>
      configuration.supportedLanguages.includes(this.language),
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
    previousProperties: Readonly<ThreadProperty[] | undefined>,
    newLanguageConfiguration: LanguageConfiguration,
  ) {
    this.properties =
      previousProperties?.filter((prevProperty) => {
        return newLanguageConfiguration.details.some(
          (detail) =>
            detail.id === prevProperty.key &&
            detail.options.some((option) => option.id === prevProperty.value),
        );
      }) ?? [];
  }

  private onAdditionalDetailsChanged() {
    const additionalDetailsPicker = this.additionalDetailsPickerRef.value;
    this.categoryId = additionalDetailsPicker?.categoryId;
    this.properties = additionalDetailsPicker?.properties;
    this.dispatchChangeEvent();
  }

  private dispatchChangeEvent() {
    const e = new Event('change');
    this.dispatchEvent(e);
  }

  private onLoadedFullForumInfo(
    e: GlobalEventHandlersEventMap[typeof EVENT_LOADED_FULL_FORUM_INFO],
  ) {
    const forum = e.detail.forum;
    this.fullForumInfo.set(forum.id, forum);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-forum-destination-picker': ForumDestinationPicker;
  }
}
