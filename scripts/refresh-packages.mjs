import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Run through npm so its CLI path works on Windows as well as Unix.
if (!process.env.npm_execpath) throw new Error('Run npm run refresh:packages.');
const app = fileURLToPath(new URL('..', import.meta.url));
const theme = fileURLToPath(new URL('../../devextreme-theme/', import.meta.url));
const ui = fileURLToPath(new URL('../../smbc-ui/', import.meta.url));
function npm(cwd, args, capture = false) {
  return execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
}
function checkedArchive(cwd) {
  npm(cwd, ['ci']);
  npm(cwd, ['run', 'check']);
  // check has already built and tested dist; avoid building it a second time.
  const [archive] = JSON.parse(npm(cwd, ['pack', '--ignore-scripts', '--json'], true));
  return join(cwd, archive.filename);
}

const themeArchive = checkedArchive(theme);
// Explicit reinstall refreshes lockfile integrity for same-version archives.
// --save-dev preserves the UI's independent theme peer dependency.
npm(ui, ['install', '--save-dev', themeArchive]);
const uiArchive = checkedArchive(ui);
npm(app, ['install', themeArchive, uiArchive]);
npm(app, ['ci']);
npm(app, ['run', 'lint']);
npm(app, ['run', 'typecheck']);
npm(app, ['run', 'test:reference']);
console.log('Local packages refreshed and all three repositories validated.');
