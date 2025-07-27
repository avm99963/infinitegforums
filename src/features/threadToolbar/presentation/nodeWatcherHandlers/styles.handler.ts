import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class ThreadToolbarStylesScript extends StylesheetScript {
  stylesheet = 'css/thread_toolbar.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return true;
  }
}
