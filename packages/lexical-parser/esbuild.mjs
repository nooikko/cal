import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';

// Manually define __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

const define = Object.fromEntries(Object.entries(process.env).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]));

const commonOptions = {
  entryPoints: ['src/index.ts', 'src/helpers/parse-editor-to-html-server-internal.ts'],
  bundle: true,
  sourcemap: true,
  define,
  plugins: [
    alias({
      '@': path.resolve(__dirname, 'src'),
    }),
  ],
  external: [
    'lexical',
    '@lexical/html',
    'jsdom',
    '@lexical/clipboard',
    '@lexical/selection',
    '@lexical/utils',
    '@lexical/react',
    '@lexical/table',
    '@lexical/list',
    '@lexical/code',
    '@lexical/link',
    '@lexical/rich-text',
  ],
};

Promise.all([
  esbuild.build({
    ...commonOptions,
    format: 'cjs',
    outdir: 'dist',
    platform: 'node',
  }),
]).catch(() => process.exit(1));
