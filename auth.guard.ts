import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
}                     from '@angular/router';
import { Observable } from 'rxjs';

export interface UserAuth {
  created: Date | string | number;
  ttl: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
      private router: Router,
  ) {}

  private static checkTTL(ttl: number, authCreated: Date | string | number): boolean {
    return ttl - Math.round((new Date().getTime() - new Date(authCreated).getTime()) / 1000) >= 0;
  }

  public canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if ( !!localStorage.getItem('user') ) {
      const auth: UserAuth = JSON.parse(localStorage.getItem('user'));
      if ( AuthGuard.checkTTL(auth.ttl, auth.created) ) {
        localStorage.removeItem('user');
        // here actions to logout
        return false;
      } else return true;
    } else {
      this.router.navigate([ './' ])
          .then(() => console.log('not auth user')); // here present authentication
      return false;
    }
  }
}
