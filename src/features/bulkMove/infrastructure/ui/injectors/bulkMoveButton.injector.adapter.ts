import { ThreadListGenericActionButtonInjectorPort } from '../../../../../ui/injectors/threadListGenericActionButton.injector.port';
import { Forum } from '../../../../../domain/forum';
import BulkMoveModal from '../../../ui/components/BulkMoveModal';
import { BulkMoveButtonInjectorPort } from '../../../ui/injectors/bulkMoveButton.injector.port';

const BULK_MOVE_ACTION_KEY = 'bulk-move';

export class BulkMoveButtonInjectorAdapter
  implements BulkMoveButtonInjectorPort
{
  private modal: BulkMoveModal | undefined;

  constructor(
    private readonly buttonInjector: ThreadListGenericActionButtonInjectorPort,
  ) {}

  execute() {
    const button = this.buttonInjector.execute({
      icon: 'arrow_right_alt',
      key: BULK_MOVE_ACTION_KEY,
    });
    if (button === null) {
      throw new Error(
        "Couldn't inject bulk move button to thread list actions toolbar.",
      );
    }

    button.addEventListener('click', () => this.showModal());
  }

  private showModal() {
    if (this.modal === undefined) {
      this.injectModal();
    }

    this.modal.setAttribute('open', '');
  }

  private injectModal() {
    const overlay = document.getElementById('default-acx-overlay-container');
    if (overlay === null) {
      throw new Error(
        "Couldn't inject modal because the overlay doesn't exist.",
      );
    }

    this.modal = document.createElement('twpt-bulk-move-modal');
    this.modal.setAttribute('forums', JSON.stringify(this.getForums()));
    overlay.append(this.modal);
  }

  private getForums(): Forum[] {
    return [
      {
        name: 'Google Chrome',
        id: 'chrome-dummy',
        languageConfigurations: [
          {
            id: 'es',
            name: 'Español',
            categories: [
              { id: 'learn', name: 'Aprende sobre Chrome' },
              { id: 'bug', name: 'Reporta un bug sobre Chrome' },
            ],
            details: [
              {
                id: 'os',
                name: 'Sistema operativo',
                options: [
                  { id: 'win', name: 'Windows' },
                  { id: 'mac', name: 'Mac' },
                  { id: 'linux', name: 'Linux' },
                ],
              },
              {
                id: 'channel',
                name: 'Canal de Chrome',
                options: [
                  { id: 'stable', name: 'Estable' },
                  { id: 'beta', name: 'Beta' },
                  { id: 'dev', name: 'Dev' },
                  { id: 'canary', name: 'Canary' },
                ],
              },
            ],
          },
          {
            id: 'en',
            name: 'English',
            categories: [],
            details: [],
          },
          {
            id: 'ca',
            name: 'Català',
            categories: [
              { id: 'learn', name: 'Aprèn sobre Chrome' },
              { id: 'bug', name: 'Reporta un bug de Chrome' },
              { id: 'fun', name: 'Yay!' },
            ],
            details: [],
          },
        ],
      },
      {
        name: 'Google AI',
        id: 'ai-dummy',
        languageConfigurations: [
          {
            id: 'es',
            name: 'Castellano',
            categories: [],
            details: [],
          },
          {
            id: 'ca',
            name: 'Català',
            categories: [],
            details: [],
          },
        ],
      },
    ];
  }
}
