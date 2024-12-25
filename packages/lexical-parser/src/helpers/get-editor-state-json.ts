import type { LexicalEditor, SerializedEditorState, SerializedLexicalNode } from 'lexical';

/**
 * Creates and returns an empty LexicalEditor instance.
 *
 * @returns An empty LexicalEditor instance with no nodes and a default namespace of 'Editor'.
 */
export const getEditorStateJson = (editor: LexicalEditor): SerializedEditorState<SerializedLexicalNode> => {
  return editor.getEditorState().toJSON();
};
