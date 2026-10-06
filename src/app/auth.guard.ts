import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  // Teaching demo only: client-side localStorage is user-controlled, not authentication.
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!!localStorage.getItem('token')) {
      return true;
    } else {
      return this.router.createUrlTree(['/login'], {
        queryParams: {
          returnUrl: state.url
        }
      });
    }
  }

}
