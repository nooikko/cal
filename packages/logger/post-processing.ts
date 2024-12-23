import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('./dist/index.d.ts'); // Path to the generated declaration file

// Read the generated file
const baseContent = fs.readFileSync(filePath, 'utf8');

// Regex to match extra declarations caused by $1
const extrasRegex = new RegExp(/type\s+\w+\$1\s*=\s*\{[\s\S]*?\};(\n\};)?/g);

const run = () => {
  // Remove $1 declarations and blocks
  const cleanedContent = baseContent.replace(extrasRegex, '');

  // Remove all instances of $1 suffix
  const withoutSuffixes = cleanedContent.replace(/\$1/g, '');

  // Fix extra newlines and ensure consistent spacing
  const formattedContent = withoutSuffixes.replace(/(\n)+/g, '\n');

  // Write the cleaned content back to the file
  fs.writeFileSync(filePath, formattedContent);
};

// Execute the script
run();
