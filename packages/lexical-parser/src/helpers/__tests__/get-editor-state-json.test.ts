import { getEditorStateJson } from '@/helpers/get-editor-state-json';
import type { LexicalEditor } from 'lexical';

describe('getEditorStateJson', () => {
  it('should return the serialized editor state as JSON', () => {
    // Mock SerializedEditorState return value
    const mockSerializedEditorState = {
      root: {
        children: [],
        type: 'root',
      },
    };

    // Mock the methods of LexicalEditor
    const mockEditorState = {
      toJSON: jest.fn().mockReturnValue(mockSerializedEditorState),
    };

    const mockEditor = {
      getEditorState: jest.fn().mockReturnValue(mockEditorState),
    } as unknown as LexicalEditor;

    // Execute function
    const result = getEditorStateJson(mockEditor);

    // Assertions
    expect(mockEditor.getEditorState).toHaveBeenCalled();
    expect(mockEditorState.toJSON).toHaveBeenCalled();
    expect(result).toEqual(mockSerializedEditorState);
  });
});
