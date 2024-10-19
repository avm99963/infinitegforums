import { describe, expect, it } from "@jest/globals";
import { FakeScript } from "../../../common/architecture/scripts/FakeScript";
import { SortedScriptsProviderAdapter } from "./SortedScriptsProvider.adapter";
import ScriptSorterAdapter from "./ScriptSorter.adapter";

describe('SortedScriptsProvider', () => {
  describe('getScripts', () => {
    it('should not throw', () => {
      class A extends FakeScript {}
      const scripts = [new A()];

      const sut = new SortedScriptsProviderAdapter(scripts, new ScriptSorterAdapter());

      expect(() => sut.getScripts()).not.toThrow();
    });
  });
});
