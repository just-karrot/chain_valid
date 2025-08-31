import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import { initFCL } from "@/integrations/flow/fcl";

export function useFlow() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    initFCL();
    const unsubscribe = fcl.currentUser().subscribe(setUser);
    return () => unsubscribe();
  }, []);

  const login = () => fcl.authenticate();
  const logout = () => fcl.unauthenticate();

  const address = user?.addr as string | undefined;
  return { 
    currentUser: user, 
    address, 
    loggedIn: !!address, 
    login, 
    logout 
  };
}

export const shortAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
