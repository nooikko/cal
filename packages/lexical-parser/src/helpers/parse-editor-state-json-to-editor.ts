import type { LexicalEditor, SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { getEmptyEditor } from './get-empty-editor';

/**
 * Parses a JSON string representing the editor state and returns a LexicalEditor instance.
 *
 * @param editorState - A JSON string representing the state of the editor.
 * @returns A LexicalEditor instance with the parsed state.
 */
export const parseJsonEditorStateToEditor = (editorState: SerializedEditorState<SerializedLexicalNode>): LexicalEditor => {
  const emptyEditor = getEmptyEditor();

  const parsedState = emptyEditor.parseEditorState(editorState);
  emptyEditor.setEditorState(parsedState);

  return emptyEditor;
};
