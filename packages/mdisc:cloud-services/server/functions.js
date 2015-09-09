MdCloudServices.renewCredential = function (credential) {

  // This doesn't work.  There is more study require to making an off-line authorization.
  return {};
  
  var credentialDetail = OAuth.retrieveCredential(credential.credentialToken, credential.credentialSecret);
  MdCloudServices.credentials.update({_id: credential._id}, {$set: {credential: credentialDetail}});
  newCredential = MdCloudServices.credentials.findOne({_id: credential._id});

  return newCredential;
}