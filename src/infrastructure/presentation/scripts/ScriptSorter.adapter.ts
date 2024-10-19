import Script from '../../../common/architecture/scripts/Script';
import ScriptSorterCycleDetectedError from '../../../presentation/scripts/errors/ScriptSorterCycleDetected.error';
import ScriptSorterRepeatedScriptError from '../../../presentation/scripts/errors/ScriptSorterRepeatedScript.error';
import { ScriptSorterPort } from '../../../presentation/scripts/ScriptSorter.port';

export default class ScriptSorterAdapter implements ScriptSorterPort {
  /**
   * Sorts scripts based on the `runAfter` and `priority` fields.
   *
   * It initially sorts scripts based on the `priority` field, and then looks at
   * script dependencies set in the `runAfter` field. If there are any, it places
   * them before the including script (if they didn't appear before) in the order
   * they appear in the `runAfter` field.
   *
   * Take a look at ScriptSorter.adapter.test.ts for the full spec of how the
   * scripts are sorted.
   */
  sort(scripts: Script[]): Script[] {
    scripts = this.sortByPriority(scripts);

    const childrenMap = this.getChildrenMap(scripts);
    if (hasCycles(childrenMap)) {
      throw new ScriptSorterCycleDetectedError();
    }

    const sortedScripts: Script[] = [];
    for (const script of scripts) {
      this.traverse(script, childrenMap, sortedScripts);
    }
    return sortedScripts;
  }

  private sortByPriority(scripts: Script[]): Script[] {
    return scripts.sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      } else if (a.priority > b.priority) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getChildrenMap(scripts: Script[]): Map<Script, Script[]> {
    const childrenMap = new Map<Script, Script[]>();
    for (const script of scripts) {
      if (childrenMap.has(script)) {
        throw new ScriptSorterRepeatedScriptError();
      }
      childrenMap.set(script, this.getChildren(script, scripts));
    }
    return childrenMap;
  }

  private getChildren(script: Script, scripts: Script[]): Script[] {
    const children: Script[] = [];
    for (const childConstructor of script.runAfter) {
      const runAfterScripts = scripts.filter(
        (it) => it.constructor === childConstructor,
      );
      for (const it of runAfterScripts) {
        if (!children.includes(it)) {
          children.push(it);
        }
      }
    }
    return children;
  }

  private traverse(
    script: Script,
    childrenMap: Map<Script, Script[]>,
    sortedScripts: Script[],
  ) {
    if (sortedScripts.includes(script)) return;

    for (const child of childrenMap.get(script)) {
      this.traverse(child, childrenMap, sortedScripts);
    }
    sortedScripts.push(script);
  }
}

function hasCycles<T>(childrenMap: Map<T, T[]>): boolean {
  const visited = new Set<T>();
  for (const node of childrenMap.keys()) {
    const hasCycles = dfs(node, visited, childrenMap);
    if (hasCycles) return true;
  }

  return false;
}

function dfs<T>(node: T, visited: Set<T>, childrenMap: Map<T, T[]>) {
  if (visited.has(node)) return true;

  visited.add(node);
  for (const child of childrenMap.get(node)) {
    const hasCycles = dfs(child, visited, childrenMap);
    if (hasCycles) return true;
  }
  visited.delete(node);

  return false;
}
