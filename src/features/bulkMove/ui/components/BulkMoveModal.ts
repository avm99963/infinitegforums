import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { I18nLitElement } from '../../../../common/litI18nUtils';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';
import { Forum } from '../../../../domain/forum';
import { ThreadProperty } from '../../../../domain/threadProperty';
import { EVENT_START_BULK_MOVE } from './events';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import ForumDestinationPicker from '../../../../ui/components/forumDestinationPicker/ForumDestinationPicker';

import '../../../../ui/components/forumDestinationPicker/ForumDestinationPicker';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/icon/icon.js';

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

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        pointer-events: auto;
      }
    `,
  ];

  private forumDestinationPicker: Ref<ForumDestinationPicker> = createRef();

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
          <twpt-forum-destination-picker
            .preloadedForums=${this.preloadedForums}
            authuser=${this.authuser}
            displayLanguage=${this.displayLanguage}
            forumId=${this.forumId}
            language=${this.language}
            categoryId=${this.categoryId}
            .properties=${this.properties}
            @change=${this.onForumDestinationChange}
            ${ref(this.forumDestinationPicker)}
          ></twpt-forum-destination-picker>
        </div>
        <div slot="actions">
          <md-text-button @click=${this.cancel}>Cancel</md-text-button>
          <md-text-button ?disabled=${!this.isFormComplete} @click=${this.move}>
            Move
          </md-text-button>
        </div>
      </md-dialog>
    `;
  }

  private get isFormComplete(): boolean {
    return (
      this.forumId !== undefined &&
      this.language !== undefined &&
      this.categoryId !== undefined
    );
  }

  private cancel() {
    this.open = false;
    this.resetForm();
  }

  private move() {
    this.open = false;
    const e = new CustomEvent<
      GlobalEventHandlersEventMap[typeof EVENT_START_BULK_MOVE]['detail']
    >(EVENT_START_BULK_MOVE, {
      detail: {
        destinationForumId: this.forumId,
        language: this.language,
        categoryId: this.categoryId,
        properties: this.properties,
      },
    });
    this.dispatchEvent(e);
    this.resetForm();
  }

  private resetForm() {
    this.forumId = undefined;
    this.language = undefined;
    this.categoryId = undefined;
    this.properties = [];
  }

  private onForumDestinationChange() {
    this.forumId = this.forumDestinationPicker.value?.forumId;
    this.language = this.forumDestinationPicker.value?.language;
    this.categoryId = this.forumDestinationPicker.value?.categoryId;
    this.properties = this.forumDestinationPicker.value?.properties;
  }

  private openingDialog() {
    this.open = true;
  }

  private closingDialog() {
    this.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-bulk-move-modal': BulkMoveModal;
  }
}
