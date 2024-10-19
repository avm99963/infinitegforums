import Script from '../../../common/architecture/scripts/Script';

export default class ScriptRunner {
  constructor(private scripts: Script[]) {}

  run() {
    for (const script of this.scripts) {
      script.execute();
    }
  }
}
