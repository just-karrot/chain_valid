import * as fcl from "@onflow/fcl";
import { initFCL } from "@/integrations/flow/fcl";
import { CONTRACT } from "@/integrations/flow/config";
import { tx } from "@/integrations/flow/cadence/tx";
import { scripts } from "@/integrations/flow/cadence/scripts";

function ensureConfigured() {
  if (!CONTRACT.address || CONTRACT.address.includes("YOUR_CONTRACT_ADDRESS")) {
    throw new Error("Set your deployed CertificateNFT address in src/integrations/flow/config.ts");
  }
}

export async function setupMyCollection() {
  initFCL();
  ensureConfigured();
  const cadence = tx.setupAccount();
  const txId = await fcl.mutate({ cadence, args: () => [], limit: 9999 });
  await fcl.tx(txId).onceSealed();
  return txId;
}

export async function mintCertificate() {
  initFCL();
  ensureConfigured();
  const cadence = tx.mintCertificate();
  const txId = await fcl.mutate({
    cadence,
    args: () => [],
    limit: 9999,
  });
  await fcl.tx(txId).onceSealed();
  return txId;
}

export async function getCertificateById(id: number) {
  initFCL();
  ensureConfigured();
  const cadence = scripts.getCertificateData();
  const data = await fcl.query({ cadence, args: () => [fcl.arg(String(id), fcl.t.UInt64)] });
  return data as any | null;
}

export async function getOwnedCertificateIDs(address: string) {
  initFCL();
  ensureConfigured();
  const cadence = scripts.getOwnedIDs();
  const data = await fcl.query({ cadence, args: () => [fcl.arg(address, fcl.t.Address)] });
  return data as number[] || [];
}

export async function getTotalSupply() {
  initFCL();
  ensureConfigured();
  const cadence = scripts.getTotalSupply();
  const data = await fcl.query({ cadence, args: () => [] });
  return data as number || 0;
}
