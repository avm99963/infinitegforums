import { MDCTooltip } from '@material/tooltip';

import { createPlainTooltip } from '../../../../common/tooltip.js';
import { createExtBadge } from '../../../../contentScripts/communityConsole/utils/common.js';

export const kColorThemeMode = Object.freeze({
  Auto: Symbol('auto'),
  Light: Symbol('light'),
  Dark: Symbol('dark'),
});

export function injectDarkThemeButton(rightControl) {
  var darkThemeSwitch = document.createElement('material-button');
  darkThemeSwitch.classList.add('TWPT-dark-theme', 'TWPT-btn--with-badge');
  darkThemeSwitch.setAttribute('button', '');

  darkThemeSwitch.addEventListener('click', () => {
    chrome.storage.sync.get(null, (currentOptions) => {
      currentOptions.ccdarktheme_switch_status =
        !currentOptions.ccdarktheme_switch_status;
      chrome.storage.sync.set(currentOptions);
    });
  });

  var switchContent = document.createElement('div');
  switchContent.classList.add('content');

  var icon = document.createElement('material-icon');

  var i = document.createElement('i');
  i.classList.add('material-icon-i', 'material-icons-extended');
  i.textContent = 'brightness_4';

  icon.appendChild(i);
  switchContent.appendChild(icon);
  darkThemeSwitch.appendChild(switchContent);

  let badgeContent, badgeTooltip;
  [badgeContent, badgeTooltip] = createExtBadge();

  darkThemeSwitch.appendChild(badgeContent);

  rightControl.style.width =
    parseInt(window.getComputedStyle(rightControl).width) + 58 + 'px';
  rightControl.insertAdjacentElement('afterbegin', darkThemeSwitch);

  createPlainTooltip(
    switchContent,
    chrome.i18n.getMessage('inject_ccdarktheme_helper'),
  );
  new MDCTooltip(badgeTooltip);
}

export function getCurrentColorTheme(options) {
  if (!options.ccdarktheme) {
    return kColorThemeMode.Light;
  } else {
    if (options.ccdarktheme_mode == 'switch') {
      return options.ccdarktheme_switch_status
        ? kColorThemeMode.Dark
        : kColorThemeMode.Light;
    } else {
      return kColorThemeMode.Auto;
    }
  }
}

export function isDarkThemeOn(options) {
  const activeColorTheme = getCurrentColorTheme(options);

  switch (activeColorTheme) {
    case kColorThemeMode.Auto:
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );

    case kColorThemeMode.Light:
      return false;

    case kColorThemeMode.Dark:
      return true;
  }
}
