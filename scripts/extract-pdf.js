#!/usr/bin/env node
/**
 * Standalone PDF text extraction script.
 * Reads base64-encoded PDF from stdin, outputs JSON to stdout.
 * Called as a child process from the API route to avoid Turbopack bundling issues.
 */

const pdfParse = require('pdf-parse');

async function main() {
  let b64 = '';
  
  // Read from stdin
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    b64 += chunk;
  }

  try {
    const buffer = Buffer.from(b64.trim(), 'base64');
    const data = await pdfParse(buffer);
    process.stdout.write(JSON.stringify({ text: data.text || '' }));
  } catch (e) {
    process.stdout.write(JSON.stringify({ text: '', error: e.message }));
  }
  process.exit(0);
}

main();
