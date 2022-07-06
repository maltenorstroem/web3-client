import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp';
import { i18n } from '@furo/framework/src/i18n.js';

import '@furo/route/src/furo-app-flow.js';
import '@furo/route/src/furo-document-title.js';
import '@furo/layout/src/furo-vertical-flex.js';
import '@furo/layout/src/furo-vertical-scroller.js';
import '@ui5/webcomponents-fiori/dist/ShellBar.js';
import '@ui5/webcomponents-fiori/dist/IllustratedMessage.js';
import '@ui5/webcomponents-fiori/dist/illustrations/tnt/Success.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Title.js';
import '@ui5/webcomponents/dist/Label.js';
import '@ui5/webcomponents/dist/Icon.js';

/**
 * `view-task-completed`
 * This view shows the success message if a usertask has completed.
 *
 * @summary
 * @customElement
 * @appliesMixin FBP
 */
class ViewTaskCompleted extends FBP(LitElement) {
  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires();
  }

  static get properties() {
    return {};
  }

  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          display: block;
          height: 100%;
        }

        :host([hidden]) {
          display: none;
        }

        div.initial {
          margin: 15% auto;
          text-align: center;
        }

        ui5-label {
          display: block;
        }
      `,
    ];
  }

  /**
   * @private
   * @returns {TemplateResult|TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <furo-vertical-flex>
        <furo-vertical-scroller>
          <ui5-shellbar
            primary-title="${i18n.t('usertask.shellbar.primary.title')}"
            secondary-title="${i18n.t('usertask.shellbar.secondary.title')}"
          >
            <ui5-button icon="home" slot="startButton" at-click="--homeRequested"></ui5-button>
          </ui5-shellbar>

          <ui5-illustrated-message name="TntSuccess">
            <ui5-button design="Emphasized">${i18n.t('Check.your.open.tasks')}</ui5-button>
          </ui5-illustrated-message>
        </furo-vertical-scroller>
      </furo-vertical-flex>

      <furo-app-flow fn-emit="--homeRequested" event="flow-home-page-requested"></furo-app-flow>
      <furo-document-title
        prefix="${i18n.t('usertask.shellbar.primary.title')} "
        fn-set-waypoint="--pageActivated"
      ></furo-document-title>
    `;
  }
}

window.customElements.define('view-task-completed', ViewTaskCompleted);
