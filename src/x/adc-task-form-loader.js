import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';

import '@furo/data/src/furo-deep-link.js';
import '@furo/data/src/furo-reverse-deep-link.js';
import '@furo/data/src/furo-data-object.js';
import '@furo/data/src/furo-entity-agent.js';
import '@furo/layout/src/furo-vertical-scroller.js';
import '@furo/route/src/furo-app-flow.js';

/**
 * `adc-task-form-loader`
 *  Loads a user task form which is provided by your project.
 *
 *  ## Naming Convention
 *  We map the formKey directly to the component. If you have the form key *exampleFormKey* the corresponding component
 *  will be *form-example-form-key*.
 *
 *  ## Completing Forms
 *  If a HATEOAS link with rel *nexttask* is received, the form loader will assume that the form interaction is completed and closes the current form.
 *
 *  If the **href** points to a usertask entity, the following usertask form will be loaded.
 *
 *  If the **href** points to *NO_NEXT_TASK* the app-flow event *usertask-completed* will be emitted. Use this to route to the place you need.
 *
 * @summary camunda usertask handling
 * @customElement
 * @appliesMixin FBP
 */
class AdcTaskFormLoader extends FBP(LitElement) {
  /**
   * @private
   * @return {Object}
   */
  static get properties() {
    return {
      /**
       * Component which is evaluated from the usertask entity
       */
      formComponent: { type: String },
    };
  }

  /**
   * flow is ready lifecycle method
   */
  _FBPReady() {
    super._FBPReady();
    //  this._FBPTraceWires();

    this.formcontainer = this.shadowRoot.getElementById('utform'); // the div which holds the form

    /**
     * Register hook on wire --utEntityLoaded to
     * resolve / evaluate the needed component from Entity.data.formKey
     */
    this._FBPAddWireHook('--utEntityLoaded', this._handleUTEntityLoad());

    /**
     * Register hook on wire --hookNextTask to
     * handle task-completed events.
     * todo: as soon as the rel nexttask is available, handle nexttask to open the new form
     *
     * If we have a hateoas object with link rel nexttask, we should go for it
     */
    this._FBPAddWireHook('--hookNextTask', () => {});

    this.addEventListener('usertask-hts-notification', htsEvent => {
      const nextUserTaskHts = htsEvent.detail.filter(
        hts => hts.rel.toLowerCase() === 'nextusertask',
      );

      /**
       * The following HATEOAS means that no other usertask should be displayed. So we trigger the app-flow event *usertask-completed*
       * {"href":"NO_NEXT_USERTASK","method":"GET","rel":"nextusertask","service":"UserTaskService","type":"usertask.UserTask"}
       *
       * A HATEOAS with a href /usertask/xx will trigger the app flow event *usertask-selected*
       *
       */
      if (nextUserTaskHts.length > 0) {
        if (nextUserTaskHts[0].href !== 'NO_NEXT_USERTASK') {
          // send next task
          // eslint-disable-next-line no-param-reassign
          nextUserTaskHts[0].rel = 'self';
          this._FBPTriggerWire('--utHTSNotification', htsEvent.detail[0]);
        } else {
          this._FBPTriggerWire('--taskCompleted');
        }
      }
    });
  }

  /**
   * handler for the --utEntityLoaded hook.
   * @return {Function}
   * @private
   */
  _handleUTEntityLoad() {
    return utEntity => {
      /**
       * deep link url provided
       * processing of the usertask is managed on the given url
       */
      if (utEntity.data.deep_link_url?._value) {
        this._FBPTriggerWire('--utDeepLinked', utEntity.data.deep_link_url._value);
        // set the static form key utsk-external
        // eslint-disable-next-line no-param-reassign
        utEntity.data.form_key._value = 'managed-externally';
      }
      /**
       * Embedded form key provided
       * processing of the usertask is managed inside of the current module
       */
      this.formKey = utEntity.data.form_key._value;
      this.formComponent = `utform-${this.formKey
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()}`;

      this.theform = document.createElement(this.formComponent);

      // visibility will be given on _appendFormToDom
      this.theform.setAttribute('invisible', '');

      this.dispatchEvent(
        new CustomEvent('user-task-ready', {
          detail: utEntity,
          bubbles: true,
          composed: true,
        }),
      );

      if (this.theform.injectUserTask) {
        this.theform.injectUserTask(utEntity);
      } else {
        /* eslint-disable no-console */
        console.warn(
          this.formComponent,
          'is not registred or does not implement the injectKeyIds(map<String,String))',
        );
      }
      this._appendFormToDom(this.theform);
    };
  }

  /**
   * Appends the form to the dom.
   * @param formName
   * @private
   */
  _appendFormToDom(theform) {
    this._removeCurrentForm();
    this.currentForm = this.formcontainer.appendChild(theform);
    // remove invisible after 1 render cycle
    setTimeout(() => {
      this.theform.removeAttribute('invisible');
    }, 16);
  }

  /**
   * Removes the form from the dom.
   *
   * Tipp: use disconnectedCallback to clean up stuff in your form
   *
   * @private
   */
  _removeCurrentForm() {
    if (this.currentForm) {
      this.currentForm.remove();
    }
  }

  /**
   * Inject QueryParams Object for the deep-link UserTaskService.
   * The property which is needed for the UserTaskService is *id*
   *
   * //todo: at the moment {id} is defined as the key (usertask specs). I recommend to change this to {utkd}, just to avoid naming collisions
   *
   * @param d
   */
  qpIn(d) {
    this._removeCurrentForm();
    this._FBPTriggerWire('--qpIn', d);
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
      }

      :host([hidden]) {
        display: none;
      }

      furo-vertical-scroller {
        display: inline;
      }

      /* append the form invisible to avoid render flickering */
      furo-vertical-scroller > *[invisible] {
        opacity: 0;
      }

      furo-vertical-scroller > * {
        opacity: 1;
        transition: opacity ease-in-out 120ms;
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
      <!-- this is the container for the loaded forms -->
      <furo-vertical-scroller id="utform" at-nexttask="--hookNextTask"></furo-vertical-scroller>

      <furo-deep-link fn-qp-in="--qpIn" service="UserTaskService" at-hts-out="--utHts">
      </furo-deep-link>

      <furo-entity-agent
        service="UserTaskService"
        load-on-hts-in
        fn-hts-in="--utHts"
        at-response="--utData,^^notification(*.notifications)"
        at-error="^^grpc-status"
      >
      </furo-entity-agent>

      <furo-data-object
        type="usertask.UserTaskEntity"
        fn-inject-raw="--utData"
        at-data-injected="--utEntityLoaded"
      ></furo-data-object>

      <furo-reverse-deep-link
        service="UserTaskService"
        rel="get"
        at-converted="--utQueryParams"
        fn-convert="--utHTSNotification"
      ></furo-reverse-deep-link>

      <furo-app-flow event="usertask-completed" fn-emit="--taskCompleted"></furo-app-flow>
      <furo-app-flow event="usertask-selected" fn-emit="--utQueryParams"></furo-app-flow>
      <furo-app-flow event="deep-linked-url" fn-emit="--utDeepLinked"></furo-app-flow>
    `;
  }
}

window.customElements.define('adc-task-form-loader', AdcTaskFormLoader);
