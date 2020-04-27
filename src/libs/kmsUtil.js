import util from "@/libs/util";
import envStr from "@/config/env";
import base64 from "crypto-js/enc-base64";
import CryptoJS from "crypto-js";
import axios from "axios";

const isAWS = true;

var kmsUtil = {
    requestKey() {
        if (envStr === "production" && isAWS) {
            return axios({
                method: "get",
                url: "/pki/getkey",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true // 默认的
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve({
                    data: {
                        code: 200,
                        msg: "调试模式",
                        keyMaterial: "MDEyMzQ1Njc4OUFCQ0RFRg=="
                        //keyMaterial: "vvvgrXOCZvOjNxmU4+qydA=="
                    }
                });
            });
        }
    },
    getKey() {
        var KMSKEY = util.locals.get("KMSKEY");
        if (KMSKEY) {
            return base64.parse(KMSKEY);
        } else {
            return "";
        }
    },
    cacheKey() {
        return new Promise((resolve, reject) => {
            kmsUtil.requestKey().then((_res) => {
                let data = _res.data;
                if (parseInt(data.code) === 200) {
                    util.locals.set("KMSKEY", data.keyMaterial);
                    resolve({
                        message: "success"
                    });
                } else {
                    reject({
                        message: "'请拨打：400-821-5800，联系系统管理员!'"
                    });
                }
            }).catch((e) => {
                reject(e);
            });
        });
    },
    decrypt(word) {
        let key = kmsUtil.getKey();
        if (!word || !key || key === "") {
            return "";
        }
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        
        return decryptedStr.toString();
    },
    encrypt(word) {
        let key = kmsUtil.getKey();
        if (!word || !key || key === "") {
            return "";
        }
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString().toUpperCase();
    }
};
export default kmsUtil;
