import { css } from 'lit';

export const FORM_STYLES = css`
  .fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;

    & > md-outlined-select {
      width: 100%;
    }
  }

  /**
   * This styles selects with the Community Console density.
   * It is needed since some of the bulk move selects (forum, language)
   * have a lot of options.
   */
  md-outlined-select {
    --md-outlined-field-top-space: 12px;
    --md-outlined-field-bottom-space: 12px;
  }

  md-outlined-select::part(menu) {
    --md-menu-item-one-line-container-height: 32px;
    --md-menu-item-top-space: 8px;
    --md-menu-item-bottom-space: 8px;
  }
`;
