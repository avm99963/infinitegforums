import {createExtBadge} from './utils/common.js';

export function injectDarkModeButton(rightControl, previousDarkModeOption) {
  var darkThemeSwitch = document.createElement('material-button');
  darkThemeSwitch.classList.add('TWPT-dark-theme', 'TWPT-btn--with-badge');
  darkThemeSwitch.setAttribute('button', '');
  darkThemeSwitch.setAttribute(
      'title', chrome.i18n.getMessage('inject_ccdarktheme_helper'));

  darkThemeSwitch.addEventListener('click', e => {
    chrome.storage.sync.get(null, currentOptions => {
      currentOptions.ccdarktheme_switch_status = !previousDarkModeOption;
      chrome.storage.sync.set(currentOptions, _ => {
        location.reload();
      });
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

  var badgeContent = createExtBadge();

  darkThemeSwitch.appendChild(badgeContent);

  rightControl.style.width =
      (parseInt(window.getComputedStyle(rightControl).width) + 58) + 'px';
  rightControl.insertAdjacentElement('afterbegin', darkThemeSwitch);
}

export function isDarkThemeOn(options) {
  if (!options.ccdarktheme) return false;

  if (options.ccdarktheme_mode == 'switch')
    return options.ccdarktheme_switch_status;

  return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
}
