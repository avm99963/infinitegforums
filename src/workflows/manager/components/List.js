import {html, LitElement} from 'lit';

export default class WFList extends LitElement {
  render() {
    return html`<p>Temporary placeholder where the workflows list will exist.</p>`;
  }
}
window.customElements.define('wf-list', WFList);
