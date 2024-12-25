import path from 'node:path';
import { Worker } from 'node:worker_threads';
import type { LexicalEditor } from 'lexical';
import { getEditorStateJson } from './get-editor-state-json';

/**
 * Converts the serialized editor state to HTML on the server side using a worker thread.
 *
 * @param state - The serialized editor state to be converted.
 * @returns A promise that resolves to the HTML string representation of the editor state.
 *
 * The function creates a new worker thread to handle the conversion process. The worker
 * receives the serialized editor state and performs the conversion. The result is sent
 * back to the main thread via a message event.
 *
 * If the worker sends an error message or exits with a non-zero code, the promise is rejected
 * with an appropriate error message.
 */
export const parseEditorToHtmlServer = (editor: LexicalEditor): Promise<string> => {
  return new Promise((resolve, reject) => {
    const state = getEditorStateJson(editor);
    const worker = new Worker(path.resolve(__dirname, 'helpers', 'parse-editor-to-html-server-internal.js'), { workerData: { state } });

    worker.on('message', (message) => {
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message);
      }
    });

    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};
