import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { environment } from '../environments/environment';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  isLoggedIn: boolean = false;

  // keycloak = new Keycloak({ 
  //   url: environment.keycloak.url,
  //   realm: environment.keycloak.realm,
  //   clientId: environment.keycloak.clientId
  // }); 
  
  constructor(private router: Router, private keycloak: KeycloakService) {}

  // login() { 
  //     this.keycloak.init({ 
  //       onLoad: 'login-required',
  //       checkLoginIframe: false,
  //       redirectUri: window.location.origin + '/room'
  //     }).then(authenticated => { 
  //       if (authenticated) { 
  //         this.isLoggedIn = true;
  //         // clean up Keycloak fragment/query and navigate to /room
  //       try {
  //         const cleanUrl = window.location.origin + '/room';
  //         console.log('clean url : '+window.location.origin + '/room');
  //         history.replaceState(null, document.title, cleanUrl);
  //       } catch (e) { /* ignore */ }

  //       // ensure Angular route is activated (replaceUrl avoids extra history entry)
  //       this.router.navigateByUrl('/room', { replaceUrl: true });

  //         // window.location.href = '#room'; // redirect to home after login 
  //         // this.router.navigate(['/addRoom']);
  //       } else {
  //         this.isLoggedIn = false;
  //       } 
  //     })
  //     .catch(err => {
  //       console.error('keycloak.init error', err);
  //       // fallback: try login explicitly so you can see Keycloak behavior
  //       try { this.keycloak.login({ redirectUri: window.location.origin + '/room' }); } catch(e) {}
  //     });

  //     // extra debug if browser navigation happens
  //     setTimeout(() => console.log('login() init timeout check'), 2000); 
  //   }


  //   /**
  //  * Initialize Keycloak. Use 'check-sso' so init() won't redirect immediately.
  //  * If not authenticated, call login() to redirect to Keycloak (so app unloads).
  //  * When the user returns, init() will run again and resolve authenticated=true.
  //  */
  // initAuth(): Promise<void> {
  //   return this.keycloak
  //     .init({ onLoad: 'check-sso', checkLoginIframe: false })
  //     .then((authenticated) => {
  //       if (authenticated) {
  //         this.isLoggedIn = true;
  //         // navigate to /room after successful auth
  //         this.router.navigateByUrl('/room', { replaceUrl: true });
  //       } else {
  //         // not authenticated -> start login redirect to Keycloak
  //         // provide redirectUri so Keycloak returns to /room after login
  //         this.keycloak.login({ redirectUri: window.location.origin + '/room' });
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('Keycloak init error', err);
  //       // attempt explicit login as fallback
  //       try {
  //         this.keycloak.login({ redirectUri: window.location.origin + '/room' });
  //       } catch (e) {
  //         console.error('Keycloak login fallback failed', e);
  //       }
  //     });
  // }

  loginApp() {
    this.keycloak.login({ redirectUri: window.location.origin + '/room' });
  }

  // keycloakInit() {
  //   this.keycloak.init({
  //     config: {
  //       url: environment.keycloak.url,
  //       realm: environment.keycloak.realm,
  //       clientId: environment.keycloak.clientId,
  //     },
  //     initOptions: {
  //       onLoad: 'login-required',//is working, can see login page
  //       checkLoginIframe: false,//is working, can see login page
  //       // onLoad: 'check-sso',
  //       // silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
  //       //pkceMethod: 'S256',
      
  //     },
  //   });
  // }
  
}
