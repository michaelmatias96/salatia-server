/**
 * Created by michaelmatias on 3/31/17.
 */
const CryptoJS = require("crypto-js");

function encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), getSecretKey()).toString();
}

exports.getWrappedEncryptedData = function(data) {
    return {"data" : encrypt(data)}
};

exports.decrypt =  function(data) {
    var bytes  = CryptoJS.AES.decrypt(data.toString(), getSecretKey());
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};

//TODO generate from userID
function getSecretKey() {
    return 'secret key 123';
}