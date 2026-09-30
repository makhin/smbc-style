import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from 'playwright';

const output = new URL('../artifacts/reference/', import.meta.url);
await mkdir(output, { recursive: true });
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(10000);
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => requests.push(request.url()));
  const url = server.resolvedUrls.local[0] + 'design-system';
  const load = async () => {
    await page.goto(url);
    await page.locator('#grid .dx-data-row').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
  };
  const reveal = async (selector) => {
    await page.locator(selector).evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    // Dropdown positioning must start after the sticky-header transform settles.
    await page.waitForTimeout(220);
  };
  const shot = async (name) => {
    // Capture final popup/menu states, rather than an animation frame.
    await page.waitForTimeout(250);
    return page.screenshot({ path: new URL(`${name}.png`, output).pathname });
  };
  const columns = (selector) => page.locator(selector).evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  // Check old thresholds and their replacements, including the intermediate ranges.
  for (const width of [320, 390, 620, 640, 760, 768, 900, 960, 1024, 1100, 1200, 1240, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await load();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflows at ${width}px`);
    assert.equal(await columns('#forms .smbc-ui-card > div > div'), width >= 1280 ? 4 : width >= 640 ? 2 : 1);
    assert.equal(await columns('#filters > div:last-child > div'), width >= 1280 ? 4 : width >= 768 ? 2 : 1);
    assert.equal(await page.locator('#ds-payment-note').evaluate((el) => getComputedStyle(el.closest('.smbc-ui-field')).gridColumnStart), width >= 768 ? 'span 2' : 'auto');
    assert.equal(await page.locator('aside').evaluate((el) => getComputedStyle(el).position), width >= 1024 ? 'sticky' : 'static');
    assert.equal(await page.getByRole('button', { name: 'Open navigation' }).isVisible(), width < 768);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await load();
  await shot('desktop');

  // Utilities still point to the canonical runtime tokens, including all tone maps.
  const visual = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const color = (name) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${name})`;
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const card = getComputedStyle(document.querySelector('#cards .smbc-ui-card'));
    const badges = [...document.querySelectorAll('#status > div:last-child > div:first-child > span')].map((el) => getComputedStyle(el).color);
    const expected = ['--color-text-secondary', '--color-feedback-info', '--color-feedback-warning', '--color-feedback-success', '--color-feedback-danger', '--color-feedback-danger', '--color-action-primary'].map(color);
    const heading = getComputedStyle(document.querySelector('h1'));
    return { badges, expected, radius: card.borderRadius, tokenRadius: root.getPropertyValue('--radius-md').trim(),
      fill: card.backgroundColor, tokenFill: color('--color-surface-default'),
      headingFont: heading.fontFamily, bodySize: getComputedStyle(document.body).fontSize,
      // The compact theme must retain its 12px native body typography.
      compactSize: root.getPropertyValue('--font-size-xs').trim(),
      border: card.borderTopStyle };
  });
  assert.deepEqual(visual.badges, visual.expected);
  assert.equal(visual.radius, visual.tokenRadius);
  assert.equal(visual.fill, visual.tokenFill);
  assert.equal(visual.border, 'solid');
  assert.equal(visual.bodySize, visual.compactSize);
  assert(visual.headingFont.includes('capitolium-2'));
  // Check full and one-sided borders, plus the intentional zero-width override.
  for (const width of ['3px', '1px']) {
    await page.evaluate((value) => document.documentElement.style.setProperty('--border-width-default', value), width);
    for (const [selector, property] of [
      ['#cards .smbc-ui-card', 'borderTopWidth'],
      ['#cards .smbc-ui-card > div:first-child', 'borderBottomWidth'],
      ['#cards .smbc-ui-card > div:last-child', 'borderTopWidth'],
      ['#foundations', 'borderBottomWidth'],
      ['#grid th', 'borderBottomWidth'],
      ['#accessibility .border-t-0', 'borderLeftWidth'],
    ]) {
      assert.equal(await page.locator(selector).first().evaluate((el, prop) => getComputedStyle(el)[prop], property), width, selector);
    }
    assert.equal(await page.locator('#accessibility .border-t-0').evaluate((el) => getComputedStyle(el).borderTopWidth), '0px');
  }
  await page.evaluate(() => document.documentElement.style.removeProperty('--border-width-default'));

  await page.evaluate(() => {
    document.documentElement.style.setProperty('--space-1', '5px');
    document.documentElement.style.setProperty('--color-action-primary', 'rgb(17, 34, 51)');
  });
  assert.equal(await page.locator('#buttons > div:last-child > div').evaluate((el) => getComputedStyle(el).gap), '15px');
  assert.equal(await page.locator('aside').evaluate((el) => getComputedStyle(el).backgroundColor), 'rgb(17, 34, 51)');
  await page.evaluate(() => {
    document.documentElement.style.removeProperty('--space-1');
    document.documentElement.style.removeProperty('--color-action-primary');
  });

  // Forms, validation, filters, Toolbar, grid and keyboard focus.
  await reveal('#forms');
  await page.getByLabel('Payment reference', { exact: true }).fill('PAY-TEST');
  await page.getByLabel('Read-only value').isEditable().then((value) => assert.equal(value, false));
  assert.equal(await page.getByLabel('Disabled value').isDisabled(), true);
  await page.getByLabel('Country', { exact: true }).click();
  await page.getByRole('option', { name: 'Germany', exact: true }).click();
  assert.equal(await page.getByLabel('Country', { exact: true }).inputValue(), 'Germany');
  await reveal('#ds-approver-email');
  await page.getByRole('button', { name: 'Validate fields', exact: true }).click();
  await page.locator('.dx-validationsummary').getByText('Enter the approver email.', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Approver email').getAttribute('aria-invalid'), 'true');
  await page.getByLabel('Approver email').focus();
  const focus = await page.getByLabel('Approver email').evaluate((el) => {
    const s = getComputedStyle(el.closest('.dx-texteditor'));
    return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
  });
  assert.equal(focus.style, 'solid');
  assert.equal(focus.width, '2px');
  await shot('validation-focus');
  await reveal('#filters');
  await page.getByLabel('Status', { exact: true }).click();
  await page.getByRole('option', { name: 'Approved', exact: true }).click();
  assert.equal(await page.getByLabel('Status', { exact: true }).inputValue(), 'Approved');
  await reveal('#ds-toolbar');
  await page.getByRole('button', { name: 'Refresh payments', exact: true }).click();
  assert.equal(await page.locator('#ds-toolbar-status').textContent(), 'Payments refreshed');
  await reveal('#grid');
  const row = page.locator('#grid .dx-data-row').first();
  await row.getByRole('checkbox').click();
  assert.equal(await row.getAttribute('aria-selected'), 'true');
  await page.locator('#grid .dx-datagrid-filter-row input').first().fill('PAY-2026');
  await page.locator('#grid .dx-datagrid-filter-row input').first().press('Tab');
  await page.locator('#grid .dx-data-row').first().waitFor();
  await shot('grid');
  await reveal('#dialogs');
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  await page.getByRole('dialog', { name: 'Approve payment?', exact: true }).waitFor();
  await page.waitForFunction(() => [...document.querySelectorAll('[role="dialog"]')].some((el) => el.getClientRects().length && el.contains(document.activeElement)));
  await shot('dialog');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Approve payment?', exact: true }).waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Show success toast', exact: true }).click();
  await page.getByText('Payment approved.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Run loading state', exact: true }).click();
  await page.getByText('Refreshing payments…').waitFor();
  await page.getByText('Refreshing payments…').waitFor({ state: 'hidden' });
  await page.locator('#accessibility a').last().focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#accessibility a').last().evaluate((el) => getComputedStyle(el).outlineStyle), 'solid');
  await shot('accessibility');

  // Header mechanics and responsive navigation remain operational.
  await load();
  await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.global-header').dataset.hidden === 'true');
  await page.evaluate(() => window.scrollTo({ top: 1700, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.global-header').dataset.hidden === 'false');
  await page.setViewportSize({ width: 390, height: 900 });
  await load();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  assert.equal(await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded'), 'true');
  await shot('mobile-navigation');
  await page.getByRole('navigation', { name: 'Global navigation' }).getByRole('link', { name: 'Design system' }).click();
  assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');
  await page.locator('#forms').scrollIntoViewIfNeeded();
  await shot('mobile-forms');
  await reveal('#dialogs');
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Approve payment?', exact: true });
  await dialog.waitFor();
  const bounds = await dialog.boundingBox();
  assert(bounds.x >= 0 && bounds.x + bounds.width <= 390, 'Mobile dialog overflows');
  await shot('mobile-dialog');
  await page.waitForFunction((el) => el.contains(document.activeElement), await dialog.elementHandle());
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.global-header').evaluate((el) => getComputedStyle(el).transitionDuration), '0s');
  assert.equal(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior), 'auto');
  assert.deepEqual(errors, []);
  assert.deepEqual(requests, []);
  console.log('PASS: production reference, 14 responsive widths, semantic tokens, typography, forms, validation/focus, filters, Toolbar, DataGrid, dialog/toast/loading, header, mobile, reduced motion.');
  console.log(`Screenshots: ${output.pathname}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
