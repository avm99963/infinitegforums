import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { ReplySoftLockUserSelectionRepositoryPort } from '../../repositories/userSelection.repository.port';
import { ReplySoftLockUserSelectionRepositoryAdapter } from '../../infrastructure/repositories/userSelection.repository.adapter';
import { UrlThreadDataParserServiceAdapter } from '@/infrastructure/ui/services/communityConsole/urlThreadDataParser.service.adapter';
import { userSelectionRepositoryContext } from '../contexts/checkboxContexts';

/**
 * The composition root for the Soft Lock checkbox.
 *
 * It is a context provider.
 */
@customElement('twpt-reply-soft-lock-checkbox-context-provider')
export class TwptBulkMoveContextProvider extends LitElement {
  @provide({ context: userSelectionRepositoryContext })
  accessor userSelectionRepository: ReplySoftLockUserSelectionRepositoryPort =
    new ReplySoftLockUserSelectionRepositoryAdapter(
      new UrlThreadDataParserServiceAdapter(),
    );

  render() {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-reply-soft-lock-checkbox-context-provider': TwptBulkMoveContextProvider;
  }
}
