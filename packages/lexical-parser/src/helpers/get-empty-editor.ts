import { MentionNode } from '@/plugins/mention-node';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { type LexicalEditor, createEditor } from 'lexical';

/**
 * Creates and returns an empty LexicalEditor instance.
 *
 * @returns An empty LexicalEditor instance with no nodes and a default namespace of 'Editor'.
 */
export const getEmptyEditor = (): LexicalEditor => {
  const state = createEditor({
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
      MentionNode,
    ],
  });

  return state;
};
