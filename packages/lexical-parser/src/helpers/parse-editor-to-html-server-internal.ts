import { parentPort, workerData } from 'node:worker_threads';
import { $generateHtmlFromNodes } from '@lexical/html';
import { JSDOM } from 'jsdom';
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical';
import { parseJsonEditorStateToEditor } from './parse-editor-state-json-to-editor';

interface WorkerData {
  state: SerializedEditorState<SerializedLexicalNode>;
}

/**
 * Initializes a headless DOM environment using JSDOM and sets up global `window` and `document`.
 */
const initializeDomEnvironment = (): void => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.window = dom.window as unknown as Window & typeof globalThis;
};

/**
 * Converts the serialized Lexical editor state to an HTML string.
 *
 * @returns A promise that resolves with the generated HTML string.
 */
const parseEditorToHtmlServer = async (state: SerializedEditorState<SerializedLexicalNode>): Promise<string> => {
  try {
    // Convert JSON editor state to an actual editor instance
    const editor = parseJsonEditorStateToEditor(state);

    // Generate HTML string
    return new Promise<string>((resolve) => {
      editor.update(() => {
        try {
          const html = $generateHtmlFromNodes(editor, null);
          resolve(html);
        } catch (error) {
          throw new Error(`Failed to generate HTML from editor state: ${(error as Error).message}`);
        }
      });
    });
  } catch (error) {
    // Log or send error back to the main thread
    throw new Error(`Failed to parse editor state to HTML: ${(error as Error).message}`);
  }
};

/**
 * Main execution logic for the worker thread.
 */
const main = async () => {
  try {
    // Initialize the DOM environment
    const { state } = workerData as WorkerData;

    if (!state) {
      throw new Error('No editor state provided');
    }

    initializeDomEnvironment();

    // Parse the editor state to HTML
    const html = await parseEditorToHtmlServer(state);

    // Send the result back to the parent thread
    parentPort?.postMessage(html);
  } catch (error) {
    // Send error back to the parent thread
    parentPort?.postMessage({ error: (error as Error).message });
  }
};

// Execute the main function
main();
