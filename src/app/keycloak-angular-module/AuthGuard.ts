import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { HomeService } from '../home/home.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private homeService: HomeService, private keycloak: KeycloakService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.keycloak.isLoggedIn();
    if (!isLoggedIn) {
      this.keycloak.login();
      return false;
    }
    return true;
  }

  canActivateChild(): boolean | UrlTree {
    // prefer HomeService.isAuthenticated() if available, fallback to raw keycloak instance
    const authenticated = this.homeService.isAuthenticated?.() ?? this.homeService.isLoggedIn ?? !!((this.homeService as any).keycloak?.authenticated || (window as any).keycloak?.authenticated);
    if (authenticated) return true;
    // not authenticated -> redirect to public home
    return this.router.createUrlTree(['/home']);
  }
  
}
