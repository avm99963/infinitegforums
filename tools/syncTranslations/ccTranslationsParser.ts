import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export interface ExtractedDataItem {
  language: string;
  translations: { [key: string]: unknown };
}

interface LanguageCodeLengthConstraints {
  min: number;
  max: number;
}

const PARSER_OPTIONS: parser.ParserOptions = {
  sourceType: 'unambiguous',
  allowReturnOutsideFunction: true,
};

const LANGUAGE_CODE_LENGTH_CONSTRAINTS: LanguageCodeLengthConstraints = {
  min: 2,
  max: 5,
};

const FINGERPRINT_SUBSTRING =
  '"A product expert is already replying to this thread.":';

export function extractDataFromCCCode(code: string): ExtractedDataItem[] {
  console.log('Parsing and traversing AST...');
  try {
    const ast = parser.parse(code, PARSER_OPTIONS);
    const results: ExtractedDataItem[] = [];

    traverse(ast, {
      AssignmentExpression(path) {
        if (isMatchingPrototypeAssignment(path)) {
          const result = processPrototypeAssignmentBlock(path);
          if (result) {
            results.push(result);
          }
        }
      },
    });
    console.log('AST traversal complete.');
    return results;
  } catch (error: unknown) {
    console.error('Failed to parse or traverse the code:', error);
    return [];
  }
}

function isMatchingPrototypeAssignment(
  path: NodePath<t.AssignmentExpression>,
): boolean {
  const node = path.node;

  if (!t.isMemberExpression(node.left) || !t.isObjectExpression(node.right)) {
    return false;
  }

  const leftNode = node.left;
  return (
    t.isIdentifier(leftNode.property) &&
    leftNode.property.name === 'prototype' &&
    t.isMemberExpression(leftNode.object)
  );
}

function processPrototypeAssignmentBlock(
  assignmentPath: NodePath<t.AssignmentExpression>,
): ExtractedDataItem | null {
  let language: string | null = null;
  let jsonString: string | null = null;

  const rightPath = assignmentPath.get('right');
  if (!rightPath.isObjectExpression()) {
    return null;
  }

  rightPath.traverse({
    ObjectMethod(methodPath) {
      if (!language) {
        language = extractLanguageCodeFromMethod(methodPath.node);
      }
      if (!jsonString) {
        jsonString = findFingerprintedJsonStringInMethod(methodPath);
      }
      if (language && jsonString) {
        methodPath.stop();
      }
    },
  });

  if (language && jsonString) {
    try {
      const translations = JSON.parse(jsonString);
      return { language, translations };
    } catch (error) {
      console.error(`Failed to parse JSON for language ${language}:`, error);
      return null;
    }
  }
  return null;
}

function extractLanguageCodeFromMethod(
  methodNode: t.ObjectMethod,
): string | null {
  const bodyStatements = methodNode.body.body;
  if (bodyStatements.length !== 1) return null;

  const returnStatementNode = bodyStatements[0];
  if (!t.isReturnStatement(returnStatementNode)) return null;

  const argument = returnStatementNode.argument;
  if (argument && t.isStringLiteral(argument)) {
    const value: string = argument.value;
    if (
      value.length >= LANGUAGE_CODE_LENGTH_CONSTRAINTS.min &&
      value.length <= LANGUAGE_CODE_LENGTH_CONSTRAINTS.max
    ) {
      return value;
    }
  }
  return null;
}

function findFingerprintedJsonStringInMethod(
  methodPath: NodePath<t.ObjectMethod>,
): string | null {
  let jsonString: string | null = null;

  methodPath.traverse({
    CallExpression(callPath) {
      const callNode = callPath.node;
      if (!t.isMemberExpression(callNode.callee)) return;

      if (callNode.arguments.length > 0) {
        const firstArgument = callNode.arguments[0];
        if (
          t.isStringLiteral(firstArgument) &&
          firstArgument.value.includes(FINGERPRINT_SUBSTRING)
        ) {
          jsonString = firstArgument.value;
          callPath.stop();
        }
      }
    },
  });
  return jsonString;
}
