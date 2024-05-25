import DependenciesProviderSingleton, {
  OptionsProviderDependency,
  ReportDialogColorThemeFixDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import NodeWatcherScript from '../../../common/architecture/scripts/nodeWatcher/NodeWatcherScript';
import OptionsProvider from '../../../common/options/OptionsProvider';
import ReportDialogColorThemeFix from '../core/logic/reportDialog';
import CCDarkThemeEcAppHandler from '../nodeWatcherHandlers/ecApp.handler';
import CCDarkThemeReportDialogHandler from '../nodeWatcherHandlers/reportDialog.handler';
import CCDarkThemeUnifiedProfilesIframeHandler from '../nodeWatcherHandlers/unifiedProfilesIframe.handler';

export interface CCDarkThemeNodeWatcherDependencies {
  reportDialogColorThemeFix: ReportDialogColorThemeFix;
  optionsProvider: OptionsProvider;
}

export default class CCDarkThemeNodeWatcherScript extends NodeWatcherScript<CCDarkThemeNodeWatcherDependencies> {
  public page = ScriptPage.CommunityConsole;
  public environment = ScriptEnvironment.ContentScript;
  public runPhase = ScriptRunPhase.Main;
  public handlers = new Map([
    ['cc-dark-theme-ec-app', CCDarkThemeEcAppHandler],
    ['cc-dark-theme-report-dialog', CCDarkThemeReportDialogHandler],
    [
      'cc-dark-theme-unified-profiles-iframe',
      CCDarkThemeUnifiedProfilesIframeHandler,
    ],
  ]);

  protected optionsFactory(): CCDarkThemeNodeWatcherDependencies {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    return {
      reportDialogColorThemeFix: dependenciesProvider.getDependency(
        ReportDialogColorThemeFixDependency,
      ),
      optionsProvider: dependenciesProvider.getDependency(
        OptionsProviderDependency,
      ),
    };
  }
}
