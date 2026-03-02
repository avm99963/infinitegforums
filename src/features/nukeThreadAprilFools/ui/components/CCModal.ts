import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('twpt-cc-modal')
export default class CCModal extends LitElement {
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  private accessor dialogRef: Ref<HTMLDialogElement> = createRef();

  // Colors are set with vars from the dark theme (it gets passed through the
  // shadow dom). The default values are those of the vanilla light theme.
  static styles = css`
    dialog {
      pointer-events: auto;
      width: var(--cc-modal-width);
      max-width: calc(512px + 40vw);
      outline: 1px solid transparent;
      padding: 0;
      border: 0;
      border-radius: 8px;

      flex-direction: column;

      overflow: hidden;

      /* Override default |canvastext| value. */
      color: inherit;
      background: var(--TWPT-primary-background, #fff);
      box-shadow:
        0 24px 38px 3px rgba(0, 0, 0, 0.14),
        0 9px 46px 8px rgba(0, 0, 0, 0.12),
        0 11px 15px -7px rgba(0, 0, 0, 0.2);

      @media (max-width: 520px) {
        max-width: calc(100vw - 40px);
      }

      &[open] {
        display: flex;
      }

      header {
        box-sizing: border-box;
        padding: 24px 24px 0;
        flex-shrink: 0;

        h3 {
          font-size: 20px;
          font-weight: 500;
          margin: 0 0 8px;
        }
      }

      .main {
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 400;
        width: 100%;
        padding: 0 24px;
        flex-grow: 1;
        overflow: auto;

        border-bottom: 1px solid transparent;
        border-top: 1px solid transparent;
      }

      footer {
        box-sizing: border-box;
        padding: 0 8px 8px;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
      }
    }

    dialog::backdrop {
      background: rgba(33, 33, 33, 0.4);
    }
  `;

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (changedProperties.has('open')) {
      if (this.open) {
        this.dialogRef.value?.showModal();
      } else {
        this.dialogRef.value?.close();
      }
    }
  }

  render() {
    return html`
      <dialog @close=${this.close} ${ref(this.dialogRef)}>
        <header>
          <h3><slot name="title"></slot></h3>
        </header>
        <div class="main">
          <slot name="main"></slot>
        </div>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </dialog>
    `;
  }

  private close() {
    const e = new Event('close');
    this.dispatchEvent(e);
  }
}

export const ccModalStyles = css`
  md-text-button {
    --md-text-button-container-shape: 0px;
    --md-text-button-container-height: 36px;
    --md-text-button-leading-space: 0.57em;
    --md-text-button-trailing-space: 0.57em;
    --md-text-button-label-text-font: 'Google Sans';

    margin: 0 4px;

    &.no {
      --md-sys-color-primary: var(--TWPT-secondary-text, #474747);
    }

    &.yes {
      --md-sys-color-primary: var(--TWPT-blue-A100, #4285f4);
    }
  }
`;

declare global {
  interface HTMLElementTagNameMap {
    'twpt-cc-modal': CCModal;
  }
}
