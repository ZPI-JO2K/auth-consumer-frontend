import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import Keycloak from "keycloak-js";

// Context type
interface KeycloakContextType {
  keycloak: Keycloak.KeycloakInstance;
  initialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useKeycloak = () => {
  const ctx = useContext(KeycloakContext);
  if (!ctx) {
    throw new Error("useKeycloak must be used within KeycloakProvider");
  }
  return ctx;
};

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({
  children,
}) => {
  const [keycloak] = useState(
    new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    })
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (authenticated) {
          setInitialized(true);
        } else {
          console.warn("User is not authenticated, reloading");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
      });
  }, [keycloak]);

  if (!initialized) {
    return <div>Loading authentication...</div>;
  }

  return (
    <KeycloakContext.Provider value={{ keycloak, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};
