import { OptionCodename } from '@/common/options/optionsPrototype';
import { OptionsProviderPort } from '@/services/options/OptionsProvider.js';

/** List of features controled in the background. */
const bgFeatures: OptionCodename[] = ['blockdrafts'];

const blockDraftsRuleset = 'blockDrafts';

/**
 * Class to handle from the background script option changes.
 *
 * Most options are dynamic, which means whenever they are enabled or disabled,
 * the effect is immediate. However, some features aren't controlled directly in
 * content scripts or injected scripts but instead in the background
 * script/service worker.
 *
 * An example is the "blockdrafts" feature, which when enabled should enable the
 * static ruleset blocking *DraftMessages requests.
 */
export class BgHandler {
  constructor(private readonly optionsProvider: OptionsProviderPort) {}

  async handlePossibleOptionsChange() {
    await Promise.all(
      bgFeatures.map((codename) => this.handlePossibleOptionChange(codename)),
    );
  }

  private async handlePossibleOptionChange(codename: OptionCodename) {
    switch (codename) {
      // #!if defined(MV3)
      case 'blockdrafts':
        const isFeatureEnabled = await this.optionsProvider.isEnabled(codename);
        chrome.declarativeNetRequest.getEnabledRulesets((rulesets) => {
          if (rulesets === undefined) {
            throw new Error(
              chrome.runtime.lastError.message ??
                'Unknown error in chrome.declarativeNetRequest.getEnabledRulesets()',
            );
          }

          let isRulesetEnabled = rulesets.includes(blockDraftsRuleset);
          if (!isRulesetEnabled && isFeatureEnabled)
            chrome.declarativeNetRequest.updateEnabledRulesets({
              enableRulesetIds: [blockDraftsRuleset],
            });
          if (isRulesetEnabled && !isFeatureEnabled)
            chrome.declarativeNetRequest.updateEnabledRulesets({
              disableRulesetIds: [blockDraftsRuleset],
            });
        });
        break;
      // #!endif
    }
  }
}
