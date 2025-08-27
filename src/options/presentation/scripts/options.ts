import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { featureCategories } from '../featureCategories';
import '../components/App';

const container = document.getElementById('container');
const app = document.createElement('options-app');
app.optionsProvider = new OptionsProviderAdapter();
app.optionsModifier = new OptionsModifierAdapter();
app.featureCategories = featureCategories;
container.append(app);
