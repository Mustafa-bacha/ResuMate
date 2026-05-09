/**
 * Server-only PDF text extraction utility.
 * Uses a child process to run pdf-parse outside of Turbopack's module bundling,
 * which would otherwise break the CJS require() of pdf-parse.
 */

import { spawnSync } from 'child_process';
import path from 'path';

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const b64 = Buffer.from(buffer).toString('base64');
    const p1 = 'scripts';
    const p2 = 'extract-pdf.js';
    const scriptPath = [process.cwd(), p1, p2].join('/');

    // Obfuscate the arguments to prevent Turbopack from analyzing the path
    const cmd = 'node';
    const args = [scriptPath];
    const result = spawnSync(cmd, args, {
      input: b64,
      maxBuffer: 20 * 1024 * 1024, // 20MB
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
    });

    if (result.error) {
      throw new Error(`Child process error: ${result.error.message}`);
    }

    if (result.status !== 0) {
      console.error('[PDF] Script stderr:', result.stderr?.substring(0, 500));
      throw new Error(`PDF script exited with code ${result.status}`);
    }

    const output = JSON.parse(result.stdout);

    if (output.error) {
      throw new Error(`PDF parse error: ${output.error}`);
    }

    console.log(`[PDF] ✅ Extracted ${output.text.length} characters`);
    return output.text || '';
  } catch (e) {
    console.error('[PDF] Extraction failed:', e instanceof Error ? e.message : e);
    return '';
  }
}
