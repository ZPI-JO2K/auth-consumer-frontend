import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initKeycloak = (): Promise<Keycloak.KeycloakInstance> => {
  return new Promise((resolve, reject) => {
    keycloak
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (authenticated) {
          resolve(keycloak);
        } else {
          reject("Not authenticated");
        }
      })
      .catch((err) => reject(err));
  });
};

export default keycloak;
