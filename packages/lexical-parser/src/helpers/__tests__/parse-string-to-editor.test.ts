import { getEmptyEditor } from '@/helpers/get-empty-editor';
import { parseStringToEditor } from '@/helpers/parse-string-to-editor';
import { $createParagraphNode, $createTextNode, $getRoot, type LexicalEditor } from 'lexical';

// Mock the Lexical functions
jest.mock('lexical', () => ({
  $createParagraphNode: jest.fn(),
  $createTextNode: jest.fn(),
  $getRoot: jest.fn(),
}));

// Mock the getEmptyEditor function
jest.mock('@/helpers/get-empty-editor', () => ({
  getEmptyEditor: jest.fn(),
}));

describe('parseStringToEditor', () => {
  it('should return an empty editor if the input string is empty or only whitespace', async () => {
    // Mock editor instance
    const mockEditor = {
      update: jest.fn(),
    } as unknown as LexicalEditor;

    // Mock getEmptyEditor to return the mocked editor
    (getEmptyEditor as jest.Mock).mockReturnValue(mockEditor);

    // Call the function with an empty string
    const result = await parseStringToEditor('');

    // Assertions
    expect(getEmptyEditor).toHaveBeenCalled();
    expect(mockEditor.update).not.toHaveBeenCalled();
    expect(result).toBe(mockEditor);
  });

  it('should insert the string into the editor as a paragraph with text', async () => {
    // Mock nodes and root
    const mockParagraphNode = { append: jest.fn() };
    const mockTextNode = {};
    const mockRoot = {
      clear: jest.fn().mockReturnThis(),
      append: jest.fn(),
    };

    ($createParagraphNode as jest.Mock).mockReturnValue(mockParagraphNode);
    ($createTextNode as jest.Mock).mockReturnValue(mockTextNode);
    ($getRoot as jest.Mock).mockReturnValue(mockRoot);

    // Mock editor instance
    const mockEditor = {
      update: jest.fn((callback) => callback()),
    } as unknown as LexicalEditor;

    // Mock getEmptyEditor to return the mocked editor
    (getEmptyEditor as jest.Mock).mockReturnValue(mockEditor);

    // Input string
    const inputString = 'Hello, world!';

    // Call the function with the input string
    const result = await parseStringToEditor(inputString);

    // Assertions
    expect(getEmptyEditor).toHaveBeenCalled();
    expect(mockEditor.update).toHaveBeenCalled();
    expect($createParagraphNode).toHaveBeenCalled();
    expect($createTextNode).toHaveBeenCalledWith(inputString);
    expect($getRoot).toHaveBeenCalled();
    expect(mockParagraphNode.append).toHaveBeenCalledWith(mockTextNode);
    expect(mockRoot.clear).toHaveBeenCalled();
    expect(mockRoot.append).toHaveBeenCalledWith(mockParagraphNode);
    expect(result).toBe(mockEditor);
  });
});
