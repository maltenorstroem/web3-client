import * as Avatar from '@ui5/webcomponents/dist/Avatar.js';

/**
 * `display-adcubum-common-tenant`
 * Standard renderer component to visualize adcubum.common.Tenant.
 * https://git.adcubum.com/projects/EWF/repos/adcubum-library-generalapis-bff-spec/browse/muspecs/tenancy/Tenant.types.yaml
 *
 * ``` yaml
 * - type: 'adcubum.common.Tenant'
 *   fields:
 *     id: 'string:1 #Id of the tenant/subtenant'
 *     initials: 'string:2 #2-digit char initials of the tenant/subtenant'
 *     short_form : 'string:3 #Localized short designation of the tenant/subtenant'
 *     description: 'string:4 #Localized description of the tenant/subtenant'
 *     semantic_color: 'string:5 #Defines the background color. Possible values are; Accent1 to Accent10'
 * ```
 *
 * @summary tenant type
 * @customElement
 */
export class DisplayAdcubumCommonTenant extends Avatar.default {
  /**
   * Binds a field node to the component
   * @param fieldNode
   */
  bindData(fieldNode) {
    this._field = fieldNode;

    if (this._field) {
      this._field.addEventListener('field-value-changed', () => {
        this._updateAttributes();
      });
      this._updateAttributes();
    }
  }

  _updateAttributes() {
    this.size = 'XS';
    this.shape = 'Square';
    // eslint-disable-next-line no-unused-expressions
    this._field.initials._value.length
      ? this.removeAttribute('hidden')
      : this.setAttribute('hidden', null);

    this.initials = this._field.initials._value;
    this.setAttribute('color-scheme', this._field.semantic_color._value || 'Accent6');
  }
}
window.customElements.define('display-adcubum-common-tenant', DisplayAdcubumCommonTenant);
