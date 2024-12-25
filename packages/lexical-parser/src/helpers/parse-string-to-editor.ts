import { $createParagraphNode, $createTextNode, $getRoot, type LexicalEditor } from 'lexical';
import { getEmptyEditor } from './get-empty-editor';

/**
 * Parses a string and inserts it into a LexicalEditor instance.
 * If the input string is empty or only contains whitespace, an empty editor is returned.
 * Otherwise, the string is added as a text node within a paragraph node in the editor.
 *
 * @param entry - The string to be parsed and inserted into the editor.
 * @returns A promise that resolves to a LexicalEditor instance containing the parsed string.
 */
export const parseStringToEditor = async (entry: string): Promise<LexicalEditor> => {
  const editor = getEmptyEditor();
  if (!entry || entry.trim() === '') {
    return editor;
  }

  editor.update(() => {
    const paragraph = $createParagraphNode();
    const textNode = $createTextNode(entry);

    paragraph.append(textNode);

    $getRoot().clear().append(paragraph);
  });

  return editor;
};
