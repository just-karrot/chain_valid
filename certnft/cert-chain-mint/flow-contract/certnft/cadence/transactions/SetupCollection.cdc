import CertificateNFT from 0x23e40696d6d65ecd

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&CertificateNFT.Collection>(from: /storage/CertificateCollection) == nil {
            signer.storage.save(<- CertificateNFT.createEmptyCollection(), to: /storage/CertificateCollection)
        }
        let cap = signer.capabilities.storage.issue<&CertificateNFT.Collection>(/storage/CertificateCollection)
        signer.capabilities.publish(cap, at: /public/CertificateCollection)
    }
} 