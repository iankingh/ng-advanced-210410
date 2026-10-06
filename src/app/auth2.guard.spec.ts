import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Auth2Guard } from './auth2.guard';

describe('Auth2Guard', () => {
  let guard: Auth2Guard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    guard = TestBed.inject(Auth2Guard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  [null, ''].forEach(token => {
    it(`should redirect a missing or empty token (${token}) and preserve the child URL`, () => {
      spyOn(localStorage, 'getItem').and.returnValue(token);
      const url = '/utilities/color/red?view=all#details';
      const result = guard.canActivateChild({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot);
      expect(TestBed.inject(Router).serializeUrl(result as UrlTree))
        .toBe('/login?returnUrl=%2Futilities%2Fcolor%2Fred%3Fview%3Dall%23details');
    });
  });

  it('should allow a nonempty demo token without checking permissions', () => {
    spyOn(localStorage, 'getItem').and.returnValue('demo-session');
    expect(guard.canActivateChild({} as ActivatedRouteSnapshot, { url: '/page2' } as RouterStateSnapshot)).toBe(true);
  });
});
