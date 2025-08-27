import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { featureCategories } from '../featureCategories';
import '../components/App';
import { isProdVersion } from '../../../common/extUtils';

const container = document.getElementById('container');
const app = document.createElement('options-app');
app.optionsProvider = new OptionsProviderAdapter();
app.optionsModifier = new OptionsModifierAdapter();
app.featureCategories = featureCategories;
app.isProdVersion = isProdVersion();
container.append(app);
