import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  [null, ''].forEach(token => {
    it(`should redirect a missing or empty token (${token}) and preserve the requested URL`, () => {
      spyOn(localStorage, 'getItem').and.returnValue(token);
      const url = '/components/cards?view=all#details';
      const result = guard.canActivate({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot);
      expect(TestBed.inject(Router).serializeUrl(result as UrlTree))
        .toBe('/login?returnUrl=%2Fcomponents%2Fcards%3Fview%3Dall%23details');
    });
  });

  it('should allow a nonempty demo token without authenticating its contents', () => {
    spyOn(localStorage, 'getItem').and.returnValue('user-editable-demo');
    expect(guard.canActivate({} as ActivatedRouteSnapshot, { url: '/page1' } as RouterStateSnapshot)).toBe(true);
  });
});
