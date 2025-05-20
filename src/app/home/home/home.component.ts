import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private keycloakService: KeycloakService) {}
  
  logout(): void {
    this.keycloakService.logout('http://localhost:4200');
  }
}
