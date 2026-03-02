import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ccModalStyles } from './CCModal';
import './CCModal';
import '@material/web/button/text-button.js';
import '@material/web/progress/circular-progress.js';

type ModalStep = 'initial' | 'loading' | 'gotya';

const FEATURE_TITLE = 'Suspend users';

@customElement('twpt-bulk-nuke-modal')
export default class BulkNukeModal extends LitElement {
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @state()
  private accessor step: ModalStep = 'initial';

  private timeoutId: number | undefined;

  static styles = [
    ccModalStyles,
    css`
      twpt-cc-modal {
        --cc-modal-width: 500px;

        .loading {
          display: flex;
          padding-block: 2em;
          flex-direction: column;
          align-items: center;

          md-circular-progress {
            --md-sys-color-primary: var(--TWPT-blue-A100, #4285f4);
          }
        }
      }
    `,
  ];

  render() {
    return html`
      <twpt-cc-modal ?open=${this.open} @close=${() => this.close()}>
        ${this.renderModalContents()}
      </twpt-cc-modal>
    `;
  }

  renderModalContents() {
    switch (this.step) {
      case 'initial':
        return this.renderInitial();

      case 'loading':
        return this.renderLoading();

      case 'gotya':
        return this.renderGotya();
    }
  }

  private renderInitial() {
    return html`
      <span slot="title">${FEATURE_TITLE}</span>
      <div slot="main">
        <p>
          This will report and temporarily suspend the original posters of the
          selected threads, as well as hiding the threads created by them.
        </p>
      </div>
      <md-text-button slot="footer" class="no" @click=${this.close}>
        Cancel
      </md-text-button>
      <md-text-button slot="footer" class="yes" @click=${this.doTheMagic}>
        Submit report
      </md-text-button>
    `;
  }

  private renderLoading() {
    return html`
      <span slot="title">${FEATURE_TITLE}</span>
      <div class="loading" slot="main">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>
    `;
  }

  private renderGotya() {
    return html`
      <span slot="title">🎉🎉 Happy April Fool's day! 🎉🎉</span>
      <div slot="main">
        <p>
          Unfortunately we cannot suspend spammers (yet!). But hopefully the
          spam issue™ will improve soon!
        </p>
        <p>― TW Power Tools</p>
      </div>
      <md-text-button slot="footer" class="yes" @click=${this.close}>
        Enjoy your day!
      </md-text-button>
    `;
  }

  private doTheMagic() {
    this.step = 'loading';
    this.timeoutId = window.setTimeout(() => {
      this.step = 'gotya';
    }, 3963);
  }

  private close() {
    this.open = false;
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
    }
    this.step = 'initial';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-bulk-nuke-modal': BulkNukeModal;
  }
}
