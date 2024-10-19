import Script, { ConcreteScript } from './Script';

export class FakeScript extends Script {
  runAfter: ConcreteScript[] = [];
  priority: number = 2 ** 31;
  page: never;
  environment: never;
  runPhase: never;

  /* istanbul ignore next */
  execute: () => undefined;
}
