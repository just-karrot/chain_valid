import CertificateNFT from 0x23e40696d6d65ecd

transaction {
    prepare(signer: auth(Storage) &Account) {
        let collection = signer.storage.borrow<&CertificateNFT.Collection>(from: /storage/CertificateCollection)
            ?? panic("Collection not found. Run SetupCollection first.")
        let minter <- signer.storage.load<@CertificateNFT.Minter>(from: /storage/CertificateMinter)
            ?? panic("Minter not found in account storage")
        let id = minter.mintNFT(recipient: collection)
        signer.storage.save(<- minter, to: /storage/CertificateMinter)
        log(id)
    }
} 