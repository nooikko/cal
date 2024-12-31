import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

const define = Object.fromEntries(Object.entries(process.env).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]));

const commonOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  sourcemap: true,
  define,
  plugins: [
    alias({
      '@': path.resolve(__dirname, 'src'),
    }),
  ],
};

Promise.all([
  // ESM build
  esbuild.build({
    ...commonOptions,
    format: 'esm',
    outfile: 'dist/index.mjs',
    platform: 'node',
  }),

  // CommonJS build
  esbuild.build({
    ...commonOptions,
    format: 'cjs',
    outfile: 'dist/index.cjs',
    platform: 'node',
  }),
]).catch(() => process.exit(1));
