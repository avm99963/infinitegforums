import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import {
  getForumRepositoryContext,
  GetForumRepositoryPort,
} from '@/features/bulkMove/ui/ports/getForum.repository.port';
import { CommunityConsoleApiClientAdapter } from '@/infrastructure/services/communityConsole/api/CommunityConsoleApiClient.adapter';
import { GetForumRepositoryAdapter } from '@/features/bulkMove/infrastructure/repositories/api/getForum.repository.adapter';

/**
 * The composition root for UI code.
 *
 * It is a context provider.
 */
@customElement('twpt-bulk-move-context-provider')
export class TwptBulkMoveContextProvider extends LitElement {
  /**
   * Authenticated user ID, used for API calls.
   */
  @property({ type: Number })
  accessor authuser = 0;

  @provide({ context: getForumRepositoryContext })
  @state()
  accessor getForumRepository!: GetForumRepositoryPort;

  protected willUpdate(
    changedProperties: Map<string | number | symbol, unknown>,
  ) {
    if (changedProperties.has('authuser')) {
      const apiClient = new CommunityConsoleApiClientAdapter(this.authuser);
      this.getForumRepository = new GetForumRepositoryAdapter(apiClient);
    }
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-bulk-move-context-provider': TwptBulkMoveContextProvider;
  }
}
