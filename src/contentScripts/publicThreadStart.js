import {getOptions} from '../common/options/optionsUtils.js';
import {setUpRedirectIfEnabled} from '../redirect/setup.js';

getOptions(['redirect']).then(options => {
  setUpRedirectIfEnabled(options);
});
