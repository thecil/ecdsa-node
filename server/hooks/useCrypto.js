const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256, keccak224, keccak384, keccak512 } = require("ethereum-cryptography/keccak");


export const useCrypto = () => {
    const genPrivKey = () => secp.utils.randomPrivateKey();

    const publicKey = () => secp.getPublicKey(genPrivKey());

    return {
        genPrivKey,
        publicKey,
        toHex,
    }
}
