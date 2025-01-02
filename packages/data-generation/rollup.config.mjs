import path from 'node:path';
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';

// Convert import.meta.url to __dirname-compatible format
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: './dist/types/index.d.ts',
  output: {
    file: './dist/index.d.ts',
    format: 'es',
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, 'src') }, // Resolve to `src` directory
      ],
    }),
    dts(),
  ],
};
