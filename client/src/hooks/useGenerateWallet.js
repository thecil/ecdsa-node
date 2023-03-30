import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

export const useGenerateWallet = () => {

    const toKeccak = (value) => keccak256(value);

    const genPrivKey = () => secp.utils.randomPrivateKey();

    const publicKey = (privateKey) => secp.getPublicKey(privateKey);

    const signMessage = async (privateKey, message) => {
        const _messageHash = toHex(toKeccak(utf8ToBytes(message.trim())));
        const signature = await secp.sign(_messageHash, privateKey);
        return signature;
    }

    const verifyMessage = (signature, message, publicKey) => {
        const _messageHash = toHex(toKeccak(utf8ToBytes(message.trim())));
        const isValid = secp.verify(signature, _messageHash, publicKey);
        return isValid;
    }

    return {
        utf8ToBytes,
        toHex,
        hexToBytes,
        toKeccak,
        genPrivKey,
        publicKey,
        signMessage,
        verifyMessage
    }
}
