import { customElement, property } from 'lit/decorators.js';
import { css, html } from 'lit';
import { msg } from '@lit/localize';
import { I18nLitElement } from '@/ui/i18n/i18nLitElement';
import { MdCheckbox } from '@material/web/checkbox/checkbox.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import {
  ReplySoftLockUserSelectionRepositoryPort,
  userSelectionRepositoryContext,
} from '../../repositories/userSelection.repository.port';
import { consume } from '@lit/context';

import '@material/web/checkbox/checkbox.js';
import '@/ui/components/badge/Badge';

@customElement('twpt-soft-lock-checkbox')
export default class TWPTSoftLockCheckbox extends I18nLitElement {
  @consume({ context: userSelectionRepositoryContext })
  @property({ attribute: false })
  private accessor repository!: ReplySoftLockUserSelectionRepositoryPort;

  private checkboxRef: Ref<MdCheckbox> = createRef();

  private softLockStatusUpdatedHandler: (() => void) | undefined;

  static styles = [
    css`
      label {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
      }

      .checkbox {
        position: relative;

        twpt-badge {
          position: absolute;
          right: 4px;
          bottom: 4px;
          --icon-size: 13px;
        }

        md-checkbox {
          /* Colors from the dark theme, and the (vanilla) light checkbox color as a fallback. */
          --container-color: var(--TWPT-interop-blue, #0b57d0);

          --md-checkbox-selected-container-color: var(--container-color);
          --md-checkbox-selected-focus-container-color: var(--container-color);
          --md-checkbox-selected-hover-container-color: var(--container-color);
          --md-checkbox-selected-pressed-container-color: var(
            --container-color
          );
        }
      }
    `,
  ];

  render() {
    return html`
      <label>
        <div class="checkbox">
          <md-checkbox
            touch-target="wrapper"
            @change=${this.updateGlobalSoftLockState}
            ${ref(this.checkboxRef)}
          ></md-checkbox>
          <twpt-badge></twpt-badge>
        </div>
        <span>${msg('Soft lock', { id: 'replySoftLock.checkbox.label' })}</span>
      </label>
    `;
  }

  firstUpdated() {
    // When the checkbox first appears, we want to save the default value in the
    // global state.
    this.updateGlobalSoftLockState();
  }

  connectedCallback() {
    super.connectedCallback();

    // When the global status changes, update this checkbox.
    this.softLockStatusUpdatedHandler = this.importSoftLockState.bind(this);
    document.body.addEventListener(
      SOFT_LOCK_STATUS_UPDATED_EVENT,
      this.softLockStatusUpdatedHandler,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.softLockStatusUpdatedHandler !== undefined) {
      document.body.removeEventListener(
        SOFT_LOCK_STATUS_UPDATED_EVENT,
        this.softLockStatusUpdatedHandler,
      );
    }
  }

  /**
   * Imports the global state of the soft lock checkboxes.
   *
   * This is used if another soft lock checkbox has been modified, so we can
   * change our status with the new global status.
   *
   * An example where this can happen is if the new and old reply editors are
   * open at the same time.
   */
  private async importSoftLockState() {
    const checkbox = this.checkboxRef.value;
    const shouldSoftLock = await this.repository.shouldSoftLock();
    if (
      checkbox !== undefined &&
      shouldSoftLock !== undefined &&
      checkbox.checked !== shouldSoftLock
    ) {
      checkbox.checked = shouldSoftLock;
    }
  }

  /**
   * Updates the global state of the soft lock checkboxes.
   *
   * We have to save the state globally because the individual checkbox
   * components can disappear if the reply editor is rerendered by Tailwind.
   *
   * In particular, this happens after the "Post" button is clicked. Thus, we
   * cannot clear this state after this element disappears.
   */
  private updateGlobalSoftLockState() {
    const isChecked = this.checkboxRef.value?.checked;
    if (isChecked === undefined) {
      console.error(
        '[replySoftLock] Cannot update value because the soft lock checkbox cannot be found.',
      );
      return;
    }

    if (this.repository === undefined) {
      console.error(
        "[replySoftLock] Cannot update value because the user selection repository hasn't been injected.",
      );
      return;
    }

    this.repository.setShouldSoftLock(isChecked);

    // Let other soft lock checkboxes know the status has been changed.
    document.body.dispatchEvent(
      new CustomEvent(SOFT_LOCK_STATUS_UPDATED_EVENT),
    );
  }
}

const SOFT_LOCK_STATUS_UPDATED_EVENT = 'twpt-soft-lock-status-updated';

declare global {
  interface HTMLElementTagNameMap {
    'twpt-soft-lock-checkbox': TWPTSoftLockCheckbox;
  }

  interface GlobalEventHandlersEventMap {
    [SOFT_LOCK_STATUS_UPDATED_EVENT]: CustomEvent<undefined>;
  }
}
