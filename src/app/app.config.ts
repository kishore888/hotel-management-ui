import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import keycloakConfig from './environments/keycloak.config';
// import { provideKeycloak } from 'keycloak-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter(routes),
    // provideKeycloak({
    //   config: {
    //     url: 'http://localhost:8080',
    //     realm: 'your-realm',
    //     clientId: 'your-client-id',
    //   },
    //   initOptions: {
    //     onLoad: 'login-required',
    //     silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
    //   },
    // }),

//     provideKeycloak({
//         config: keycloakConfig,
//         initOptions: {
//           onLoad: 'login-required',
//           checkLoginIframe: false,
//         },
//       }),
  ],
};
