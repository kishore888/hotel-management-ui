import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-user-profile.component',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  standalone: true
})
export class UserProfileComponent {

  constructor(private keycloakService: KeycloakService) {}
    
  logout(): void {
    // this.keycloakService.logout('http://localhost:4200/home');
  }

}
