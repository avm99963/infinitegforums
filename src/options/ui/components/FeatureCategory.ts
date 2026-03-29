import { customElement, property, state } from 'lit/decorators.js';
import { css, html, LitElement, nothing } from 'lit';
import './FeatureCard';
import './HintText';
import './KillSwitchEnabledBanner';
import { Feature } from '../../presentation/models/feature';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import { FeatureCategory } from '../../presentation/models/category';
import { FeatureSection } from '../../presentation/models/section';
import { map } from 'lit/directives/map.js';
import { keyed } from 'lit/directives/keyed.js';

@customElement('feature-category-content')
export default class FeatureCategoryContent extends LitElement {
  @property({ type: Array })
  accessor category: FeatureCategory | undefined;

  @state()
  accessor optionsConfiguration: OptionsConfiguration | undefined;

  static styles = [
    typescaleStyles,
    css`
      .feature-title {
        margin-top: 16px;
        margin-bottom: 22px;

        &.feature-title--with-hint {
          margin-bottom: 16px;
        }
      }

      hint-text.category-hint {
        margin-bottom: 16px;
      }

      .section-title {
        margin-top: 24px;
        margin-bottom: 16px;

        &.section-title--with-hint {
          margin-bottom: 8px;
        }
      }

      hint-text.section-hint {
        margin-bottom: 8px;
      }

      .features {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `,
  ];

  render() {
    const category = this.category;
    if (category === undefined) {
      return nothing;
    }

    const hasNote = category.note !== undefined;
    return html`
      <h2
        class="md-typescale-display-small feature-title ${hasNote
          ? 'feature-title--with-hint'
          : ''}"
      >
        ${category.name}
      </h2>
      ${hasNote
        ? html`
            <hint-text type="note" size="medium" class="category-hint">
              <md-icon slot="icon">info</md-icon>
              ${category.note}
            </hint-text>
          `
        : nothing}
      <div class="features">
        ${category.features?.map((f) => this.renderFeatureCard(f))}
      </div>
      ${map(category.sections ?? [], (s) => this.renderSection(s))}
    `;
  }

  private renderSection(section: FeatureSection) {
    const hasNote = section.note !== undefined;
    return html`
      <h3
        class="md-typescale-title-large section-title ${hasNote
          ? 'section-title--with-hint'
          : ''}"
      >
        ${section.name}
      </h3>
      ${hasNote
        ? html`
            <hint-text type="note" size="medium" class="section-hint">
              <md-icon slot="icon">info</md-icon>
              ${section.note}
            </hint-text>
          `
        : nothing}
      <div class="features">
        ${map(section.features, (f) => this.renderFeatureCard(f))}
      </div>
    `;
  }

  private renderFeatureCard(feature: Feature) {
    return keyed(
      feature.optionCodename,
      html`
        <feature-card
          .feature=${feature}
          .optionsConfiguration=${this.optionsConfiguration}
        ></feature-card>
      `,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-category-content': FeatureCategoryContent;
  }
}
