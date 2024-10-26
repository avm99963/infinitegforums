import StylesheetManager from '../../../StylesheetManager';
import { StylesheetAttributes } from '../../../contentScriptsUtils';
import DependenciesProviderSingleton, {
  OptionsProviderDependency,
} from '../../dependenciesProvider/DependenciesProvider';
import Script, { ScriptEnvironment, ScriptRunPhase } from '../Script';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

/**
 * Script which injects a stylesheet depending on a set condition. It
 * dynamically reevaluates the condition when the options configuration changes.
 */
export default abstract class StylesheetScript extends Script {
  readonly environment = ScriptEnvironment.ContentScript;
  readonly runPhase = ScriptRunPhase.Start;

  /**
   * Relative path to the stylesheet from the extension root.
   */
  abstract readonly stylesheet: string;
  /**
   * Attributes to include in the injected <link> element.
   */
  readonly attributes: StylesheetAttributes = {};

  protected optionsProvider: OptionsProviderPort;
  private stylesheetManager: StylesheetManager;

  constructor() {
    super();

    // TODO(https://iavm.xyz/b/226): Retrieve this via constructor injection.
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    this.optionsProvider = dependenciesProvider.getDependency(
      OptionsProviderDependency,
    );
  }

  /**
   * Condition which decides whether the stylesheet should be injected or not.
   *
   * @returns {boolean} Whether the stylesheet should be injected.
   */
  abstract shouldBeInjected(): Promise<boolean>;

  execute() {
    this.stylesheetManager = new StylesheetManager(
      this.stylesheet,
      this.attributes,
    );
    this.optionsProvider.addListener(this.evaluateInjection.bind(this));
    this.evaluateInjection();
  }

  async evaluateInjection() {
    const shouldBeInjected = await this.shouldBeInjected();
    if (!this.stylesheetManager.isInjected() && shouldBeInjected) {
      this.stylesheetManager.inject();
    }
    if (this.stylesheetManager.isInjected() && !shouldBeInjected) {
      this.stylesheetManager.remove();
    }
  }
}
