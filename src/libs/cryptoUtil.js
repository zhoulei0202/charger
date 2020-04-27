import CryptoJS from "crypto-js";
const EK = "0123456789ABCDEF";
let cryptoUtil = {
    encrypt(word) {
        if (word === null) {
            return word;
        }
        let key = CryptoJS.enc.Utf8.parse(EK);
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString().toUpperCase();
    },
    decrypt(word) {
        if (word === null) {
            return word;
        }
        let key = CryptoJS.enc.Utf8.parse(EK);
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        
        return decryptedStr.toString();  
    }
};

export default cryptoUtil;
