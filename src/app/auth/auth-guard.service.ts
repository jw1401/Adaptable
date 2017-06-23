import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthGuard implements CanActivate
{
  public allowed: boolean;

  constructor(private afAuth: AngularFireAuth, private router: Router)
  {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
  {
    return this.afAuth.authState.map((auth) =>  {
      if(auth == null)
      {
        this.router.navigate(['/login']);
        return false;
      }
      else
      {
        return true;
      }
    }).first()
  }
}
