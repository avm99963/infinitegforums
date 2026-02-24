import '@m3e/web/snackbar';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Corner } from '@material/web/menu/menu.js';
import { WorkflowsBackups } from '@/features/workflows/core/workflowsStorage/workflowsBackup';
import { M3eSnackbar } from '@m3e/web/snackbar';

@customElement('wf-menu')
export default class WFMenu extends LitElement {
  @state()
  private accessor isMenuOpen: boolean = false;

  private backupsService = new WorkflowsBackups();

  static styles = css`
    .helper {
      height: 1rem;
      font-size: 1rem;
      vertical-align: middle;
      cursor: help;
    }
  `;

  // We use popover positioning since otherwise the menu is shown behind the
  // workflows list.
  render() {
    return html`
      <md-icon-button
        id="open-app-menu"
        aria-label="Toggle menu"
        @click=${() => (this.isMenuOpen = !this.isMenuOpen)}
      >
        <md-icon>more_vert</md-icon>
      </md-icon-button>
      <md-menu
        id="app-menu"
        anchor="open-app-menu"
        anchor-corner="${Corner.START_END}"
        menu-corner="${Corner.START_END}"
        positioning="popover"
        ?open=${this.isMenuOpen}
        @closing=${() => (this.isMenuOpen = false)}
      >
        <md-menu-item @click=${this.importWorkflows}>
          <div slot="headline">
            Import workflows
            <md-icon
              class="helper"
              title="Imported workflows will be added to the list of existing workflows. If a duplicate workflow is found, it will be overwritten with the imported version."
            >
              info
            </md-icon>
          </div>
        </md-menu-item>
        <md-menu-item @click=${this.exportWorkflows}>
          <div slot="headline">Export workflows</div>
        </md-menu-item>
      </md-menu>
    `;
  }

  private importWorkflows() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      if (input.files.length == 0) {
        // We can't import anything if there are no files.
        // This shouldn't happen in practice.
        return;
      }

      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = async (readerEvent) => {
        // It is a string since we called readAsText(), not readAsArrayBuffer().
        let backupString = readerEvent.target.result as string;
        try {
          const backup = this.backupsService.parse(backupString);
          await this.backupsService.import(backup);
          showSnackbar('Workflows imported successfully.');
        } catch (err) {
          console.error('An error occurred importing the backup:', err);
          showSnackbar(`An error occurred importing the backup: ${err}`);
        }
      };
    };
    input.click();
  }

  private async exportWorkflows() {
    try {
      const backup = await this.backupsService.create();
      const now = new Date();
      const date = `${now.getFullYear().toString().padStart(4, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      download(
        backup,
        `twpt-workflows-backup-${date}.json`,
        'application/json',
      );
    } catch (err) {
      console.error('An error occurred exporting the workflows:', err);
      showSnackbar(`An error occurred exporting the workflows: ${err}`);
    }
  }
}

/**
 * Download data to a file.
 *
 * Source: https://stackoverflow.com/a/30832210
 */
function download(data: string, filename: string, type: string) {
  const file = new Blob([data], { type: type });
  const url = URL.createObjectURL(file);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  setTimeout(function () {
    window.URL.revokeObjectURL(url);
  }, 0);
}

function showSnackbar(message: string) {
  M3eSnackbar.open(message);
}
