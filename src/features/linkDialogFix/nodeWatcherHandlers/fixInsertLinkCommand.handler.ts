import CssSelectorNodeWatcherHandler from '../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider';

/**
 * Type that models Tailwind Basic's sc-tailwind-shared-rich-text-editor (only
 * including the relevant properties needed for this handler).
 */
type PartialRichTextEditorElement = HTMLElement & {
  rceComponent: {
    linkDecorator: PartialLinkDecorator;
  };
};

/**
 * Interface that models Tailwind Basic's LinkDecorator class partially.
 */
interface PartialLinkDecorator {
  insertOrUnlink: (...args: unknown[]) => unknown;
}

export default class FixInsertLinkCommandHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'sc-tailwind-shared-rich-text-editor';

  private hasAlreadyRun = false;

  constructor(private optionsProvider: OptionsProviderPort) {
    super();
  }

  async onMutatedNode(mutation: NodeMutation) {
    if (this.hasAlreadyRun) return;

    const isFeatureEnabled =
      await this.optionsProvider.isEnabled('fixlinkdialog');
    if (!isFeatureEnabled) return;

    this.hasAlreadyRun = true;

    this.fixCommand(mutation.node);
  }

  private fixCommand(node: Node) {
    console.debug('[linkDialogFix] Attempting to fix insert link command...');
    if (!this.isPartialRichTextEditorElement(node)) {
      console.error(
        '[linkDialogFix] Rich text editor node does not have the expected form. Actual:',
        node,
      );
      return;
    }

    const linkDecoratorInstance = node.rceComponent.linkDecorator;
    const linkDecoratorPrototype = Object.getPrototypeOf(linkDecoratorInstance);
    if (!this.isPartialLinkDecorator(linkDecoratorPrototype)) {
      console.error(
        "[linkDialogFix] Link decorator's prototype does not have the expected form. Actual:",
        node,
      );
      return;
    }

    const actualInsertOrUnlink = linkDecoratorPrototype.insertOrUnlink;
    linkDecoratorPrototype.insertOrUnlink = function (...args) {
      // Default to true if the structure is not as expected, so the feature
      // continues to work when something has changed and our patch no longer
      // works, even if we won't fix the issue.
      const isFocusingCurrentEditor =
        this.editorState?.content?.contains?.(document.activeElement) ?? true;
      const isFocusingLinkButton =
        document.activeElement.matches('.insertLink');
      if (isFocusingCurrentEditor || isFocusingLinkButton) {
        console.debug('[linkDialogFix] Calling insertOrUnlink.');
        return actualInsertOrUnlink.bind(this)(...args);
      } else {
        console.debug('[linkDialogFix] Preventing call to insertOrUnlink.');
      }
    };
  }

  private isPartialRichTextEditorElement(
    node: any,
  ): node is PartialRichTextEditorElement {
    return (
      node instanceof HTMLElement &&
      this.isPartialLinkDecorator(
        (node as PartialRichTextEditorElement)?.rceComponent?.linkDecorator,
      )
    );
  }

  private isPartialLinkDecorator(value: any): value is PartialLinkDecorator {
    return (
      typeof value === 'object' && typeof value.insertOrUnlink === 'function'
    );
  }
}
