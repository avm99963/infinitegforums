import { customElement, property, state } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { css, html } from 'lit';
import './FeatureCard';
import './KillSwitchEnabledBanner';
import { Feature } from '../models/feature';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import '../styles/styles.scss';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import { FeatureCategory } from '../models/category';
import { FeatureSection } from '../models/section';
import { map } from 'lit/directives/map.js';

@customElement('feature-category-content')
export default class FeatureCategoryContent extends I18nLitElement {
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
      }

      .section-title {
        margin-top: 24px;
        margin-bottom: 16px;
      }

      .features {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `,
  ];

  render() {
    // TODO: Render note.
    return html`
      <h2 class="md-typescale-display-small feature-title">${this.category.name}</h2>
      <div class="features">
        ${this.category?.features?.map((f) => this.renderFeatureCard(f))}
      </div>
      ${map(this.category?.sections ?? [], (s) => this.renderSection(s))}
    `;
  }

  private renderSection(section: FeatureSection) {
    // TODO: Render note.
    return html`
      <h3 class="md-typescale-title-large section-title">${section.name}</h3>
      <div class="features">
        ${map(section.features, (f) => this.renderFeatureCard(f))}
      </div>
    `;
  }

  private renderFeatureCard(feature: Feature) {
    return html`
      <feature-card
        .feature=${feature}
        .optionsConfiguration=${this.optionsConfiguration}
      ></feature-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'feature-category-content': FeatureCategoryContent;
  }
}
