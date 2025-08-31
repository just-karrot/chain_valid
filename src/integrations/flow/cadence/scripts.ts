import { CONTRACT, PATHS } from "@/integrations/flow/config";

export const scripts = {
  getCertificateData: () => `
    import ${CONTRACT.name} from ${CONTRACT.address}

    access(all) struct CertData {
      access(all) let id: UInt64
      access(all) let metadataURI: String
      access(all) let revoked: Bool
      access(all) let issuedAt: UFix64
      init(id: UInt64, metadataURI: String, revoked: Bool, issuedAt: UFix64) {
        self.id = id
        self.metadataURI = metadataURI
        self.revoked = revoked
        self.issuedAt = issuedAt
      }
    }

    access(all) fun main(id: UInt64): CertData? {
      return ${CONTRACT.name}.getCertificateData(id: id)
    }
  `,

  getOwnedIDs: () => `
    import ${CONTRACT.name} from ${CONTRACT.address}

    access(all) fun main(account: Address): [UInt64] {
      let ref = getAccount(account)
        .capabilities.get<&${CONTRACT.name}.Collection>(${PATHS.CollectionPublic})
        .borrow()
      if ref == nil { return [] }
      return ref!.getIDs()
    }
  `,

  getTotalSupply: () => `
    import ${CONTRACT.name} from ${CONTRACT.address}

    access(all) fun main(): UInt64 {
      return ${CONTRACT.name}.totalSupply
    }
  `,
};
