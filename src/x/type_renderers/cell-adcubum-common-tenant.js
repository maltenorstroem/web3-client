import { DisplayAdcubumCommonTenant } from './display-adcubum-common-tenant.js';

/**
 * `cell-adcubum-common-tenant`
 * Standard renderer component to visualize adcubum.common.Tenant in the context `cell`
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
export class CellAdcubumCommonTenant extends DisplayAdcubumCommonTenant {}
window.customElements.define('cell-adcubum-common-tenant', CellAdcubumCommonTenant);
