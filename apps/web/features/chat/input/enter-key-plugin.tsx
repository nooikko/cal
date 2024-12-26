'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from 'lexical';
import { useEffect } from 'react';

interface EnterKeyPluginProps {
  onEnter?: () => void;
}

export const EnterKeyPlugin = ({ onEnter }: EnterKeyPluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Return the unregister function
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!event) {
          return false;
        }

        // If Shift is NOT pressed, then we do a custom action
        if (!event.shiftKey) {
          event.preventDefault();
          onEnter?.();
          // By returning `true`, we tell Lexical that we've handled the command
          // and prevent the default new-line insertion
          return true;
        }
        // If Shift is pressed, let the default behavior run (new line)
        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, onEnter]);

  return null;
};
