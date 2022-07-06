// Initialize application env, theme, api
import { Init, i18n, Env } from '@furo/framework/src/furo.js';
import { BaseSpecValidators } from '@furo/framework/src/BaseSpecValidators/BaseSpecValidators.js';
import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language.js';

/**
 * Import custom icon set
 */
import './iconset.js';

/**
 * Register resource bundle i18n
 */
import { Translations } from './translations.js';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';

/**
 * Use the installed spec if you finally have a separate spec project (recommended)
 */

/**
 * Register the base validators
 */
BaseSpecValidators.registerAll();

/**
 * Register the available types (only needed if you work with @furo/data... components  )
 */

/**
 * register the API prefix based on the APPROOT.
 * This information is used for furo-deep-link and furo-reverse-deep-link to resolve the api address.
 *
 * We use /api here, because we do not have a dedicated host like api.xxx.com for the api services
 * @type {string}
 */
Env.api.prefix = `${window.APPROOT}/api`;

// -- ST4 translations Intl methods
i18n.t = key => {
  const b = i18n.resbundle[Env.locale.toLowerCase().replace('-', '_')] || i18n.resbundle.de_ch;

  if (b === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`No resource bundle with locale ${Env.locale} exists.`);
    return '';
  }

  const res = key.split('.').reduce((acc, part) => acc && acc[part], b);
  return res || `${key}**`;
};

i18n.n = (key, num) => {
  let t = i18n.resbundle[Env.locale.toLowerCase().replace('-', '_')] || i18n.resbundle.de_ch;

  if (t === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`No resource bundle with locale ${Env.locale} exists.`);
    return '';
  }

  const p = key.split('.');
  for (let i = 0; i < p.length; i += 1) {
    if (t[p[i]]) {
      t = t[p[i]];
    } else {
      // eslint-disable-next-line no-console
      console.warn('key does not exist', key);
      return '';
    }
  }

  if (t) {
    if (num === 1) {
      if (t.one) {
        return t.one(num);
      }
      // eslint-disable-next-line no-console
      console.warn('key does not exist', `${key}.one`);
      return num;
    }
    if (num > 1) {
      if (t.many) {
        return t.many(num);
      }
      // eslint-disable-next-line no-console
      console.warn('key does not exist', `${key}.many`);
      return num;
    }
    if (t.none) {
      return t.none(num);
    }
    // eslint-disable-next-line no-console
    console.warn('key does not exist', `${key}.none`);
    return num;
  }
  return '';
};

/**
 * Register ST4 translation module
 */
i18n.registerResBundle(Translations);

/**
 * Grap URL parameters for
 * - theming
 * - language
 * @type {string}
 */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

/**
 * UI theme
 */
let uiTheme = urlParams.get('sap-ui-theme') || 'sap_fiori_3_hcw';
setTheme(uiTheme);

/**
 * UI language
 * @type {string|string}
 */
let locale = urlParams.get('sap-ui-language') || navigator.language || 'de';
Env.locale = locale;
setLanguage(Env.locale);

/**
 * Translate static messages in SPEC
 */
if (i18n.resbundle[Env.locale.toLowerCase().replace('-', '_')]) {
  locale = Env.locale.toLowerCase().replace('-', '_');
}

Init.translateStaticTypeMessages(locale);

/**
 * Apply the prefix to all service deeplinks and to all furo.Reference types with defaults
 */
Init.applyCustomApiPrefixToServicesAndTypes(Env.api.prefix);
