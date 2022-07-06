import { LitElement, html, css } from 'lit';
import { FBP } from '@furo/fbp/src/fbp.js';
import { MediaSize } from '@furo/ui5/src/lib/MediaSize.js';
import { Styling } from './configs/stylevars.js';

/**
 * Registration of the standard ui5 type renderers
 * https://ui5.furo.pro/docs/typerenderer/
 */
import './configs/display-registry.js';

import '@furo/route/src/furo-location.js';
import '@furo/route/src/furo-pages.js';

import '@furo/ui5/src/furo-ui5-dialog-display.js';
import '@furo/ui5/src/furo-ui5-toast-display.js';
/**
 * Static imports of the views
 * The lazy imports a below in _FBPReady
 */
import './view-404.js';
import './view-5xx.js';
import './view-sysinfo.js';

import './eth/view-ethereum.js';

/**
 * `main-stage`
 *
 * @customElement
 * @appliesMixin FBP
 */
class MainStage extends FBP(LitElement) {
  /**
   * Flow based lifecycle event
   * flow is ready
   * @private
   */
  _FBPReady() {
    super._FBPReady();
    // this._FBPTraceWires();

    /**
     * Responsive spacing system
     */
    window.addEventListener(
      'resize',
      MediaSize.DebounceBuilder(() => {
        this.setAttribute('media-size', MediaSize.GetMediaSize());
      }, MediaSize.HANDLE_RESIZE_DEBOUNCE_RATE),
    );
    // initial size
    this.setAttribute('media-size', MediaSize.GetMediaSize());

    /**
     * Register hook on wire --locationChanged to
     * Lazy load parts of the page
     *
     * DO NOT FORGET TO REGISTER THE LAZY LOADED PARTS
     *
     */
    this._FBPAddWireHook('--locationChanged', e => {
      switch (e.pathSegments[0]) {
        case 'ROUTE':
          // import('./views/view-ROUTE.js');
          break;
        default:
      }
    });
  }

  /**
   * CSS styles
   * @private
   * @return {CSSResult}
   */
  static get styles() {
    // language=CSS
    return [
      css`
        :host {
          height: 100%;
          display: block;
          background: var(--background);
          color: var(--on-background);
          font-family: var(--sapFontFamily, '72'), '72full', Arial, Helvetica, sans-serif;
          font-size: var(--sapFontSize);
        }

        :host([media-size='XXL']) {
          --FuroUi5MediaSizeIndentation: 2rem 3rem 1rem 3rem;
          --FuroUi5MediaSizeIndentationTop: 2rem;
          --FuroUi5MediaSizeIndentationRight: 3rem;
          --FuroUi5MediaSizeIndentationBottom: 1;
          --FuroUi5MediaSizeIndentationLeft: 3rem;
        }

        :host([media-size='XL']) {
          --FuroUi5MediaSizeIndentation: 2rem 3rem 1rem 3rem;
          --FuroUi5MediaSizeIndentationTop: 2rem;
          --FuroUi5MediaSizeIndentationRight: 3rem;
          --FuroUi5MediaSizeIndentationBottom: 1;
          --FuroUi5MediaSizeIndentationLeft: 3rem;
        }

        :host([media-size='L']) {
          --FuroUi5MediaSizeIndentation: 1rem 2rem 0 2rem;
          --FuroUi5MediaSizeIndentationTop: 1rem;
          --FuroUi5MediaSizeIndentationRight: 2rem;
          --FuroUi5MediaSizeIndentationBottom: 0;
          --FuroUi5MediaSizeIndentationLeft: 2rem;
        }

        :host([media-size='M']) {
          --FuroUi5MediaSizeIndentation: 0.625rem 2rem 0 2rem;
          --FuroUi5MediaSizeIndentationTop: 0.625rem;
          --FuroUi5MediaSizeIndentationRight: 2rem;
          --FuroUi5MediaSizeIndentationBottom: 0;
          --FuroUi5MediaSizeIndentationLeft: 2rem;
        }

        :host([media-size='S']) {
          --FuroUi5MediaSizeIndentation: 0.625rem 1rem 0 1rem;
          --FuroUi5MediaSizeIndentationTop: 0.625rem;
          --FuroUi5MediaSizeIndentationRight: 1rem;
          --FuroUi5MediaSizeIndentationBottom: 0;
          --FuroUi5MediaSizeIndentationLeft: 1rem;
        }

        furo-pages {
          height: 100vh;
          overflow: hidden;
        }
      `,
      Styling.theme,
    ];
  }

  /**
   * @private
   * @returns {TemplateResult}
   */
  render() {
    // language=HTML
    return html`
      <!--
           furo-pages provide auto wires, which are automatically triggered in the child elements
           if they have flow-based enabled.

            –pageDeActivated, Every time the element changes to hidden
            –pageActivated, Triggered when the element is activated. Comes with a location object.
            –pageQueryChanged, Triggered when the page query changes. Comes with a location object.
            –pageHashChanged, Triggered when the page hash changes. Comes with a location object.
      -->
      <furo-pages fn-inject-location="--locationChanged" default="eth">
        <!-- Register your views below. The attribute 'name' is used for navigation and is visible in the URL. -->
        <view-ethereum name="eth"></view-ethereum>
        <!-- Page NOT FOUND  - fallback page if the requested page is not available -->
        <view-404 name="404"></view-404>
        <!-- Message Page 5xx - Error page for a 5xx error -->
        <view-5xx name="message-page-error"></view-5xx>
        <!-- Message Page System Information -->
        <view-sysinfo name="sys-info"></view-sysinfo>
      </furo-pages>

      <furo-ui5-toast-display></furo-ui5-toast-display>
      <furo-ui5-dialog-display></furo-ui5-dialog-display>

      <furo-location
        url-space-regex="^${window.APPROOT}"
        at-location-changed="--locationChanged"
      ></furo-location>
    `;
  }
}

window.customElements.define('main-stage', MainStage);
