import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { provide } from '@lit/context';

/**
 * The composition root for the Soft Lock settings component.
 *
 * It is a context provider.
 */
@customElement('twpt-reply-soft-lock-settings-context-provider')
export class TwptReplySoftLockSettingsContextProvider extends LitElement {
  render() {
    return html`
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-reply-soft-lock-settings-context-provider': TwptReplySoftLockSettingsContextProvider;
  }
}
