// Write your package code here!
MdAES = {};

MdAES.encrypt = function (msg) {
  var encrypt = CryptoJS.AES.encrypt(msg, Meteor.settings.aes.passphrase);
  return encrypt.toString();
}

// decrypt is only avialible on the server
MdAES.decrypt = function (msg) {
  var decrypted = CryptoJS.AES.decrypt(msg, Meteor.settings.aes.passphrase);
  return decrypted.toString(CryptoJS.enc.Utf8);
} 

Meteor.methods({
  'mdEncrypt': function (msg) {
    return MdAES.encrypt(msg);
  }
});