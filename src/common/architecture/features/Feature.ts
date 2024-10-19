import { OptionCodename } from '../../options/optionsPrototype';
import Script, { ConcreteScript } from '../scripts/Script';

/**
 * @deprecated
 */
export default abstract class Feature {
  /**
   * Internal codename used for the feature.
   *
   * It will be used for i18n translations, shown in log messages, etc.
   */
  abstract readonly codename: string;

  /**
   * Options which control the behavior of this feature.
   */
  abstract readonly relatedOptions: OptionCodename[];

  /**
   * Uninitialized scripts which are associated with the feature.
   */
  abstract readonly scripts: ConcreteScript[];

  private initializedScripts: Script[];

  public getScripts() {
    if (this.initializedScripts === undefined) {
      this.initializedScripts = this.scripts.map((script) => new script());
    }
    return this.initializedScripts;
  }
}
