import { AppPage } from './app.po';
import { browser, by, element, logging, protractor } from 'protractor';

describe('Demo token routing and forms', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();
    await browser.executeScript('localStorage.removeItem("token");');
  });

  it('redirects a guarded lazy route and preserves its query and fragment through login', async () => {
    const target = '/components/cards?view=all#details';
    await page.navigateTo(target);
    expect(await browser.getCurrentUrl()).toContain('/login?returnUrl=' + encodeURIComponent(target));
    expect(await element(by.css('[role="alert"]')).getText()).toContain('Teaching demo only');
    await page.submit();
    expect(await page.token()).toBe('demo-session');
    expect(await browser.getCurrentUrl()).toContain('#' + target);
    expect(await element(by.css('#content-wrapper')).getText()).toContain('cards works!');
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('bg-gradient-primary');
    await browser.refresh();
    expect(await browser.getCurrentUrl()).toContain('#' + target);
  });

  it('rejects an empty token on a nested guarded route', async () => {
    await browser.executeScript('localStorage.setItem("token", "");');
    await page.navigateTo('/utilities/color/red');
    expect(await browser.getCurrentUrl()).toContain('/login?returnUrl=%2Futilities%2Fcolor%2Fred');
    expect(await page.token()).toBe('');
  });

  it('shows template-driven validation errors and refuses invalid submissions', async () => {
    await page.fill('[name="email"]', 'invalid');
    await page.submit();
    expect(await element(by.css('[name="email"]')).getAttribute('class')).toContain('is-invalid');
    expect(await element(by.css('form')).getText()).toContain('請輸入正確的 Email 格式');
    expect(await page.token()).toBeNull();
    await page.fill('[name="email"]', '');
    expect(await element(by.css('form')).getText()).toContain('請輸入 Email');
    await page.fill('[name="email"]', 'demo@example.com');
    await page.fill('[name="password"]', 'ab');
    await page.submit();
    expect(await element(by.css('form')).getText()).toContain('密碼請輸入至少 3 個字元');
    expect(await page.token()).toBeNull();
    await page.fill('[name="password"]', 'abc');
    expect(await element(by.css('form')).getText()).toContain('請輸入符合規定的密碼');
    await page.fill('[name="password"]', '');
    expect(await element(by.css('form')).getText()).toContain('請輸入密碼');
    await page.fill('[name="password"]', '123abcABC');
    await page.fill('[name="tel"]', '123');
    await page.submit();
    expect(await page.token()).toBeNull();
    await page.fill('[name="tel"]', '0912345678');
    await page.fill('[name="twid"]', 'A123456788');
    await page.submit();
    expect(await element(by.css('[name="twid"]')).getAttribute('class')).toContain('is-invalid');
    expect(await element(by.css('form')).getText()).toContain('"twid": true');
    expect(await page.token()).toBeNull();
    await page.fill('[name="twid"]', 'A123456789');
    await page.submit();
    expect(await page.token()).toBe('demo-session');
    expect(await browser.getCurrentUrl()).toContain('#/dashboard');
  });

  it('cancels and confirms logout through the real Bootstrap modal and blocks back navigation', async () => {
    await page.submit();
    await browser.executeScript('localStorage.setItem("demo-unrelated", "keep");');
    await page.openLogout();
    await element(by.css('#logoutModal .btn-secondary')).click();
    await browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.id('logoutModal'))), 5000);
    expect(await page.token()).toBe('demo-session');
    await page.openLogout();
    await page.logoutButton().click();
    expect(await page.token()).toBeNull();
    expect(await browser.getCurrentUrl()).toContain('#/login');
    expect(await browser.executeScript('return localStorage.getItem("demo-unrelated");')).toBe('keep');
    await browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.css('.modal-backdrop'))), 5000);
    expect(await element.all(by.css('.modal-backdrop')).count()).toBe(0);
    expect(await element(by.css('body')).getAttribute('class')).not.toContain('modal-open');
    await browser.navigate().back();
    expect(await browser.getCurrentUrl()).toContain('#/login');
    expect(await page.token()).toBeNull();
  });

  it('validates reactive email on blur, password bounds and dynamic Taiwan ID rows', async () => {
    await page.navigateTo('/login2');
    await page.fill('[formControlName="email"]', 'invalid');
    await page.submit();
    expect(await element(by.css('[formControlName="email"]')).getAttribute('class')).toContain('is-invalid');
    expect(await element(by.css('form')).getText()).toContain('請輸入正確的 Email 格式');
    expect(await page.token()).toBeNull();
    await page.fill('[formControlName="email"]', '');
    expect(await element(by.css('form')).getText()).toContain('請輸入 Email');
    await page.fill('[formControlName="email"]', 'demo@example.com');
    await page.fill('[formControlName="password"]', '');
    expect(await element(by.css('form')).getText()).toContain('請輸入密碼');
    await page.fill('[formControlName="password"]', 'ab');
    expect(await element(by.css('form')).getText()).toContain('密碼請輸入至少 3 個字元');
    await page.submit();
    expect(await page.token()).toBeNull();
    await page.fill('[formControlName="password"]', 'a'.repeat(33));
    await page.submit();
    expect(await page.token()).toBeNull();
    expect(await element(by.css('[formControlName="password"]')).getAttribute('class')).toContain('is-invalid');
    await page.fill('[formControlName="password"]', '123abcABC');
    await element(by.css('section[formArrayName="extra"] button')).click();
    const ids = element.all(by.css('[formControlName="twid"]'));
    expect(await ids.count()).toBe(4);
    await ids.last().sendKeys('A123456788', protractor.Key.TAB);
    await page.submit();
    expect(await ids.last().getAttribute('class')).toContain('is-invalid');
    expect(await page.token()).toBeNull();
    await ids.last().clear();
    await ids.last().sendKeys('A123456789', protractor.Key.TAB);
    expect(await ids.last().getAttribute('class')).not.toContain('is-invalid');
    await element(by.buttonText('Reset')).click();
    expect(await ids.count()).toBe(3);
    expect(await ids.first().getAttribute('value')).toBe('');
    expect(await element(by.css('[formControlName="email"]')).getAttribute('value')).toBe('doggy.huang@gmail.com');
    expect(await element(by.css('form')).getAttribute('class')).toContain('ng-pristine');
    expect(await element(by.css('form')).getAttribute('class')).toContain('ng-untouched');
    await page.submit();
    expect(await page.token()).toBe('demo-session');
    expect(await browser.getCurrentUrl()).toContain('#/dashboard');
  });

  it('returns from reactive login to a guarded page with query parameters', async () => {
    await page.navigateTo('/login2?returnUrl=' + encodeURIComponent('/page2?demo=1'));
    await page.fill(element.all(by.css('[formControlName="twid"]')).first(), 'A123456789');
    await page.submit();
    expect(await page.token()).toBe('demo-session');
    expect(await browser.getCurrentUrl()).toContain('#/page2?demo=1');
    expect(await element(by.css('#content-wrapper')).getText()).toContain('page2 works!');
    await browser.executeScript('localStorage.removeItem("token");');
    await page.navigateTo('/page1');
    expect(await browser.getCurrentUrl()).toContain('#/login?returnUrl=%2Fpage1');
  });

  it('marks unimplemented login actions as disabled on both forms', async () => {
    for (const route of ['/login', '/login2']) {
      await page.navigateTo(route);
      const buttons = element.all(by.css('form button[disabled]'));
      expect(await buttons.count()).toBe(2);
      expect(await buttons.first().isEnabled()).toBe(false);
      expect(await buttons.last().isEnabled()).toBe(false);
    }
  });

  it('renders the public 404 page for an unknown route', async () => {
    await page.navigateTo('/missing-route');
    expect(await element(by.css('app-root h1')).getText()).toBe('404 Not Found');
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    const scriptErrors = logs.filter(entry => entry.level.value >= logging.Level.SEVERE.value &&
      (entry.message.includes('Uncaught') || entry.message.includes('ERROR Error')));
    expect(scriptErrors).toEqual([]);
    await browser.executeScript('localStorage.removeItem("token"); localStorage.removeItem("demo-unrelated");');
  });
});
