import { getEmptyEditor } from '@/helpers/get-empty-editor';
import { parseJsonEditorStateToEditor } from '@/helpers/parse-editor-state-json-to-editor';
import type { LexicalEditor, SerializedEditorState, SerializedLexicalNode } from 'lexical';

// Define specific node types with required properties
interface SerializedRootNode extends SerializedLexicalNode {
  children: (SerializedParagraphNode | SerializedLexicalNode)[];
  type: 'root';
}

interface SerializedParagraphNode extends SerializedLexicalNode {
  children: { text: string; type: 'text'; version: number }[];
  type: 'paragraph';
}

// Mock the getEmptyEditor function
jest.mock('@/helpers/get-empty-editor', () => ({
  getEmptyEditor: jest.fn(),
}));

describe('parseJsonEditorStateToEditor', () => {
  it('should parse a JSON editor state and return a LexicalEditor instance with the updated state', () => {
    // Mock SerializedEditorState input with all required properties
    const mockEditorState: SerializedEditorState<SerializedRootNode> = {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [{ text: 'Hello world', type: 'text', version: 1 }],
          },
        ],
      },
    } as any;

    // Mock methods on LexicalEditor
    const mockParsedState = { root: { type: 'parsed-root' } }; // Example parsed state
    const mockEditor = {
      parseEditorState: jest.fn().mockReturnValue(mockParsedState),
      setEditorState: jest.fn(),
    } as unknown as LexicalEditor;

    // Mock getEmptyEditor to return the mocked editor
    (getEmptyEditor as jest.Mock).mockReturnValue(mockEditor);

    // Call the function
    const result = parseJsonEditorStateToEditor(mockEditorState);

    // Assertions
    expect(getEmptyEditor).toHaveBeenCalled();
    expect(mockEditor.parseEditorState).toHaveBeenCalledWith(mockEditorState);
    expect(mockEditor.setEditorState).toHaveBeenCalledWith(mockParsedState);
    expect(result).toBe(mockEditor);
  });
});
