import { $createTextNode, $getRoot, ElementNode, type LexicalEditor, type LexicalNode } from 'lexical';

export interface MentionReplacement {
  [key: string]: string;
}

/**
 * Populates mention nodes within the Lexical editor with their corresponding replacements.
 *
 * This function traverses the editor's root node and replaces any mention nodes with the
 * corresponding text from the mentions replacement map.
 *
 * @param editor - The LexicalEditor instance to update.
 * @param mentions - An object mapping mention keys to their replacement text.
 * @returns A promise that resolves with the updated LexicalEditor instance.
 */
export const populateMentionNodes = async (editor: LexicalEditor, mentions: MentionReplacement): Promise<LexicalEditor> => {
  return new Promise((resolve) => {
    editor.update(() => {
      const rootNode = $getRoot();

      const traverseNode = (node: LexicalNode): void => {
        if (node.getType() === 'mention') {
          const lookupKey = node.getTextContent().trim();
          const replacement = mentions[lookupKey];

          if (replacement) {
            const textNode = $createTextNode(replacement);
            node.replace(textNode);
          }
        } else if (node instanceof ElementNode) {
          for (const child of node.getChildren()) {
            traverseNode(child);
          }
        }
      };

      for (const childNode of rootNode.getChildren()) {
        traverseNode(childNode);
      }

      resolve(editor);
    });
  });
};
