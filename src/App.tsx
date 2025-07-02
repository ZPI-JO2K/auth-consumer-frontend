import "./App.css";
import { useKeycloak } from "./keycloak/KeycloakContext";

function App() {
  const { keycloak } = useKeycloak();
  return (
    <div>
      <h1>You are logged in</h1>
      <div className="card">
        <button onClick={() => keycloak.logout()}>Logout</button>
      </div>
    </div>
  );
}

export default App;
