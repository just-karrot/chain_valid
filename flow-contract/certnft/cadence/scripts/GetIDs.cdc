import CertificateNFT from 0x23e40696d6d65ecd

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)
    let cap = account.capabilities.get<&CertificateNFT.Collection>(/public/CertificateCollection)
    let ref = cap.borrow() ?? panic("No collection capability")
    return ref.getIDs()
} 