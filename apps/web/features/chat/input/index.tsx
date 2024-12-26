'use client';

import { type InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $createParagraphNode, $createTextNode, $getRoot, type EditorState } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import theme from './editor-theme';
import { EnterKeyPlugin } from './enter-key-plugin';

/** Props for ChatInput */
interface ChatInputProps {
  placeholder?: string;
  /** Called when the text in the editor changes. */
  onChange?: (textValue: string) => void;
  /** Called when Enter is pressed (without Shift). Typically triggers form submit. */
  onEnter?: () => void;
  /** The *controlled* text value from the parent (e.g. React Hook Form). */
  value?: string;
}

/**
 * This plugin compares the parent `value` with what's
 * currently in the editor to detect an external reset/override.
 */
function ControlledValuePlugin({
  externalValue = '',
  onSetLastSyncedText,
}: {
  externalValue: string;
  onSetLastSyncedText: (val: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    // On first render, we can set the initial text from externalValue
    if (isFirstLoadRef.current && externalValue !== '') {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        const paragraphNode = $createParagraphNode();
        paragraphNode.append($createTextNode(externalValue));
        root.append(paragraphNode);
      });
      onSetLastSyncedText(externalValue);
      isFirstLoadRef.current = false;
      return;
    }
    isFirstLoadRef.current = false;
  }, [externalValue, editor, onSetLastSyncedText]);

  // Example: If you only want to detect resets to "" from externalValue,
  // you can do:
  useEffect(() => {
    if (!isFirstLoadRef.current && externalValue === '') {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
      onSetLastSyncedText('');
    }
  }, [externalValue, editor, onSetLastSyncedText]);

  return null;
}

export const ChatInput: React.FC<PropsWithChildren<ChatInputProps>> = ({
  placeholder = 'Type something...',
  onChange,
  onEnter,
  value = '', // default
  children,
}) => {
  const editorConfig: InitialConfigType = {
    namespace: 'ChatInput',
    theme,
    onError(error: Error) {
      throw error;
    },
    nodes: [],
  };

  const [lastSyncedText, setLastSyncedText] = useState('');

  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        if (textContent !== lastSyncedText) {
          setLastSyncedText(textContent);
          onChange?.(textContent);
        }
      });
    },
    [onChange, lastSyncedText],
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className='flex items-center relative bg-background p-2 border rounded-md'>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className='flex-1 bg-background pl-1 outline-none'
              aria-placeholder={placeholder}
              placeholder={<div className='editor-placeholder pointer-events-none opacity-50'>{placeholder}</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {children}

        <OnChangePlugin onChange={handleEditorChange} />
        <EnterKeyPlugin onEnter={onEnter} />

        <ControlledValuePlugin externalValue={value} onSetLastSyncedText={setLastSyncedText} />
      </div>
    </LexicalComposer>
  );
};
