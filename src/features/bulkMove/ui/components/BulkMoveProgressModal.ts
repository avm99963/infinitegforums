import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { I18nLitElement } from '../../../../common/litI18nUtils';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';
import { COMPLETE_STATES, Status, ThreadProgress } from './dataStructures';

import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/icon/icon.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/progress/circular-progress.js';
import { msg } from '@lit/localize';

@customElement('twpt-bulk-move-progress-modal')
export default class BulkMoveProgressModal extends I18nLitElement {
  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @property({ type: Array })
  accessor progress: ThreadProgress[] | undefined;

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        pointer-events: auto;
      }

      .thread-title {
        text-wrap: nowrap;
      }

      .progress-bar {
        display: block;
        margin: auto;
        margin-bottom: 16px;
      }

      md-circular-progress {
        --md-circular-progress-size: 32px;
      }
    `,
  ];

  render() {
    return html`
      <md-dialog
        ?open=${this.open}
        @open=${this.openingDialog}
        @close=${this.closingDialog}
      >
        <md-icon slot="icon">arrow_right_alt</md-icon>
        <span slot="headline">
          ${msg('Move threads', {
            id: 'bulkMove.dialogsTitle',
            desc: 'Title of the bulk move threads dialogs.',
          })}
        </span>
        <div class="content" slot="content">
          <progress
            value=${this.completedProgress}
            class="progress-bar"
          ></progress>
          <md-list>
            ${repeat(
              this.progress,
              (threadProgress) => threadProgress.originalThread.id,
              (threadProgress) => this.renderThreadProgressItem(threadProgress),
            )}
          </md-list>
        </div>
        <div slot="actions">
          <md-text-button
            ?disabled=${!this.isComplete}
            @click=${() => (this.open = false)}
          >
            ${msg('Close', {
              id: 'bulkMove.progressDialog.close',
              desc: 'Text of the button in the bulk move threads dialog which closes the dialog.',
            })}
          </md-text-button>
        </div>
      </md-dialog>
    `;
  }

  private renderThreadProgressItem(threadProgress: ThreadProgress) {
    const forumId =
      threadProgress.status === 'success'
        ? threadProgress.destinationForumId
        : threadProgress.originalThread.forumId;
    const threadUrl = `https://support.google.com/s/community/forum/${forumId}/thread/${threadProgress.originalThread.id}`;
    return html`
      <md-list-item href=${threadUrl} target="_blank">
        <div slot="headline" class="thread-title">
          ${threadProgress.originalThread.title}
        </div>
        ${threadProgress.errorMessage
          ? html`
              <div
                slot="supporting-text"
                style="color: var(--md-sys-color-error)"
              >
                ${threadProgress.errorMessage}
              </div>
            `
          : nothing}
        ${this.renderStatusIcon(threadProgress.status)}
      </md-list-item>
    `;
  }

  private renderStatusIcon(status: Status) {
    switch (status) {
      case 'waiting':
        return html`
          <md-icon
            slot="end"
            aria-label=${msg('Waiting', {
              id: 'bulkMove.progressDialog.status.waiting',
              desc: 'Status of a thread which is waiting to be moved.',
            })}
          >
            pending
          </md-icon>
        `;
      case 'loading':
        return html`
          <md-circular-progress
            slot="end"
            aria-label=${msg('Loading', {
              id: 'bulkMove.progressDialog.status.loading',
              desc: 'Status of a thread which is in the process of being moved.',
            })}
            indeterminate
          ></md-circular-progress>
        `;
      case 'success':
        return html`
          <md-icon
            slot="end"
            aria-label=${msg('Success', {
              id: 'bulkMove.progressDialog.status.success',
              desc: 'Status of a thread which has been moved successfully.',
            })}
            style=${styleMap({
              color: 'var(--md-extended-color-success-color)',
            })}
          >
            check
          </md-icon>
        `;
      case 'error':
        return html`
          <md-icon
            slot="end"
            aria-label=${msg('Error', {
              id: 'bulkMove.progressDialog.status.error',
              desc: 'Status of a thread which has been attempted to move, but failed.',
            })}
            style=${styleMap({ color: 'var(--md-sys-color-error)' })}
          >
            error
          </md-icon>
        `;
    }
  }

  private get isComplete() {
    return (
      this.progress === undefined ||
      this.progress?.every((threadProgress) =>
        COMPLETE_STATES.includes(threadProgress.status),
      )
    );
  }

  private get completedProgress() {
    if (this.progress !== undefined && this.progress.length > 0) {
      const completeThreads = this.progress.reduce(
        (partialSum, p) =>
          partialSum + (COMPLETE_STATES.includes(p.status) ? 1 : 0),
        0,
      );
      return completeThreads / this.progress.length;
    } else {
      return 0;
    }
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
    'twpt-bulk-move-progress-modal': BulkMoveProgressModal;
  }
}
