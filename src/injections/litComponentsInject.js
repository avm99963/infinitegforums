// This file imports necessary web components used for several features which
// use LitElement (and thus custom web elements). This is done by injecting this
// javascript file instead of placing this code directly in the content script
// because `window.customElements` doesn't exist in content scripts.
import '../features/workflows/core/communityConsole/components/index.js';
import '../contentScripts/communityConsole/threadToolbar/components/index.js';
import '../features/flattenThreads/core/components/index.js';
import '../contentScripts/communityConsole/updateHandler/banner/components/index.js';
import '../features/bulkReportReplies/ui/components/index';

import {injectStylesheet} from '../common/contentScriptsUtils';

// Also, we import Material Symbols Outlined since the Community Console uses
// "Google Material Icons" instead. This is necessary for the MD3 components.
injectStylesheet('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1');
