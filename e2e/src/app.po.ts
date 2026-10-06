import { browser, by, element, ElementFinder, protractor } from 'protractor';

export class AppPage {
  async navigateTo(path = '/login'): Promise<void> {
    await browser.get(`${browser.baseUrl}#${path}`);
  }

  async fill(selector: string | ElementFinder, value: string): Promise<void> {
    const input = typeof selector === 'string' ? element(by.css(selector)) : selector;
    await input.clear();
    // WebDriver clear() alone does not emit the input event Angular needs for an empty value.
    if (value) {
      await input.sendKeys(value);
    } else {
      await input.sendKeys(' ', protractor.Key.BACK_SPACE);
    }
    await input.sendKeys(protractor.Key.TAB);
  }

  async submit(): Promise<void> {
    await element(by.css('button[type="submit"]')).click();
  }

  async token(): Promise<string | null> {
    return browser.executeScript('return localStorage.getItem("token");') as Promise<string | null>;
  }

  async openLogout(): Promise<void> {
    await element(by.id('userDropdown')).click();
    await element(by.css('[data-target="#logoutModal"]')).click();
    await browser.wait(protractor.ExpectedConditions.visibilityOf(element(by.id('logoutModal'))), 5000);
    // Bootstrap ignores dismiss clicks while the modal's opening transition is still running.
    await browser.wait(() => browser.executeScript(
      'return !window.jQuery("#logoutModal").data("bs.modal")._isTransitioning;'
    ), 5000);
  }

  logoutButton(): ElementFinder {
    return element(by.css('#logoutModal .btn-primary'));
  }
}
