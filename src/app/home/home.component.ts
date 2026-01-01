import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})
export class HomeComponent {

  constructor(private router: Router, private homeServiceService: HomeService) {}

  // Smooth scroll to section 
  scrollTo(sectionId: string) { 
    const element = document.getElementById(sectionId); 
    if (element) { 
      element.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    } 
  } 

    // Trigger Keycloak login 
    login() { 
      this.homeServiceService.loginApp();
      // this.homeServiceService.initAuth();
    }
}
