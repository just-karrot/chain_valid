import { config } from "@onflow/fcl";

let initialized = false;

export const initFCL = () => {
  if (initialized) return;
  initialized = true;
  config()
    .put("app.detail.title", "CertChain")
    .put("app.detail.icon", "/favicon.ico")
    .put("accessNode.api", "https://rest-testnet.onflow.org")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    .put("flow.network", "testnet");
};

export { authenticate as login, unauthenticate as logout, currentUser } from "@onflow/fcl";
