import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// npm supplies its CLI path, including on Windows; no PowerShell or shell needed.
function main() {
  const [mode, update = 'All', ...extra] = process.argv.slice(2);
  if (!['clean', 'updated'].includes(mode) || !['All', 'Theme', 'Ui'].includes(update) || extra.length) {
    throw new Error('Usage: npm run build:clean | npm run build:updated -- [All|Theme|Ui]');
  }
  if (!process.env.npm_execpath) throw new Error('Start this script using npm run build:clean or npm run build:updated.');
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) throw new Error('Node.js 22.12 or newer is required.');

  const root = fileURLToPath(new URL('../../', import.meta.url));
  const [base, theme, ui, app] = ['smbc-theme', 'smbc-devextreme-theme', 'smbc-ui', 'smbc-style'].map(name => join(root, name));
  const clean = mode === 'clean';
  for (const project of [base, theme, ui, app]) {
    if (!existsSync(join(project, 'package.json'))) throw new Error(`Missing package.json in '${project}'. All four repositories must be sibling directories.`);
    if (!clean && !existsSync(join(project, 'node_modules'))) throw new Error(`Dependencies missing in '${project}'. Run npm.cmd run build:clean first.`);
  }

  function npm(project, args) {
    console.log(`[${basename(project)}] npm ${args.join(' ')}`);
    execFileSync(process.execPath, [process.env.npm_execpath, ...args], { cwd: project, stdio: 'inherit' });
  }
  function pack(project) {
    const { name, version } = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
    const filename = `${name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
    npm(project, ['pack']); // prepack builds and type-checks the package.
    if (!existsSync(join(project, filename))) throw new Error(`npm pack did not create '${filename}'.`);
    return `../${basename(project)}/${filename}`;
  }
  function install(project, archives = [], save = '--save-prod') {
    if (clean) {
      if (archives.length || !existsSync(join(project, 'package-lock.json'))) {
        // Refresh integrity for rebuilt same-version archives before npm ci.
        npm(project, ['install', '--package-lock-only', '--package-lock=true', '--ignore-scripts', '--include=dev', save, ...archives]);
      }
      npm(project, ['ci', '--include=dev']);
    } else {
      npm(project, ['install', '--include=dev', save, ...archives]);
    }
  }

  const archives = [];
  if (clean || update !== 'Ui') {
    if (clean) install(base);
    const baseArchive = pack(base);
    install(theme, [baseArchive], '--save-dev');
    const themeArchive = pack(theme);
    install(ui, [baseArchive, themeArchive], '--save-dev');
    archives.push(baseArchive, themeArchive);
  }
  archives.push(pack(ui));
  install(app, archives);
  npm(app, ['run', 'lint']);
  npm(app, ['run', 'build']);
  console.log(`Build complete: ${join(app, 'dist')}`);
}

try {
  main();
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exitCode = Number.isInteger(error.status) && error.status > 0 ? error.status : 1;
}
