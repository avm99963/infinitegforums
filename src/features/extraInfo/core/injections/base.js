import {MDCTooltip} from '@material/tooltip';

import {shouldImplement} from '../../../../common/commonUtils.js';
import {createExtBadge} from '../../../../contentScripts/communityConsole/utils/common.js';

export default class BaseExtraInfoInjection {
  constructor(infoHandler, optionsProvider) {
    if (this.constructor == BaseExtraInfoInjection) {
      throw new Error('The base class cannot be instantiated.');
    }

    this.infoHandler = infoHandler;
    this.optionsProvider = optionsProvider;
  }

  /**
   * Method which actually injects the extra information. It should be
   * implemented by the extending class.
   *
   * @param {...*}
   */
  inject(..._) {
    shouldImplement('inject');
  }

  /**
   * Overridable method which is called when an error ocurred while retrieving
   * the info needed to inject the extra information. This is useful to show an
   * error component in the screen.
   */
  injectOnInfoRetrievalError() {}

  async isEnabled() {
    return await this.optionsProvider.isEnabled('extrainfo');
  }

  /**
   * This is the method which should be called when injecting extra information.
   */
  async injectIfEnabled(injectionDetails) {
    const isEnabled = await this.isEnabled();
    if (!isEnabled) return;

    return this.infoHandler.getCurrentInfo(injectionDetails)
        .catch(err => {
          this.injectOnInfoRetrievalError();
          throw err;
        })
        .then(info => this.inject(info, injectionDetails))
        .catch(err => {
          console.error(
              `${this.constructor.name}: error while injecting extra info: `,
              err);
        });
  }

  /**
   * Add chips which contain |chipContentList| to |node|. If |withContainer| is
   * set to true, a container will contain all the chips.
   */
  addExtraInfoChips(chipContentList, node, withContainer = false) {
    if (chipContentList.length == 0) return;

    let container;
    if (withContainer) {
      container = document.createElement('div');
      container.classList.add('TWPT-extrainfo-container');
    } else {
      container = node;
    }

    let tooltips = [];

    for (const content of chipContentList) {
      const tooltip = this.addChipToContainer(content, container);
      tooltips.push(tooltip);
    }

    if (withContainer) node.append(container);

    for (const tooltip of tooltips) new MDCTooltip(tooltip);
  }

  /**
   * Adds a chip to the container and returns a tooltip element to be
   * instantiated.
   */
  addChipToContainer(chipContent, container) {
    let chip = document.createElement('div');
    chip.classList.add('TWPT-extrainfo-chip');

    const [badge, badgeTooltip] = createExtBadge();

    let span = document.createElement('span');
    span.append(chipContent);

    chip.append(badge, span);
    container.append(chip);

    return badgeTooltip;
  }
}
