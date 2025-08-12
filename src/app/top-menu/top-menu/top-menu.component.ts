import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {
  keycloakLogoutUrl = 'http://localhost:8080/realms/hotelmanagement/protocol/openid-connect/logout';

  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile']); // Navigate dynamically
  }

  logout2() {
    // localStorage.clear(); // Clears stored tokens and user details
    // sessionStorage.clear(); // Clears session-based authentication data
    // localStorage.removeItem('token');
    // window.location.href = `${this.keycloakLogoutUrl}?redirect_uri=${encodeURIComponent(window.location.origin + '/login')}`;

    fetch(this.keycloakLogoutUrl, {
    method: 'POST',
    credentials: 'include'
  }).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'http://localhost:4200'; // Redirect after logout
  }).catch(error => console.error('Logout failed:', error));
  }

  logout() {
    const keycloakLogoutUrl = 'http://localhost:8080/realms/hotelmanagement/protocol/openid-connect/logout';
    // const redirectUri = encodeURIComponent(window.location.origin + '/login');
    const redirectUri = encodeURIComponent('http://localhost:4200'); // Redirect to your Angular app
    localStorage.clear();
    sessionStorage.clear();
    
    window.location.href = `${keycloakLogoutUrl}?redirect_uri=${redirectUri}`;
  }


}
