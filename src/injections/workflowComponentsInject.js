// This file imports necessary web components used for the workflows feature.
// This is done by injecting this javascript file instead of placing this code
// directly in the content script because `window.customElements` doesn't exist
// in content scripts.
import '../contentScripts/communityConsole/workflows/components/TwptWorkflowsMenu.js';

import {injectStylesheet} from '../common/contentScriptsUtils.js';

// Also, we import Material Icons since the Community Console uses "Google
// Material Icons" instead of "Material Icons". This is necessary for the MD3
// components.
injectStylesheet('https://fonts.googleapis.com/icon?family=Material+Icons');
