import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';

import '@furo/layout/src/furo-vertical-flex.js';
import '@furo/layout/src/furo-form-layouter.js';

import '@furo/route/src/furo-document-title.js';

import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/List.js';
import '@ui5/webcomponents/dist/ListItem.js';

import '@ui5/webcomponents-fiori/dist/ShellBar.js';

import '@furo/ui5/src/furo-ui5-message-strip.js';
import '@furo/ui5/src/furo-ui5-message-strip-display.js';
import '@furo/ui5/src/furo-ui5-toast.js';
import '@furo/ui5/src/furo-ui5-header-panel.js';
import '@furo/ui5/src/furo-ui5-section.js';
import '@furo/ui5/src/furo-ui5-subsection.js';

import 'web3/dist/web3.min.js';

import '../x/web3/web3-provider.js';
import '../x/web3/web3-eth-account-list.js';

/**
 * `view-ethereum`
 * web3 connector to Ganache CLI v6.12.2 (ganache-core: 2.13.2)
 *
 * @summary
 * @customElement
 * @appliesMixin FBP
 */
class ViewEthereum extends FBP(LitElement) {
  constructor() {
    super();

    this.balanceValue = '0 ether';
    this.accountHash = '';
  }

  /**
   * Furo flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    this._FBPTraceWires();

    this._FBPAddWireHook('--pageActivated', query => {
      this.accountHash = query.query.acc;
    });

    this._FBPAddWireHook('--web3Opened', provider => {
      this._provider = provider;
      this._provider.eth.getNodeInfo().then(node => {
        this.node = node;
        this.requestUpdate();
      });

      this._getBalanceFor(this.accountHash);
    });

    this._FBPAddWireHook('--transferRequested', () => {
      this._sendTransaction();
    });
  }

  static get properties() {
    return {
      hex: { type: String },
    };
  }

  static get styles() {
    // language=CSS
    return css`
      :host {
        display: block;
        height: 100%;
      }

      :host([hidden]) {
        display: none;
      }

      .padding-lr {
        padding-right: var(--FuroUi5MediaSizeIndentationRight, 1rem);
        padding-left: var(--FuroUi5MediaSizeIndentationRight, 1rem);
      }
    `;
  }

  /**
   *
   * @param account
   * @private
   */
  _getBalanceFor(account) {
    this._provider.eth.getBalance(account).then(value => {
      this.balanceValue = this._provider.utils.fromWei(value, 'ether') + ' ether';
      this.requestUpdate();
    });
  }

  /**
   *
   * @private
   */
  _sendTransaction() {
    const FROM = this.shadowRoot.querySelector('#From');
    const TO = this.shadowRoot.querySelector('#To');
    const VALUE = this.shadowRoot.querySelector('#Value');

    if (FROM && FROM.value.length && TO && TO.value.length && VALUE && VALUE.value.length) {
      this._provider.eth
        .sendTransaction({
          from: FROM.value,
          to: TO.value,
          value: VALUE.value,
        })
        .then(receipt => {
          this._FBPTriggerWire('--transactionSuccess', JSON.stringify(receipt));
          this._getBalanceFor(this.accountHash);
        });
    }
  }

  /**
   * @private
   * @returns {TemplateResult|TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <furo-vertical-flex>
        <ui5-shellbar primary-title="Ethereum" secondary-title="${this.node}">
          <img src="../../assets/eth-diamond-black.webp" alt="Logo" slot="logo" />
        </ui5-shellbar>

        <furo-ui5-header-panel
          header-text="Your Balance: ${this.accountHash}"
          secondary-text="${this.balanceValue}"
        >
          <ui5-button slot="action" at-click="--reconnectRequested">Reconnect</ui5-button>
        </furo-ui5-header-panel>
        <furo-ui5-message-strip-display class="padding-lr"></furo-ui5-message-strip-display>
        <furo-ui5-message-strip
          fn-show-error="--web3Failed"
          fn-show-information="--web3Closed"
          fn-show-success="--transactionSuccess"
        ></furo-ui5-message-strip>

        <furo-ui5-toast fn-show="--web3Opened" placement="BottomEnd"
          >Connection opened</furo-ui5-toast
        >

        <furo-ui5-section>
          <furo-ui5-subsection heading="Available Accounts">
            <ui5-bar slot="action">
              <ui5-button
                slot="endContent"
                icon="refresh"
                design="Transparent"
                accessible-name-ref="lblResfresh"
                at-click="--accountRefreshRequested"
              ></ui5-button>
            </ui5-bar>
            <web3-eth-account-list
              fn-list="--web3Opened, --accountRefreshRequested"
            ></web3-eth-account-list>
          </furo-ui5-subsection>
        </furo-ui5-section>

        <furo-ui5-section>
          <furo-ui5-subsection heading="Transfer ETH (Ether)">
            <furo-form-layouter>
              <ui5-input id="From" required placeholder="From"></ui5-input>
              <ui5-input id="To" required placeholder="To"></ui5-input>
              <ui5-input
                id="Value"
                type="Number"
                required
                placeholder="Value in wei"
                value="1000000000000000000"
                value-state="Information"
              >
                <div slot="valueStateMessage">1000000000000000000 wei corresponds to 1 ether</div>
              </ui5-input>
              <ui5-button at-click="--transferRequested">Send</ui5-button>
            </furo-form-layouter>
          </furo-ui5-subsection>
        </furo-ui5-section>
      </furo-vertical-flex>

      <web3-provider
        fn-connect="--pageActivated, --reconnectRequested"
        at-connection-opened="--web3Opened"
        at-connection-failed="--web3Failed"
        at-connection-closed="--web3Closed"
      ></web3-provider>

      <furo-document-title
        prefix="Ethereum/"
        title="Balance 0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        fn-set-waypoint="--pageActivated"
      ></furo-document-title>
    `;
  }
}

window.customElements.define('view-ethereum', ViewEthereum);
