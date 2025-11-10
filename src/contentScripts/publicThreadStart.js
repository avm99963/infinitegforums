import {getOptions} from '../common/options/optionsUtils.js';
import {setUpRedirectIfEnabled} from '../features/redirect/core/setup.js';

getOptions(['redirect']).then(options => {
  setUpRedirectIfEnabled(options);
});
