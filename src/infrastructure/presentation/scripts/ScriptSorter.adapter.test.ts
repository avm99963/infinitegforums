import { describe, expect, it } from '@jest/globals';
import { FakeScript } from '../../../common/architecture/scripts/FakeScript';
import ScriptSorterAdapter from './ScriptSorter.adapter';
import Script, {
  ConcreteScript,
} from '../../../common/architecture/scripts/Script';
import ScriptSorterCycleDetectedError from '../../../presentation/scripts/errors/ScriptSorterCycleDetected.error';
import ScriptSorterRepeatedScriptError from '../../../presentation/scripts/errors/ScriptSorterRepeatedScript.error';

describe('ScriptSorterAdapter', () => {
  const checkSort = (scripts: Script[], expectedOrder: ConcreteScript[]) => {
    const sut = new ScriptSorterAdapter();
    const result = sut.sort(scripts);

    expect(result.map((script) => script.constructor)).toEqual(expectedOrder);
  };

  describe('Regarding only script priority', () => {
    it('should sort scripts by priority in ascending order', () => {
      class A extends FakeScript {
        priority = 1;
      }
      class B extends FakeScript {
        priority = 1000;
      }
      class C extends FakeScript {
        priority = 0;
      }
      class D extends FakeScript {
        priority = 2 ** 31;
      }

      const scripts = [new A(), new B(), new C(), new D()];
      const expectedOrder = [C, A, B, D];
      checkSort(scripts, expectedOrder);
    });

    it('should not reorder scripts which have the same priority', () => {
      class A extends FakeScript {
        priority = 1;
        runAfter: ConcreteScript[] = [];
      }
      class B extends FakeScript {
        priority = 10;
        runAfter: ConcreteScript[] = [];
      }
      class C extends FakeScript {
        priority = 1;
        runAfter: ConcreteScript[] = [];
      }

      const scripts = [new A(), new B(), new C()];
      const expectedOrder = [A, C, B];
      checkSort(scripts, expectedOrder);
    });
  });

  describe('Regarding only runAfter', () => {
    it('should place scripts which appear in runAfter before the script which includes them, in the order set in runAfter', () => {
      // Dependency tree (arrows symbolize scripts in `runAfter`):
      // A
      // --> B
      // --> E
      // C
      // D
      // --> F
      //     --> G
      //         --> H
      class A extends FakeScript {
        runAfter = [B, E];
      }
      class B extends FakeScript {}
      class C extends FakeScript {}
      class D extends FakeScript {
        runAfter = [F];
      }
      class E extends FakeScript {}
      class F extends FakeScript {
        runAfter = [G];
      }
      class G extends FakeScript {
        runAfter = [H];
      }
      class H extends FakeScript {}

      const scripts = [
        new A(),
        new B(),
        new C(),
        new D(),
        new E(),
        new F(),
        new G(),
        new H(),
      ];
      const expectedOrder = [B, E, A, C, H, G, F, D];
      checkSort(scripts, expectedOrder);
    });

    it('should not return a script multiple times when it is included in runAfter in multiple scripts', () => {
      // Dependency tree (arrows symbolize scripts in `runAfter`):
      // A
      // --> C
      // B
      // --> C
      class C extends FakeScript {}
      class A extends FakeScript {
        runAfter = [C];
      }
      class B extends FakeScript {
        runAfter = [C];
      }

      const scripts = [new A(), new B(), new C()];
      const expectedOrder = [C, A, B];
      checkSort(scripts, expectedOrder);
    });

    it("should return ScriptSorterCycleDetectedError when there's a cycle", () => {
      // Dependency tree (arrows symbolize scripts in `runAfter`):
      // A
      // --> B
      //     --> A
      //         --> ...
      class A extends FakeScript {
        runAfter = [B];
      }
      class B extends FakeScript {
        runAfter = [A];
      }

      const scripts = [new A(), new B()];

      const sut = new ScriptSorterAdapter();
      expect(() => sut.sort(scripts)).toThrow(ScriptSorterCycleDetectedError);
    });
  });

  describe('Combining priority and runAfter configurations', () => {
    it('should order by priority first and then alter this order when a script needs to run after other scripts which, according to their priority, should have been ran later', () => {
      class A extends FakeScript {
        priority = 1;
        runAfter = [B];
      }
      class B extends FakeScript {
        priority = 2;
      }
      class C extends FakeScript {
        priority = 0;
      }

      const scripts = [new A(), new B(), new C()];
      const expectedOrder = [C, B, A];
      checkSort(scripts, expectedOrder);
    });
  });

  describe('Regarding edge cases', () => {
    it('should not throw an error when there are multiple script instances from the same class', () => {
      class A extends FakeScript {}
      const scripts = [new A(), new A()];

      const sut = new ScriptSorterAdapter();
      expect(() => sut.sort(scripts)).not.toThrow();
    });

    it('should throw an error when a script instance is repeated', () => {
      class A extends FakeScript {}
      const script = new A();
      const scripts = [script, script];

      const sut = new ScriptSorterAdapter();
      expect(() => sut.sort(scripts)).toThrow(ScriptSorterRepeatedScriptError);
    });
  });
});
