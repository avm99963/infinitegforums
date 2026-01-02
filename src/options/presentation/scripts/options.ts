import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { getFeatureCategories } from '../data/featureCategories';
import '../../ui/components/App';
import { isProdVersion } from '../../../common/extUtils';
import { OptionsConfigurationRepositoryAdapter } from '../../infrastructure/repositories/OptionsConfiguration.repository.adapter';
import { getSyncStorageAreaRepository } from '@/storage/compositionRoot';

function main() {
  const container = document.getElementById('container');
  const app = document.createElement('options-app');
  const syncStorageAreaRepository = getSyncStorageAreaRepository();
  app.optionsProvider = new OptionsProviderAdapter(
    new OptionsConfigurationRepositoryAdapter(syncStorageAreaRepository),
  );
  app.optionsModifier = new OptionsModifierAdapter(syncStorageAreaRepository);
  app.getFeatureCategories = getFeatureCategories;
  app.isProdVersion = isProdVersion();
  container.append(app);
}

main();
