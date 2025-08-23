import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FeatureCategory } from '../models/category';
import { map } from 'lit/directives/map.js';
import { I18nLitElement } from '../../../common/litI18nUtils';

import '@material/web/focus/md-focus-ring.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';

/**
 * Top app bar.
 */
@customElement('categories-selector')
export class CategoriesSelector extends I18nLitElement {
  /**
   * Selected category ID.
   */
  @property({ type: String })
  accessor selectedCategoryId: string | undefined;

  /**
   * List of all feature categories.
   */
  @property({ type: Array })
  accessor featureCategories: FeatureCategory[] | undefined;

  render() {
    return html`
      <md-list
        aria-label="List of feature categories"
        role="menubar"
        class="nav"
      >
        ${map(this.featureCategories, (c) => {
          const isSelected = c.id === this.selectedCategoryId;
          return html`
            <md-list-item
              role="menuitem"
              ?selected=${isSelected}
              type="button"
              tabindex=${isSelected ? 0 : 1}
              @click=${() => this.handleCategoryClicked(c.id)}
            >
              ${c.name}
            </md-list-item>
          `;
        })}
      </md-list>
    `;
  }

  focus() {
    (
      this.shadowRoot.querySelector(
        'md-list.nav md-list-item[tabindex="0"]',
      ) as HTMLElement
    )?.focus();
  }

  private handleCategoryClicked(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.dispatchEvent(new Event('change'));
  }

  static styles = [
    typescaleStyles,
    css`
      md-list {
        --md-list-container-color: transparent;
        display: block;
        margin-inline: 12px;
        min-width: unset;

        md-list-item {
          margin-block: 4px;
          display: block;
          --md-focus-ring-shape: 28px;
          border-radius: 28px;

          &[selected] {
            --md-list-item-label-text-weight: 500;
            background-color: var(--md-sys-color-surface-container-highest);
          }

          &::part(focus-ring) {
            --md-focus-ring-shape: 28px;
          }
        }

        md-item {
          font-size: 1.5rem;
          padding-block-end: 0;

          &:first-of-type {
            padding-block: 0;
          }

          [slot='headline'] {
            /* shadow root slot has overflow:hidden, it's cutting some text off */
            padding-block: 2px;
          }

          & + md-list-item {
            margin-block-start: 0;
          }
        }
      }

      @media (forced-colors: active) {
        md-list md-list-item {
          border-radius: 28px;
          border: 1px solid CanvasText;

          &[selected] {
            border: 4px double CanvasText;
          }
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'categories-selector': CategoriesSelector;
  }
}
