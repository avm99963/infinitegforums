// This file imports necessary web components used for several features which
// use LitElement (and thus custom web elements). This is done by injecting this
// javascript file instead of placing this code directly in the content script
// because `window.customElements` doesn't exist in content scripts.
import '../contentScripts/communityConsole/workflows/components/index.js';
import '../contentScripts/communityConsole/threadToolbar/components/index.js';
import '../contentScripts/communityConsole/flattenThreads/components/index.js';

import {injectStylesheet} from '../common/contentScriptsUtils.js';

// Also, we import Material Icons since the Community Console uses "Google
// Material Icons" instead of "Material Icons". This is necessary for the MD3
// components.
injectStylesheet('https://fonts.googleapis.com/icon?family=Material+Icons');
