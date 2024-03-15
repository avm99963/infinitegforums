import {css} from 'lit';

// This is used to customize some colors. Also, we use this to pass the dark
// theme color scheme (it's defined in variables prefixed with --TWPT).
export const SHARED_MD3_STYLES = css`
  :host {
    /* Adapted from //src/md3/theme.scss */
    --md-sys-color-primary: var(--TWPT-md-sys-color-primary, rgb(0 106 96));
    --md-sys-color-surface-tint: var(--TWPT-md-sys-color-surface-tint, rgb(0 106 96));
    --md-sys-color-on-primary: var(--TWPT-md-sys-color-on-primary, rgb(255 255 255));
    --md-sys-color-primary-container: var(--TWPT-md-sys-color-primary-container, rgb(158 242 228));
    --md-sys-color-on-primary-container: var(--TWPT-md-sys-color-on-primary-container, rgb(0 32 28));
    --md-sys-color-secondary: var(--TWPT-md-sys-color-secondary, rgb(74 99 95));
    --md-sys-color-on-secondary: var(--TWPT-md-sys-color-on-secondary, rgb(255 255 255));
    --md-sys-color-secondary-container: var(--TWPT-md-sys-color-secondary-container, rgb(204 232 226));
    --md-sys-color-on-secondary-container: var(--TWPT-md-sys-color-on-secondary-container, rgb(5 32 28));
    --md-sys-color-tertiary: var(--TWPT-md-sys-color-tertiary, rgb(69 97 121));
    --md-sys-color-on-tertiary: var(--TWPT-md-sys-color-on-tertiary, rgb(255 255 255));
    --md-sys-color-tertiary-container: var(--TWPT-md-sys-color-tertiary-container, rgb(204 229 255));
    --md-sys-color-on-tertiary-container: var(--TWPT-md-sys-color-on-tertiary-container, rgb(0 30 49));
    --md-sys-color-error: var(--TWPT-md-sys-color-error, rgb(186 26 26));
    --md-sys-color-on-error: var(--TWPT-md-sys-color-on-error, rgb(255 255 255));
    --md-sys-color-error-container: var(--TWPT-md-sys-color-error-container, rgb(255 218 214));
    --md-sys-color-on-error-container: var(--TWPT-md-sys-color-on-error-container, rgb(65 0 2));
    --md-sys-color-background: var(--TWPT-md-sys-color-background, rgb(244 251 248));
    --md-sys-color-on-background: var(--TWPT-md-sys-color-on-background, rgb(22 29 28));
    --md-sys-color-surface: var(--TWPT-md-sys-color-surface, rgb(244 251 248));
    --md-sys-color-on-surface: var(--TWPT-md-sys-color-on-surface, rgb(22 29 28));
    --md-sys-color-surface-variant: var(--TWPT-md-sys-color-surface-variant, rgb(218 229 225));
    --md-sys-color-on-surface-variant: var(--TWPT-md-sys-color-on-surface-variant, rgb(63 73 71));
    --md-sys-color-outline: var(--TWPT-md-sys-color-outline, rgb(111 121 119));
    --md-sys-color-outline-variant: var(--TWPT-md-sys-color-outline-variant, rgb(190 201 198));
    --md-sys-color-shadow: var(--TWPT-md-sys-color-shadow, rgb(0 0 0));
    --md-sys-color-scrim: var(--TWPT-md-sys-color-scrim, rgb(0 0 0));
    --md-sys-color-inverse-surface: var(--TWPT-md-sys-color-inverse-surface, rgb(43 50 48));
    --md-sys-color-inverse-on-surface: var(--TWPT-md-sys-color-inverse-on-surface, rgb(236 242 239));
    --md-sys-color-inverse-primary: var(--TWPT-md-sys-color-inverse-primary, rgb(130 213 200));
    --md-sys-color-primary-fixed: var(--TWPT-md-sys-color-primary-fixed, rgb(158 242 228));
    --md-sys-color-on-primary-fixed: var(--TWPT-md-sys-color-on-primary-fixed, rgb(0 32 28));
    --md-sys-color-primary-fixed-dim: var(--TWPT-md-sys-color-primary-fixed-dim, rgb(130 213 200));
    --md-sys-color-on-primary-fixed-variant: var(--TWPT-md-sys-color-on-primary-fixed-variant, rgb(0 80 72));
    --md-sys-color-secondary-fixed: var(--TWPT-md-sys-color-secondary-fixed, rgb(204 232 226));
    --md-sys-color-on-secondary-fixed: var(--TWPT-md-sys-color-on-secondary-fixed, rgb(5 32 28));
    --md-sys-color-secondary-fixed-dim: var(--TWPT-md-sys-color-secondary-fixed-dim, rgb(177 204 198));
    --md-sys-color-on-secondary-fixed-variant: var(--TWPT-md-sys-color-on-secondary-fixed-variant, rgb(51 75 71));
    --md-sys-color-tertiary-fixed: var(--TWPT-md-sys-color-tertiary-fixed, rgb(204 229 255));
    --md-sys-color-on-tertiary-fixed: var(--TWPT-md-sys-color-on-tertiary-fixed, rgb(0 30 49));
    --md-sys-color-tertiary-fixed-dim: var(--TWPT-md-sys-color-tertiary-fixed-dim, rgb(173 202 230));
    --md-sys-color-on-tertiary-fixed-variant: var(--TWPT-md-sys-color-on-tertiary-fixed-variant, rgb(45 73 97));
    --md-sys-color-surface-dim: var(--TWPT-md-sys-color-surface-dim, rgb(213 219 217));
    --md-sys-color-surface-bright: var(--TWPT-md-sys-color-surface-bright, rgb(244 251 248));
    --md-sys-color-surface-container-lowest: var(--TWPT-md-sys-color-surface-container-lowest, rgb(255 255 255));
    --md-sys-color-surface-container-low: var(--TWPT-md-sys-color-surface-container-low, rgb(239 245 242));
    --md-sys-color-surface-container: var(--TWPT-md-sys-color-surface-container, rgb(233 239 237));
    --md-sys-color-surface-container-high: var(--TWPT-md-sys-color-surface-container-high, rgb(227 234 231));
    --md-sys-color-surface-container-highest: var(--TWPT-md-sys-color-surface-container-highest, rgb(221 228 225));

    /* Custom colors */
    --reply-button-color: var(--TWPT-reply-button-color, #65558f);

    /* Material Design 2 theme */
    --mdc-theme-surface: var(--TWPT-primary-background, #fff);
    --mdc-theme-on-surface: var(--TWPT-primary-text, #000);
    --mdc-theme-primary: var(--TWPT-md-sys-color-primary, rgb(0 106 96));
    --mdc-theme-on-primary: var(--TWPT-md-sys-color-on-primary, rgb(255 255 255));
    --mdc-dialog-heading-ink-color: var(--TWPT-primary-text);
  }

  md-icon[filled] {
    font-variation-settings: 'FILL' 1;
  }
`;
