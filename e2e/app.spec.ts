import { test, expect, Page } from '@playwright/test';

async function fill(page: Page, selector: string, value: string) {
  const input = page.locator(selector);
  await input.fill(value);
  await input.press('Tab');
}
const errors = new WeakMap<Page, string[]>();
const submit = (page: Page) => page.locator('button[type="submit"]').click();
const token = (page: Page) => page.evaluate(() => localStorage.getItem('token'));

test.beforeEach(async ({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  await page.goto('/#/login');
  await expect(page.locator('form')).toBeVisible();
});

test('preserves guarded lazy route, query and fragment through login and refresh', async ({ page }) => {
  const target = '/components/cards?view=all#details';
  await page.goto('/#' + target);
  await expect(page).toHaveURL(new RegExp('/login\\?returnUrl=' + encodeURIComponent(target) + '$'));
  await expect(page.locator('[role="alert"]')).toContainText('Teaching demo only');
  await submit(page);
  await expect(page).toHaveURL(new RegExp('#/components/cards\\?view=all#details$'));
  expect(await token(page)).toBe('demo-session');
  await expect(page.locator('#content-wrapper')).toContainText('cards works!');
  await expect(page.locator('body')).not.toHaveClass(/bg-gradient-primary/);
  await page.reload();
  await expect(page.locator('#content-wrapper')).toContainText('cards works!');
});

test('rejects an empty token on a nested route', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('token', ''));
  await page.goto('/#/utilities/color/red');
  await expect(page).toHaveURL(/login\?returnUrl=%2Futilities%2Fcolor%2Fred$/);
  expect(await token(page)).toBe('');
});

test('validates template-driven email, password, phone and Taiwan ID before login', async ({ page }) => {
  for (const [name, value] of [['email', 'invalid'], ['password', 'ab'], ['password', 'abc'], ['tel', '123'], ['twid', 'A123456788']]) {
    const selector = `[name="${name}"]`;
    const original = await page.locator(selector).inputValue();
    await fill(page, selector, value);
    await submit(page);
    await expect(page.locator(selector)).toHaveClass(/ng-invalid/);
    if (name !== 'tel') await expect(page.locator(selector)).toHaveClass(/is-invalid/);
    expect(await token(page)).toBeNull();
    await fill(page, selector, original);
  }
  await fill(page, '[name="twid"]', 'A123456789');
  await submit(page);
  await expect(page).toHaveURL(/#\/dashboard$/);
  expect(await token(page)).toBe('demo-session');
});

test('cancels and confirms logout through Bootstrap modal and blocks back navigation', async ({ page }) => {
  await submit(page);
  await expect(page).toHaveURL(/#\/dashboard$/);
  await page.evaluate(() => localStorage.setItem('demo-unrelated', 'keep'));
  async function openLogout() {
    await page.locator('#userDropdown').click();
    await page.locator('[data-target="#logoutModal"]').click();
    await expect(page.locator('#logoutModal')).toBeVisible();
    await page.waitForFunction(() => !(window as any).jQuery('#logoutModal').data('bs.modal')._isTransitioning);
  }
  await openLogout();
  await page.locator('#logoutModal .btn-secondary').click();
  await expect(page.locator('#logoutModal')).toBeHidden();
  expect(await token(page)).toBe('demo-session');
  await openLogout();
  await page.locator('#logoutModal .btn-primary').click();
  await expect(page).toHaveURL(/#\/login$/);
  expect(await token(page)).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('demo-unrelated'))).toBe('keep');
  await expect(page.locator('.modal-backdrop')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/login/);
});

test('validates reactive fields and dynamic Taiwan ID rows, then resets the form', async ({ page }) => {
  await page.goto('/#/login2');
  for (const [name, value] of [['email', 'invalid'], ['password', ''], ['password', 'ab'], ['password', 'a'.repeat(33)]]) {
    const selector = `[formControlName="${name}"]`;
    const original = await page.locator(selector).inputValue();
    await fill(page, selector, value);
    await submit(page);
    await expect(page.locator(selector)).toHaveClass(/is-invalid/);
    expect(await token(page)).toBeNull();
    await fill(page, selector, original);
  }
  await page.locator('section[formArrayName="extra"] button').click();
  const ids = page.locator('[formControlName="twid"]');
  await expect(ids).toHaveCount(4);
  await ids.last().fill('A123456788');
  await ids.last().press('Tab');
  await submit(page);
  await expect(ids.last()).toHaveClass(/is-invalid/);
  expect(await token(page)).toBeNull();
  await ids.last().fill('A123456789');
  await ids.last().press('Tab');
  await expect(ids.last()).not.toHaveClass(/is-invalid/);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(ids).toHaveCount(3);
  await expect(ids.first()).toHaveValue('');
  await expect(page.locator('[formControlName="email"]')).toHaveValue('doggy.huang@gmail.com');
  await expect(page.locator('form')).toHaveClass(/ng-pristine/);
  await expect(page.locator('form')).toHaveClass(/ng-untouched/);
  await submit(page);
  await expect(page).toHaveURL(/#\/dashboard$/);
});

test('returns from reactive login to the requested page and rejects a removed token', async ({ page }) => {
  await page.goto('/#/login2?returnUrl=' + encodeURIComponent('/page2?demo=1'));
  await page.locator('[formControlName="twid"]').first().fill('A123456789');
  await page.locator('[formControlName="twid"]').first().press('Tab');
  await submit(page);
  await expect(page).toHaveURL(/#\/page2\?demo=1$/);
  await expect(page.locator('#content-wrapper')).toContainText('page2 works!');
  await page.evaluate(() => localStorage.removeItem('token'));
  await page.goto('/#/page1');
  await expect(page).toHaveURL(/#\/login\?returnUrl=%2Fpage1$/);
});

test('keeps unimplemented actions disabled on both login forms', async ({ page }) => {
  for (const route of ['/login', '/login2']) {
    await page.goto('/#' + route);
    const buttons = page.locator('form button[disabled]');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.first()).toBeDisabled();
    await expect(buttons.last()).toBeDisabled();
  }
});

test('renders the public 404 page', async ({ page }) => {
  await page.goto('/#/missing-route');
  await expect(page.locator('app-root h1')).toHaveText('404 Not Found');
});

test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
  await page.evaluate(() => { localStorage.removeItem('token'); localStorage.removeItem('demo-unrelated'); });
});
