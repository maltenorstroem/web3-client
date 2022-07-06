import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';
import { i18n } from '@furo/framework/src/i18n.js';

import '@furo/route/src/furo-app-flow.js';
import '@furo/layout/src/furo-vertical-flex.js';

import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Button.js';

import '@ui5/webcomponents-fiori/dist/ShellBar.js';
import '@ui5/webcomponents-fiori/dist/IllustratedMessage.js';
import '@ui5/webcomponents-fiori/dist/illustrations/tnt/Systems.js';

// eslint-disable-next-line import/no-named-default
import { default as systemInfo } from '../package.json';

/**
 * `view-sysinfo`
 * shows the system information / third party notices
 * source: package.json
 *
 * @summary message pages
 * @customElement
 * @appliesMixin FBP
 */
class ViewSysinfo extends FBP(LitElement) {
  constructor() {
    super();
    this._module = '';
    this.dependencies = [];
  }

  /**
   * Reactive properties
   * @returns {{dependencies: {}}}
   */
  static get properties() {
    return {
      dependencies: {},
    };
  }

  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires()
    this._module = systemInfo.name;
    this.dependencies = Object.entries(systemInfo.dependencies).map(entry => [entry[0], entry[1]]);
    this.requestUpdate();
  }

  /**
   * CSS Styles
   * @private
   * @return {CSSResult}
   */
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

      .padding {
        padding: var(--FuroUi5MediaSizeIndentation, 0.625rem 2rem 0 2rem);
      }
    `;
  }

  /**
   * @private
   * @returns {TemplateResult}
   * @private
   */
  render() {
    // language=HTML
    return html`
      <furo-vertical-flex>
        <ui5-shellbar primary-title="${i18n.t('web.core.systeminformation.shellbar.heading')}">
          <ui5-button icon="nav-back" slot="startButton" at-click="--historyBack"></ui5-button>
        </ui5-shellbar>

        <div flex scroll>
          <ui5-illustrated-message name="TntSystems"></ui5-illustrated-message>
          <div class="padding">
            <ui5-title wrapping-type="Normal"
              >${i18n.t('web.core.systeminformation.thirdpartynotices')}: ${this._module}</ui5-title
            >
            ${this.dependencies.map(dep => html` <p>${dep[0]} : ${dep[1]}</p>`)}
          </div>
        </div>
      </furo-vertical-flex>

      <furo-app-flow fn-emit="--historyBack" event="history-back"></furo-app-flow>
    `;
  }
}

window.customElements.define('view-sysinfo', ViewSysinfo);
