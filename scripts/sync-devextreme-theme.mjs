import { readFile, writeFile } from 'node:fs/promises';

const tokensPath = new URL('../src/theme/app-styles/tokens.css', import.meta.url);
const metadataPath = new URL('../src/theme/smbc-theme.metadata.json', import.meta.url);
const packagePath = new URL('../node_modules/devextreme-themebuilder/package.json', import.meta.url);

const css = await readFile(tokensPath, 'utf8');
const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
const themeBuilderPackage = JSON.parse(await readFile(packagePath, 'utf8'));

const declarations = new Map();
const declarationPattern = /--([a-z0-9-]+):\s*([^;]+);/gi;

for (const match of css.matchAll(declarationPattern)) {
  declarations.set(match[1], match[2].trim());
}

function resolveToken(name, stack = []) {
  if (stack.includes(name)) {
    throw new Error(`Circular design token reference: ${[...stack, name].join(' -> ')}`);
  }

  const value = declarations.get(name);
  if (!value) {
    throw new Error(`Missing required design token: --${name}`);
  }

  return value.replace(/var\(--([a-z0-9-]+)\)/gi, (_, dependency) =>
    resolveToken(dependency, [...stack, name]));
}

const themeBuilderTokens = {
  '$base-accent': 'color-action-primary',
  '$base-text-color': 'color-text-primary',
  '$base-bg': 'color-surface-default',
  '$base-border-color': 'color-border-default',
  '$base-border-radius': 'radius-sm',
  '$base-font-family': 'font-sans',
};

for (const item of metadata.items) {
  const tokenName = themeBuilderTokens[item.key];
  if (tokenName) {
    item.value = resolveToken(tokenName).replaceAll('"', '');
  }
}

metadata.version = themeBuilderPackage.version;

await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
