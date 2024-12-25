import { $getRoot, type LexicalEditor } from 'lexical';

/**
 * Converts the content of a LexicalEditor instance to a string.
 *
 * @param editor - The LexicalEditor instance to parse.
 * @returns The string representation of the editor's content.
 */
export const parseEditorToString = (editor: LexicalEditor): string => {
  return editor.getEditorState().read(() => {
    const root = $getRoot();
    return root.getTextContent();
  });
};
