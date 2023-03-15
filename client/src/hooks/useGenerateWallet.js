import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

export const useGenerateWallet = () => {
    const genPrivKey = () => secp.utils.randomPrivateKey();

    const publicKey = (privateKey) => secp.getPublicKey(privateKey);

    const toKeccak = (value) => keccak256(value);

    const signMessage = async (privateKey, message) => {
        const _messageHash = utf8ToBytes(message);
        const signature = await secp.sign(_messageHash, privateKey);
        return toHex(signature);
    }

    return {
        genPrivKey,
        publicKey,
        signMessage,
        toHex,
        toKeccak
    }
}
