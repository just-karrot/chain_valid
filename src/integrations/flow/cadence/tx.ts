import { CONTRACT, PATHS } from "@/integrations/flow/config";

export const tx = {
  setupAccount: () => `
    import ${CONTRACT.name} from ${CONTRACT.address}

    transaction {
      prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&${CONTRACT.name}.Collection>(from: ${PATHS.CollectionStorage}) == nil {
          signer.storage.save(<- ${CONTRACT.name}.createEmptyCollection(), to: ${PATHS.CollectionStorage})
        }
        let cap = signer.capabilities.storage.issue<&${CONTRACT.name}.Collection>(${PATHS.CollectionStorage})
        signer.capabilities.publish(cap, at: ${PATHS.CollectionPublic})
      }
    }
  `,

  mintCertificate: () => `
    import ${CONTRACT.name} from ${CONTRACT.address}

    transaction {
      prepare(signer: auth(Storage) &Account) {
        let collection = signer.storage.borrow<&${CONTRACT.name}.Collection>(from: ${PATHS.CollectionStorage})
          ?? panic("Collection not found. Run SetupCollection first.")
        let minter <- signer.storage.load<@${CONTRACT.name}.Minter>(from: ${PATHS.MinterStorage})
          ?? panic("Minter not found in account storage")
        let id = minter.mintNFT(recipient: collection)
        signer.storage.save(<- minter, to: ${PATHS.MinterStorage})
        log(id)
      }
    }
  `,

  revokeCertificate: () => `
    import ${CONTRACT.name} from ${CONTRACT.address}

    transaction(tokenId: UInt64, revoked: Bool) {
      prepare(signer: auth(Storage) &Account) {
        // Note: Revoke functionality not implemented in current contract
        // Would need to be added to the contract first
        panic("Revoke functionality not implemented")
      }
    }
  `,
};
