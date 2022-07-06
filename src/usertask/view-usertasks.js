import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';
import { i18n } from '@furo/framework/src/i18n.js';

import '@furo/layout/src/furo-vertical-flex.js';
import '@furo/layout/src/furo-vertical-scroller.js';

import '@furo/data/src/furo-deep-link.js';
import '@furo/data/src/furo-entity-agent.js';
import '@furo/data/src/furo-reverse-deep-link.js';
import '@furo/data/src/furo-collection-agent.js';
import '@furo/data/src/furo-data-object.js';
import '@furo/route/src/furo-app-flow.js';
import '@furo/route/src/furo-document-title.js';
import '@furo/ui5/src/furo-ui5-card.js';
import '@furo/ui5/src/furo-ui5-message-strip-display.js';
import '@furo/ui5/src/furo-ui5-notification.js';
import '@furo/ui5/src/furo-ui5-notification-list-display.js';

import '@ui5/webcomponents-fiori/dist/ShellBar.js';
import '@ui5/webcomponents/dist/Button.js';
import '@ui5/webcomponents/dist/Popover.js';

import './utforms/formRegistry.js';
import '../x/adc-task-form-loader.js';

/**
 * `view-usertasks`
 *  Focus Mode, the main idea of this screen is to make a significant boost to the focus and productivity of the user.
 *  The core segment is the central module with the current action that you need to do.
 *  On the left and right sidebar you have the helper widgets with all the information that will help you
 *  make a better decision.
 *
 * @summary focus mode
 * @customElement
 * @appliesMixin FBP
 */
class ViewUsertasks extends FBP(LitElement) {
  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires();
  }

  /**
   * Themable Styles
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
        <ui5-shellbar
          at-notifications-click="--notificationsRequested(*.detail.targetRef)"
          primary-title="${i18n.t('focusmode.shellbar.heading')}"
          secondary-title="${i18n.t('focusmode.shellbar.subheading')}"
          show-notifications
          set-notification-count="--notificationCounterUpdated"
        >
          <ui5-button icon="home" slot="startButton" at-click="--homeRequested"></ui5-button>
        </ui5-shellbar>

        <div scroll>
          <!-- Notification List Popover
               gRPC Errors, localized Messages
               The popover notification component can be opened by
               the notification icon in the shellbar or by the error
               button if you use a form.
            -->
          <ui5-popover fn-show-at="--notificationsRequested" placement-type="top">
            <div class="popover-content">
              <!-- gRPC Error Handling, display and creator components-->
              <furo-ui5-notification-list-display
                header-text="Notifications"
                fn-clear-all="--registerRequested"
                at-notification-counter-update="--notificationCounterUpdated"
              ></furo-ui5-notification-list-display>

              <furo-ui5-notification fn-parse-grpc-status="--grpcError"></furo-ui5-notification>
            </div>
            <div slot="footer" class="popover-footer"></div>
          </ui5-popover>

          <adc-task-form-loader
            flex
            fn-qp-in="--pageActivated(*.query)"
            fn-_remove-current-form="--pageDeActivated"
            at-grpc-status="--grpcError"
            at-notification="--notification"
            at-grpc-error-show-requested="--notificationsRequested"
          ></adc-task-form-loader>
        </div>
      </furo-vertical-flex>

      <furo-app-flow event="flow-home-page-requested" fn-emit="--homeRequested"></furo-app-flow>
      <furo-app-flow event="flow-search-page-requested" fn-emit="--searchRequested"></furo-app-flow>
      <furo-document-title
        prefix="${i18n.t('focusmode.shellbar.heading')} "
        fn-set-waypoint="--pageActivated"
      ></furo-document-title>
    `;
  }
}

window.customElements.define('view-usertasks', ViewUsertasks);
