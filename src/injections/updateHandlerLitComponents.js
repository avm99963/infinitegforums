import '../contentScripts/communityConsole/updateHandler/banner/components/index.js';

import {injectStylesheet} from '../common/contentScriptsUtils.js';

// This is necessary for the MD3 components. It is also done in
// litComponentsInject.js, but when installing the extension
// litComponentsInject.js hasn't been injected yet.
injectStylesheet('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1');
