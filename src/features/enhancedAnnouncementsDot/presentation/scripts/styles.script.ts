import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class EnhancedAnnouncementsDotStylesScript extends StylesheetScript {
  stylesheet = 'css/enhanced_announcements_dot.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return await this.optionsProvider.isEnabled('enhancedannouncementsdot');
  }
}
