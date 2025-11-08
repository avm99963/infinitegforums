import { customElement, property, state } from 'lit/decorators.js';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider';
import { OptionsModifierPort } from '../../../services/options/OptionsModifier.port';
import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import './CategoriesSelector';
import './DogfoodBanner';
import './FeatureCategory';
import './KillSwitchEnabledBanner';
import './NavDrawer';
import './TopAppBar';
import '../styles/styles.scss';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import { makeAbortable, PromiseAbortError } from '../../../common/architecture/abortable';
import { OptionChangedEvent } from '../events/events';
import { optionCodenames } from '../../../common/options/optionsPrototype';
import { FeatureCategory } from '../models/category';
import type { NavDrawer } from './NavDrawer';
import type { TopAppBar } from './TopAppBar';
import type { CategoriesSelector } from './CategoriesSelector';
import { SKIP_TO_MAIN_EVENT } from './consts';

@customElement('options-app')
export default class OptionsApp extends LitElement {
  @property({ type: Object })
  accessor optionsProvider: OptionsProviderPort | undefined;

  @property({ type: Object })
  accessor optionsModifier: OptionsModifierPort | undefined;

  @property({ type: Array })
  accessor getFeatureCategories: () => FeatureCategory[] | undefined;

  /** Whether we're running a production release of the extension. */
  @property({ type: Boolean })
  accessor isProdVersion: boolean;

  @state()
  accessor optionsConfiguration: OptionsConfiguration | undefined;

  @state()
  accessor isDrawerOpen = false;

  @state()
  accessor selectedCategoryId: string | undefined;

  private featureCategories: FeatureCategory[] | undefined;

  private configurationReqAbortController: AbortController | undefined;

  static styles = [
    css`
      :host {
        --top-app-bar-height: calc(48px + 2 * 12px);

        display: block;
        color: var(--md-sys-color-on-surface);
        background-color: var(--md-sys-color-surface-container);
      }

      main {
        display: flex;
        padding: 16px 0;
        margin: auto;
        min-width: 300px;
        max-width: min(512px, calc(100% - 2 * 16px));
        flex-direction: column;
        gap: 8px;
      }
    `,
  ];

  firstUpdated() {
    document.body.addEventListener(
      SKIP_TO_MAIN_EVENT,
      this.focusMainContent.bind(this),
    );
  }

  focusMainContent() {
    this.shadowRoot.getElementById('main-content')?.focus();
    (
      this.shadowRoot.querySelector('nav-drawer') as NavDrawer
    )?.scrollAppContentToTop();
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('optionsProvider') &&
      this.optionsProvider !== undefined
    ) {
      this.setUpOptionsProvider();
    }

    this.featureCategories = this.getFeatureCategories();
  }

  private setUpOptionsProvider() {
    // TODO: If we keep changing the optionsProvider, we should remove the
    // previous listener in the previous provider. We don't currently handle
    // this case since we don't change the optionsProvider.
    this.optionsProvider.addListener((_, newConfiguration) =>
      this.onProviderChangedOptions(newConfiguration),
    );
    this.loadConfiguration();
  }

  private onProviderChangedOptions(newConfiguration: OptionsConfiguration) {
    this.abortConfigurationRequest();
    this.optionsConfiguration = newConfiguration;
  }

  private async loadConfiguration() {
    this.abortConfigurationRequest();
    this.configurationReqAbortController = new AbortController();
    const signal = this.configurationReqAbortController.signal;
    const abortableGetOptionsConfiguration = makeAbortable(
      this.optionsProvider.getOptionsConfiguration.bind(this.optionsProvider),
    );
    try {
      // If the call is aborted, it will throw PromiseAbortError and the
      // assignment will not be made.
      this.optionsConfiguration = await abortableGetOptionsConfiguration({
        signal,
      });
    } catch (error: unknown) {
      if (error instanceof PromiseAbortError) {
        console.debug(
          'Ignoring aborted request to load the current configuration.',
        );
      } else {
        throw error;
      }
    }
  }

  private abortConfigurationRequest() {
    if (this.configurationReqAbortController !== undefined) {
      this.configurationReqAbortController.abort();
      this.configurationReqAbortController = undefined;
    }
  }

  render() {
    return html`
      <nav-drawer
        ?isOpen=${this.isDrawerOpen}
        @change=${this.onNavDrawerChange}
      >
        <top-app-bar
          slot="top-app-bar"
          ?isDrawerOpen=${this.isDrawerOpen}
          showExperimentsLink=${!this.isProdVersion}
          @change=${this.onTopAppBarChange}
        ></top-app-bar>
        <main id="main-content" slot="app-content" tabindex="-1">
          <dogfood-banner></dogfood-banner>
          ${this.maybeRenderKillSwitchEnabledBanner()}
          ${this.renderFeatureCategory()}
        </main>
        <categories-selector
          selectedCategoryId=${this.getCurrentCategoryId()}
          .featureCategories=${this.featureCategories}
          @change=${this.onCategoriesSelectorChange}
        ></categories-selector>
      </nav-drawer>
    `;
  }

  private maybeRenderKillSwitchEnabledBanner() {
    if (!this.isSomeKillSwitchEnabled()) {
      return nothing;
    }

    return html`
      <kill-switch-enabled-banner></kill-switch-enabled-banner>
    `;
  }

  private renderFeatureCategory() {
    const category = this.getCurrentCategory();
    if (category === undefined) {
      return nothing;
    }

    return html`
      <feature-category-content
        .category=${category}
        .optionsConfiguration=${this.optionsConfiguration}
        @change=${this.onOptionChangedByUser}
      ></feature-category-content>
    `;
  }

  private getCurrentCategory(): FeatureCategory | undefined {
    const currentCategoryId = this.getCurrentCategoryId();
    return this.featureCategories?.find((c) => c.id === currentCategoryId);
  }

  private getCurrentCategoryId(): string | undefined {
    return this.selectedCategoryId ?? this.featureCategories?.[0]?.id;
  }

  private isSomeKillSwitchEnabled() {
    return optionCodenames.some((codename) =>
      this.optionsConfiguration?.isKillSwitchEnabled(codename),
    );
  }

  private onOptionChangedByUser(e: OptionChangedEvent) {
    if (this.optionsModifier === undefined) {
      console.error(
        "The options can't be saved because an optionsModifier instance was not supplied.",
      );
      return;
    }
    this.optionsModifier.set(e.detail.option, e.detail.value);
  }

  private onNavDrawerChange(e: Event) {
    this.isDrawerOpen = (e.target as NavDrawer).isOpen ?? false;
  }

  private onTopAppBarChange(e: Event) {
    this.isDrawerOpen = (e.target as TopAppBar).isDrawerOpen ?? false;
  }

  private onCategoriesSelectorChange(e: Event) {
    this.selectedCategoryId = (
      e.target as CategoriesSelector
    ).selectedCategoryId;
    this.isDrawerOpen = false;
    this.focusMainContent();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'options-app': OptionsApp;
  }
}
