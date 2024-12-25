import { $generateHtmlFromNodes } from '@lexical/html';
import type { LexicalEditor } from 'lexical';

/**
 * Converts the content of a LexicalEditor instance to an HTML string.
 * This function is intended for use in client components for Next.js.
 *
 * @param editor - The LexicalEditor instance containing the content to be converted.
 * @returns A promise that resolves to a string containing the HTML representation of the editor's content.
 */
export const parseEditorToHtmlClient = (editor: LexicalEditor): Promise<string> => {
  return new Promise<string>((resolve) => {
    editor.update(() => {
      resolve($generateHtmlFromNodes(editor, null));
    });
  });
};
