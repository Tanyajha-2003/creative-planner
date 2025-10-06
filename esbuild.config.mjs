// import { build } from 'esbuild';
// import fs from 'fs';
// import path from 'path';

// // Set the output directory
// const outDir = path.resolve(process.cwd(), 'src', 'webview', 'dist');

// // Create the output directory if it doesn't exist
// if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// // Copy index.html from src/
// const sourceHtmlPath = path.resolve('src', 'index.html');  // Corrected path
// const destinationHtmlPath = path.join(outDir, 'index.html');

// // Ensure the index.html exists before copying
// if (fs.existsSync(sourceHtmlPath)) {
//   fs.copyFileSync(sourceHtmlPath, destinationHtmlPath);
// } else {
//   console.error('index.html not found in src/');
//   process.exit(1);  // Exit if the file doesn't exist
// }

// // Build the webview with esbuild
// await build({
//   entryPoints: ['src/main.tsx'],  // Fixed to match actual path (assuming main.tsx is in src/)
//   bundle: true,
//   minify: false,
//   sourcemap: true,
//   outfile: path.join(outDir, 'webview.js'),
//   define: { 'process.env.NODE_ENV': '"development"' },
//   loader: { '.png': 'file' }
// });

// console.log('Webview built to src/webview/dist');

import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('webview-src');  // ✅ put the bundle directly here

await build({
  entryPoints: ['webview-src/index.tsx'],   // ✅ main entry
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: path.join(outDir, 'index.js'),   // ✅ match planner.ts
  define: { 'process.env.NODE_ENV': '"development"' },
  loader: { '.png': 'file' }
});

console.log('✅ Webview bundled to webview-src/index.js');
