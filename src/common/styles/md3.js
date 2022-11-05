import {css} from 'lit';

// This is used to customize some colors. Also, we use this to pass the dark
// theme color scheme (it's defined in variables prefixed with --TWPT).
export const SHARED_MD3_STYLES = css`
  :host {
    --md-sys-color-primary: var(--TWPT-md-sys-color-primary, #6750a4);
    --md-sys-color-on-primary: var(--TWPT-md-sys-color-on-primary, #fff);
    --md-sys-color-surface: var(--TWPT-md-sys-color-surface, rgb(227, 255, 251));
    --md-sys-color-on-surface: var(--TWPT-md-sys-color-on-surface);
    --md-sys-color-on-surface-rgb: var(--TWPT-md-sys-color-on-surface-rgb);
    --md-sys-color-on-surface-variant: var(--TWPT-md-sys-color-on-surface-variant);
    --md-list-list-divider-color: var(--TWPT-md-list-list-divider-color);
    --md-ripple-hover-state-layer-color: var(--TWPT-md-ripple-hover-state-layer-color);
    --md-ripple-pressed-state-layer-color: var(--TWPT-md-ripple-pressed-state-layer-color);
    --md-icon-button-unselected-icon-color: var(--TWPT-custom-md-icon-color);
    --md-icon-button-unselected-hover-icon-color: var(--TWPT-custom-md-icon-color);
    --md-icon-button-unselected-focus-icon-color: var(--TWPT-custom-md-icon-color);
    --md-icon-button-unselected-pressed-icon-color: var(--TWPT-custom-md-icon-color);
    --mdc-theme-on-surface: var(--TWPT-primary-text, #000);
    --mdc-dialog-heading-ink-color: var(--TWPT-primary-text);
    --mdc-theme-surface: var(--TWPT-primary-background, #fff);
  }
`;
