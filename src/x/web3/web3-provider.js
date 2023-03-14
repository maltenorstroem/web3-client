import { LitElement } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';

/**
 * `web3-provider`
 * The web3-provider component is an umbrella package to house all Ethereum related modules.
 *
 * @summary
 * @customElement
 * @appliesMixin FBP
 */
class Web3Provider extends FBP(LitElement) {
  /**
   * Furo flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires();
    this.provider = 'ws://127.0.0.1:8545';
    this.web3 = {};
  }

  static get properties() {
    return {
      /**
       * Sets the provider
       * i.e. http, ws
       */
      provider: { type: String, attribute: 'provider' },
    };
  }

  connect(provider) {
    if (provider && provider.length) {
      this.provider = provider;
    }
    this.web3 = new Web3(this.provider);

    this.web3.currentProvider.connection.onopen = e => {
      const customEvent = new Event('connection-opened', { composed: true, bubbles: true });
      customEvent.detail = this.web3;
      this.dispatchEvent(customEvent);
    };

    this.web3.currentProvider.connection.onerror = () => {
      const customEvent = new Event('connection-failed', { composed: true, bubbles: true });
      customEvent.detail = 'Connection to given provider failed. ' + '(' + this.provider + ')';
      this.dispatchEvent(customEvent);
    };

    this.web3.currentProvider.connection.onclose = () => {
      const customEvent = new Event('connection-closed', { composed: true, bubbles: true });
      customEvent.detail = 'Connection to given provider closed. ' + '(' + this.provider + ')';
      this.dispatchEvent(customEvent);
    };
  }
}

window.customElements.define('web3-provider', Web3Provider);
