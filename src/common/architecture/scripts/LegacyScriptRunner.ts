import Script from './Script';

export default class LegacyScriptRunner {
  private scripts: Script[] = [];

  add(...scripts: Script[]) {
    this.scripts.push(...scripts);
  }

  run() {
    this.scripts.sort((a, b) => {
      if (a.priority < b.priority) return -1;
      if (a.priority > b.priority) return 1;
      return 0;
    });
    for (const script of this.scripts) {
      script.execute();
    }
  }
}
