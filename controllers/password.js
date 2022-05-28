const CryptoJS = require('crypto-js');

const encryptPass = (userPass) => {
  let encPass = CryptoJS.AES.encrypt(userPass, 'Salt Key').toString();
  return encPass;
};

const decryptPass = (encPass) => {
  let decPass = CryptoJS.AES.decrypt(encPass, 'Salt Key').toString(
    CryptoJS.enc.Utf8
  );
  return decPass;
};

module.exports = {
  encryptPass,
  decryptPass,
};
