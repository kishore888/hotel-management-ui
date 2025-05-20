import { KeycloakConfig } from 'keycloak-js';
import { environment } from './environment';

const keycloakConfig: KeycloakConfig = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId,
};

export default keycloakConfig;
