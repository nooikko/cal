import { getEmptyEditor } from '@/helpers/get-empty-editor';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { createEditor } from 'lexical';

jest.mock('lexical', () => ({
  createEditor: jest.fn(),
  TextNode: class MockTextNode {}, // Mock TextNode dependency for MentionNode
}));

jest.mock('@lexical/code', () => ({
  CodeNode: class MockCodeNode {},
}));

jest.mock('@lexical/link', () => ({
  LinkNode: class MockLinkNode {},
}));

jest.mock('@lexical/list', () => ({
  ListItemNode: class MockListItemNode {},
  ListNode: class MockListNode {},
}));

jest.mock('@lexical/react/LexicalHorizontalRuleNode', () => ({
  HorizontalRuleNode: class MockHorizontalRuleNode {},
}));

jest.mock('@lexical/rich-text', () => ({
  HeadingNode: class MockHeadingNode {},
  QuoteNode: class MockQuoteNode {},
}));

jest.mock('@lexical/table', () => ({
  TableCellNode: class MockTableCellNode {},
  TableNode: class MockTableNode {},
  TableRowNode: class MockTableRowNode {},
}));

jest.mock('@/plugins/mention-node', () => ({
  MentionNode: class MockMentionNode {},
}));

jest.mock('@/plugins/mention-node', () => ({
  MentionNode: class MockMentionNode {}, // Mock MentionNode to avoid dependency issues
}));

describe('getEmptyEditor', () => {
  it('should create a LexicalEditor instance with the correct configuration', () => {
    const mockCreateEditor = jest.fn();
    (createEditor as jest.Mock).mockImplementation(mockCreateEditor);

    getEmptyEditor();

    expect(mockCreateEditor).toHaveBeenCalledWith({
      namespace: 'Editor',
      nodes: [
        CodeNode,
        LinkNode,
        ListItemNode,
        ListNode,
        HorizontalRuleNode,
        HeadingNode,
        QuoteNode,
        TableCellNode,
        TableRowNode,
        TableNode,
        expect.any(Function), // Mocked MentionNode
      ],
    });
  });

  it('should return an instance of LexicalEditor', () => {
    const mockEditorInstance = {};
    (createEditor as jest.Mock).mockReturnValue(mockEditorInstance);

    const editor = getEmptyEditor();

    expect(editor).toBe(mockEditorInstance);
  });
});
