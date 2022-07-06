import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';

/**
 * `web3-eth-account-list`
 * shows all available eth accounts
 *
 * @summary
 * @customElement
 * @appliesMixin FBP
 */
class Web3EthAccountList extends FBP(LitElement) {
  constructor() {
    super();
    this._accounts = [];
    this._noDataText = '';
  }

  /**
   * Furo flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires();
  }

  static get properties() {
    return {};
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
    `;
  }

  setProvider(provider) {
    if (provider && provider.eth) {
      this._provider = provider;
    }
  }

  list(provider) {
    if (provider && provider.eth) {
      this._provider = provider;
    }
    if (this._provider && this._provider.eth) {
      this._provider.eth.getAccounts().then(accounts => {
        this._accounts = accounts;
        this._noDataText = '';
        this.requestUpdate();
      });
    }
    this._noDataText = 'no accounts available';
  }

  /**
   * @private
   * @returns {TemplateResult|TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <ui5-list no-data-text="${this._noDataText}">
        ${this._accounts.map(
          acc => html`<ui5-li icon="accounting-document-verification">${acc}</ui5-li>`,
        )}
      </ui5-list>
    `;
  }
}

window.customElements.define('web3-eth-account-list', Web3EthAccountList);
