import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp';

// workaround for elements which do not like lazy loading
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Assets.js';
import '@ui5/webcomponents-localization/dist/Assets.js';
import '@ui5/webcomponents-fiori/dist/Assets.js';
import '@ui5/webcomponents-theming/dist/Assets.js';

import '@furo/util/src/furo-config-loader.js';
import '@furo/route/src/furo-app-flow-router.js';
import '@furo/fbp/src/vizConnector.js';

import('./configs/init.js').then(() => {
  import('./main-stage.js');
});

/**
 * `main-app`
 *
 * @customElement
 * @appliesMixin FBP
 */
class AppShell extends FBP(LitElement) {
  /**
   *
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          display: block;
          overflow: hidden;
          height: 100vh;
          color: var(--sapTextColor, #32363a);
        }
      `,
    ];
  }

  /**
   * @private
   * @returns {TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <main-stage
        at-app-flow="--flowEvent"
        at-response-error-401="--unauthorized"
        at-response-error-503="--serviceUnavailable503"
        at-unauthorized="--unauthorized"
        at-navigate-back-clicked="--navBack"
      ></main-stage>

      <furo-app-flow-router
        url-space-regex="^${window.APPROOT}"
        set-config="--flowConfigLoaded"
        fn-trigger="--flowEvent"
        fn-back="--navBack"
      ></furo-app-flow-router>
      <furo-app-flow
        event="unauthorized"
        fn-trigger="--unauthorized"
        at-app-flow="--flowEvent"
      ></furo-app-flow>
      <furo-app-flow
        event="general-error-occurred"
        fn-trigger="--serviceUnavailable503"
        at-app-flow="--flowEvent"
      ></furo-app-flow>
      <furo-config-loader
        src="src/configs/flowConfig.flow"
        section="flow"
        at-config-loaded="--flowConfigLoaded"
      ></furo-config-loader>
    `;
  }
}

window.customElements.define('app-shell', AppShell);
