import {MDCTooltip} from '@material/tooltip';

import {shouldImplement} from '../../../../common/commonUtils.js';
import {createExtBadge} from '../../utils/common.js';

export default class BaseExtraInfoInjection {
  constructor(infoHandler, optionsWatcher) {
    if (this.constructor == BaseExtraInfoInjection) {
      throw new Error('The base class cannot be instantiated.');
    }

    this.infoHandler = infoHandler;
    this.optionsWatcher = optionsWatcher;
  }

  /**
   * Method which actually injects the extra information. It should be
   * implemented by the extending class.
   */
  inject() {
    shouldImplement('inject');
  }

  async isEnabled() {
    return await this.optionsWatcher.isEnabled('extrainfo');
  }

  /**
   * This is the method which should be called when injecting extra information.
   */
  async injectIfEnabled(injectionDetails) {
    const isEnabled = await this.isEnabled();
    if (!isEnabled) return;

    return this.infoHandler.getCurrentInfo(injectionDetails)
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
    let chip = document.createElement('material-chip');
    chip.classList.add('TWPT-extrainfo-chip');

    let chipContentContainer = document.createElement('div');
    chipContentContainer.classList.add('TWPT-chip-content-container');

    let content = document.createElement('div');
    content.classList.add('TWPT-content');

    const [badge, badgeTooltip] = createExtBadge();

    let span = document.createElement('span');
    span.append(chipContent);

    content.append(badge, span);
    chipContentContainer.append(content);
    chip.append(chipContentContainer);
    container.append(chip);

    return badgeTooltip;
  }
}
