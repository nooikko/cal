'use client';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useRef } from 'react';
import theme from './editor-theme';

export const ChatInput = () => {
  const inputRef = useRef<HTMLDivElement | null>(null);

  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'lexical-search',
        onError: (error: Error) => {
          throw error;
        },
        editorState: null,
        nodes: [],
        theme,
      }}
    >
      <div ref={inputRef} className='flex items-center relative bg-background'>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className='editor-input bg-background border rounded-md'
              aria-placeholder='Message Cal'
              placeholder={<div className='editor-placeholder'>Message Cal</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
};
