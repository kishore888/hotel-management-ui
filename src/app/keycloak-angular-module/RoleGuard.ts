import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const HOTEL_CREATOR_ROLE = 'SUPER_ADMIN';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.keycloak.isLoggedIn();

    if (!isLoggedIn) {
      this.keycloak.login({ redirectUri: window.location.origin + '/register-hotel' });
      return false;
    }

    const hasRole = this.keycloak.isUserInRole(HOTEL_CREATOR_ROLE);
    if (!hasRole) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
