import { KeycloakService } from 'keycloak-angular';
import { environment } from './environment';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'login-required',//is working, can see login page
         checkLoginIframe: false,//is working, can see login page
        // onLoad: 'check-sso',
        // silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        //pkceMethod: 'S256',
      
      },
    });
}
