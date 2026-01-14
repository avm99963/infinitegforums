import { UncompiledTemplateResult } from 'lit';
import TurndownService from 'turndown';

const LIT_TYPE_HTML_RESULT = 1;

class TurndownServiceSingleton {
  private instance: TurndownService | undefined;

  getInstance() {
    if (this.instance === undefined) {
      this.instance = new TurndownService({
        bulletListMarker: '-',
      }).addRule('kbd', {
        filter: ['kbd'],
        replacement: (content) => '`' + content + '`',
      });
    }

    return this.instance;
  }
}

const turndownServiceSingleton = new TurndownServiceSingleton();

export function convertPossibleTemplateToString(
  val: string | UncompiledTemplateResult,
): string {
  if (typeof val === 'string') {
    return val;
  } else {
    return convertTemplateToString(val);
  }
}

// Hacky way to convert a template to a string.
//
// If this doesn't work in the future, we can consider moving to the solution
// posed at https://github.com/lit/lit/discussions/4392. But we've decided to do
// this for the time being to prevent adding more dependencies.
function convertTemplateToString(template: UncompiledTemplateResult) {
  if (template._$litType$ !== LIT_TYPE_HTML_RESULT) {
    throw new Error('Template is not of type HTML_RESULT (1).');
  }

  const result: string[] = [];
  let i = 0;
  while (i < template.strings.length || i < template.values.length) {
    if (i < template.strings.length) {
      result.push(template.strings[i]);
    }
    if (i < template.values.length) {
      result.push(convertValueToString(template.values[i]));
    }
    i++;
  }
  const html = result.join('');
  const turndownService = turndownServiceSingleton.getInstance();
  return turndownService.turndown(html);
}

function convertValueToString(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  } else if (isTemplateResult(value)) {
    return convertTemplateToString(value);
  } else {
    return value.toString();
  }
}

function isTemplateResult(val: unknown): val is UncompiledTemplateResult {
  return typeof val === 'object' && val !== null && '_$litType$' in val;
}
