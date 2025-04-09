import '@material/web/chips/assist-chip.js';
import '@material/web/chips/chip-set.js';
import '@material/web/icon/icon.js';
import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../../common/litI18nUtils';
import { css, html } from 'lit';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';
import { map } from 'lit/directives/map.js';
import { ReportStatus, ReportStatusValues } from '../../domain/reportStatus';
import { ReportType, ReportTypeValues } from '../../domain/reportType';
import { kEventReportReply } from '../events';
import { msg } from '@lit/localize';

interface ReportButton {
  type: ReportType;
  icon: string;
  labels: Record<ReportStatus, string>;
  status: ReportStatus;
}

@customElement('bulk-report-controls')
export default class BulkReportControls extends I18nLitElement {
  @property({ type: String })
  accessor forumId: string;

  @property({ type: String })
  accessor threadId: string;

  @property({ type: String })
  accessor messageId: string;

  @property({ type: String })
  accessor offTopicStatus: ReportStatus = ReportStatusValues.Idle;

  @property({ type: String })
  accessor abuseStatus: ReportStatus = ReportStatusValues.Idle;

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        display: flex;
        align-items: center;
        margin-left: auto;
      }

      md-assist-chip {
        --md-assist-chip-leading-icon-color: var(--md-sys-color-error);
        --md-assist-chip-focus-leading-icon-color: var(--md-sys-color-error);
        --md-assist-chip-hover-leading-icon-color: var(--md-sys-color-error);
        --md-assist-chip-pressed-leading-icon-color: var(--md-sys-color-error);
      }
    `,
  ];

  render() {
    return html`
      <md-chip-set aria-label="Report actions">
        ${this.renderButtons()}
      </md-chip-set>
    `;
  }

  private renderButtons() {
    const buttons = this.getButtons();
    const hasNonIdleButton = buttons.some(
      (btn) => btn.status !== ReportStatusValues.Idle,
    );

    return map(this.getButtons(), (btn) =>
      this.renderButton(btn, hasNonIdleButton),
    );
  }

  private renderButton(button: ReportButton, hasNonIdleButton: boolean) {
    let icon = button.icon;
    switch (button.status) {
      case ReportStatusValues.Processing:
        icon = 'pending';
        break;

      case ReportStatusValues.Done:
        icon = 'check';
        break;
    }

    return html`
      <md-assist-chip
        ?disabled=${hasNonIdleButton}
        @click=${() => this.sendReport(button.type)}
      >
        <md-icon slot="icon">${icon}</md-icon>
        ${button.labels[button.status]}
      </md-assist-chip>
    `;
  }

  private getButtons(): ReportButton[] {
    return [
      {
        type: ReportTypeValues.OffTopic,
        icon: 'block',
        labels: {
          [ReportStatusValues.Idle]: msg('Mark as off-topic', {
            id: 'bulkReportControls.offTopicChip.defaultLabel',
            desc: 'Chip shown to report a reply in a thread.',
          }),
          [ReportStatusValues.Processing]: msg('Marking as off-topic…', {
            id: 'bulkReportControls.offTopicChip.sendingLabel',
            desc: 'Chip label shown when sending the report.',
          }),
          [ReportStatusValues.Done]: msg('Marked as off-topic', {
            id: 'bulkReportControls.offTopicChip.successLabel',
            desc: 'Chip label shown when the report succeeded.',
          }),
        },
        status: this.offTopicStatus,
      },
      {
        type: ReportTypeValues.Abuse,
        icon: 'error',
        labels: {
          [ReportStatusValues.Idle]: msg('Mark as abuse', {
            id: 'bulkReportControls.abuseChip.defaultLabel',
            desc: 'Chip shown to report a reply in a thread.',
          }),
          [ReportStatusValues.Processing]: msg('Marking as abuse…', {
            id: 'bulkReportControls.abuseChip.sendingLabel',
            desc: 'Chip label shown when sending the report.',
          }),
          [ReportStatusValues.Done]: msg('Marked as abuse', {
            id: 'bulkReportControls.abuseChip.successLabel',
            desc: 'Chip label shown when the report succeeded.',
          }),
        },
        status: this.abuseStatus,
      },
    ];
  }

  private sendReport(type: ReportType) {
    const e: WindowEventMap[typeof kEventReportReply] = new CustomEvent(
      kEventReportReply,
      {
        bubbles: false,
        composed: false,
        detail: {
          forumId: this.forumId,
          threadId: this.threadId,
          messageId: this.messageId,
          type,
        },
      },
    );
    this.dispatchEvent(e);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bulk-report-controls': BulkReportControls;
  }
}
