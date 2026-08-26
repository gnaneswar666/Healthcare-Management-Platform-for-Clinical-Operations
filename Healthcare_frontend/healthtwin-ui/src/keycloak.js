import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:9090",
  realm: "healthtwin",
  clientId: "healthtwin-client",
});

export default keycloak;