import { css } from 'lit';
/**
 * This is the default adcubum styling file.
 *
 */
export class Styling {
  static get theme() {
    // language=CSS
    return css`
      :host {
        --background: var(--sapBackgroundColor, #f7f7f7);
        --on-background: var(--sapTextColor, #32363a);

        --separator: #e4e4e4;

        /* Spacing */
        --spacing-xxs: 4px;
        --spacing-xs: 8px;
        --spacing-s: 16px;
        --spacing: 24px;
        --spacing-m: 24px;
        --spacing-l: 32px;
        --spacing-xl: 40px;
        --spacing-xxl: 96px;

        /* Icon Size */
        --icon-size-s-plus: 18px;
        --icon-size-m: 24px;

        /* Transition */
        --transition-duration: 120ms;

        /* SAP Fiori */
        --sapIllus_BrandColorPrimary: var(--sapContent_Illustrative_Color1);
        --sapIllus_BrandColorSecondary: var(--sapContent_Illustrative_Color2);
        --sapIllus_StrokeDetailColor: var(--sapContent_Illustrative_Color4);
        --sapIllus_Layering1: var(--sapContent_Illustrative_Color5);
        --sapIllus_Layering2: var(--sapContent_Illustrative_Color6);
        --sapIllus_BackgroundColor: var(--sapContent_Illustrative_Color7);
        --sapIllus_ObjectFillColor: var(--sapContent_Illustrative_Color8);
        --sapIllus_AccentColor: var(--sapContent_Illustrative_Color3);
        --sapIllus_NoColor: none;
        --sapIllus_PatternShadow: url(#sapIllus_PatternShadow);
        --sapIllus_PatternHighlight: url(#sapIllus_PatternHighlight);

        /* project specific overrides */
        --split-master-width: 420px;

        --furo-form-layouter-row-gap: var(--spacing-s, 16px);
        --furo-form-layouter-column-gap: var(--spacing-s, 16px);
        --furo-ui5-form-field-container-grid-row-gap: var(--spacing-xs, 8px);
      }
    `;
  }
}
