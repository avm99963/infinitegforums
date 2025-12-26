import { msg } from '@lit/localize';

/** Localized string for the extension name. */
export const EXTENSION_NAME = () =>
  msg('TW Power Tools', {
    desc: 'The extension name.',
  });

/** Localized string for the common "skip to main content" buttons. */
export const SKIP_TO_MAIN_CONTENT = () =>
  msg('Skip to main content', {
    desc: 'Text for the button that lets users skip directly to the main content in a page.',
  });
