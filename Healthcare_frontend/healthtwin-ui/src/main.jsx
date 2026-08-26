import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import keycloak from "./keycloak";

keycloak
  .init({
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
  })
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <App keycloak={keycloak} />
    );
  })
  .catch((err) => {
    console.error("Keycloak init failed", err);
  });