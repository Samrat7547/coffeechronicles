import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';


@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {

  constructor(private auth:AuthService, private router:Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error('Method not implemented.');

    if(this.auth.isAuthenticated()){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  
}
