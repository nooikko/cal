import { type BeautifulMentionComponentProps, BeautifulMentionNode, type SerializedBeautifulMentionNode } from 'lexical-beautiful-mentions';
import { type ElementType, forwardRef } from 'react';

export class CustomMentionNode extends BeautifulMentionNode {
  static getType() {
    return 'custom-beautiful-mention';
  }

  // Clone the node
  static clone(node: CustomMentionNode) {
    return new CustomMentionNode(
      node.__trigger,
      node.__value,
      node.__data,
      node.__key, // Pass the key to maintain consistency
    );
  }

  // Import from serialized JSON
  static importJSON(serializedNode: SerializedBeautifulMentionNode) {
    return new CustomMentionNode(serializedNode.trigger, serializedNode.value, serializedNode.data);
  }

  // Export to JSON for saving
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: CustomMentionNode.getType(),
    };
  }

  // Replace the default mention rendering component
  component(): ElementType<BeautifulMentionComponentProps> | null {
    return CustomMentionComponent;
  }
}

// Custom Mention Component
const CustomMentionComponent = forwardRef<HTMLSpanElement, BeautifulMentionComponentProps>(({ trigger, value, data, children, ...props }, ref) => {
  return (
    <span {...props} ref={ref} className='bg-blue-100 text-blue-700 px-1 rounded' title={`${trigger}${value}`}>
      {children || `${trigger}${value}`}
    </span>
  );
});
