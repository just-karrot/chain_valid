access(all) contract CertificateNFT {

    access(all) event Minted(id: UInt64, recipient: Address?)

    access(all) struct CertificateData {
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

    access(all) resource NFT {
        access(all) let id: UInt64
        access(all) let metadataURI: String
        access(all) var revoked: Bool

        init(_ id: UInt64, metadataURI: String) {
            self.id = id
            self.metadataURI = metadataURI
            self.revoked = false
        }
    }

    access(all) resource Collection {
        access(all) var ownedNFTs: @{UInt64: NFT}

        init() {
            self.ownedNFTs <- {}
        }

        access(all) fun withdraw(withdrawID: UInt64): @NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Missing NFT")
            return <- token
        }

        access(all) fun deposit(token: @NFT) {
            let nft <- token as! @NFT
            let id = nft.id
            let old <- self.ownedNFTs[id] <- nft
            destroy old
        }

        access(all) fun getIDs(): [UInt64] { return self.ownedNFTs.keys }
        access(all) fun borrowNFT(id: UInt64): &NFT { 
            let ref = &self.ownedNFTs[id] as &NFT?
            return ref!
        }
    }

    access(all) fun createEmptyCollection(): @Collection { return <- create Collection() }

    access(all) resource Minter {
        access(all) fun mintNFT(
            recipient: &CertificateNFT.Collection
        ): UInt64 {
            CertificateNFT.totalSupply = CertificateNFT.totalSupply + 1
            let newNFT <- create NFT(initID: CertificateNFT.totalSupply, metadataURI: "ipfs://placeholder")
            let newID = newNFT.id

            recipient.deposit(token: <- newNFT)

            emit Minted(id: newID, recipient: recipient.owner?.address)
            return newID
        }
    }

    access(all) var totalSupply: UInt64
    access(all) var certificates: {UInt64: CertificateData}

    access(all) fun getCertificateData(id: UInt64): CertificateData? { return self.certificates[id] }

    init() {
        self.totalSupply = 0
        self.certificates = {}
        self.account.storage.save(<- self.createMinter(), to: /storage/CertificateMinter)
    }
}
