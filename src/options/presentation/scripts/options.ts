import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import OptionsProviderAdapter from '../../../infrastructure/services/options/OptionsProvider.adapter';
import { getFeatureCategories } from '../data/featureCategories';
import '../../ui/components/App';
import { isProdVersion } from '../../../common/extUtils';
import { OptionsConfigurationRepositoryAdapter } from '../../infrastructure/repositories/OptionsConfiguration.repository.adapter';
import { getSyncStorageAreaRepository } from '@/storage/compositionRoot';
import { DefaultOptionsCommitterAdapter } from '@/options/infrastructure/services/DefaultOptionsCommitter.service.adapter';

function main() {
  const container = document.getElementById('container');
  const app = document.createElement('options-app');

  const syncStorageAreaRepository = getSyncStorageAreaRepository();
  const optionsProvider = new OptionsProviderAdapter(
    new OptionsConfigurationRepositoryAdapter(syncStorageAreaRepository),
  );
  const optionsModifier = new OptionsModifierAdapter(syncStorageAreaRepository);

  // When the user visits the options page, attempt to commit default options.
  // This is something the old options page did, and we're keeping the same
  // behavior with the new one.
  //
  // The rationale is that if a user visits the options page, we must make sure
  // that the options the user sees don't change in the future if the default
  // option changes in |optionsPrototype|.
  const defaultOptionsCommitter = new DefaultOptionsCommitterAdapter(
    optionsProvider,
    optionsModifier,
  );
  defaultOptionsCommitter.commit();

  app.optionsProvider = optionsProvider;
  app.optionsModifier = optionsModifier;
  app.getFeatureCategories = getFeatureCategories;
  app.isProdVersion = isProdVersion();
  container.append(app);
}

main();
