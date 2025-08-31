access(all) contract CertificateNFT {

    access(all) var totalSupply: UInt64

    access(all) event Minted(id: UInt64, recipient: Address?)

    // ---------------- NFT resource ----------------
    access(all) resource NFT {
        access(all) let id: UInt64

        init(initID: UInt64) {
            self.id = initID
        }
    }

    // ---------------- Collection resource ----------------
    access(all) resource Collection {

        access(all) var ownedNFTs: @{UInt64: NFT}

        // Withdraw an NFT
        access(all) fun withdraw(withdrawID: UInt64): @NFT {
            let nft <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("NFT does not exist in collection")
            return <- nft
        }

        // Deposit an NFT
        access(all) fun deposit(token: @NFT) {
            let nft <- token as! @NFT
            let id = nft.id
            if self.ownedNFTs[id] != nil {
                panic("NFT already exists in collection")
            }
            self.ownedNFTs[id] <-! nft
        }

        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) fun borrowNFT(id: UInt64): &NFT {
            let ref = &self.ownedNFTs[id] as &NFT?
            return ref!
        }

        init() {
            self.ownedNFTs <- {}
        }
        // ❌ Removed destroy() (Cadence 1.0 handles destruction)
    }

    // ---------------- Minter resource ----------------
    access(all) resource Minter {
        access(all) fun mintNFT(
            recipient: &CertificateNFT.Collection
        ): UInt64 {
            CertificateNFT.totalSupply = CertificateNFT.totalSupply + 1
            let newNFT <- create NFT(initID: CertificateNFT.totalSupply)
            let newID = newNFT.id

            recipient.deposit(token: <- newNFT)

            emit Minted(id: newID, recipient: recipient.owner?.address)
            return newID
        }
    }

    // ---------------- Factory functions ----------------
    access(all) fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    access(all) fun createMinter(): @Minter {
        return <- create Minter()
    }

    // ---------------- Contract init ----------------
    init() {
        self.totalSupply = 0
        self.account.storage.save(<- self.createMinter(), to: /storage/CertificateMinter)
    }
}
