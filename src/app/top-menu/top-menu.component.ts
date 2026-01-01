import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TopMenuComponent {

  constructor(private router: Router, private keycloak: KeycloakService) {}

  navigateToProfile() {
    this.router.navigate(['/profile']); // Navigate dynamically
  }

  async logout(): Promise<void> {
    try {
      // clear local state first (optional)
      localStorage.clear();
      sessionStorage.clear();

      // keycloak-angular handles logout and redirect
      const redirect = window.location.origin + '/';
      await this.keycloak.logout(redirect);
    } catch (err) {
      console.error('logout failed', err);
      // fallback: navigate to home
      window.location.href = window.location.origin + '/';
    }
  }


}
