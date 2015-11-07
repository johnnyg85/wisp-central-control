// Client side functions.

// Tries to get the credintials from the database,
// If it failes, then it askes user for permissions.
MdCloudServices.getCredential = function (service, skipAsk, callback) {
  var userId = Meteor.userId();
  var credential = MdCloudServices.credentials.findOne({owner: userId, service: service});

  if (credential) {
    // Test the credentials
    Meteor.call('mdCloudServiceIsConnected', service, function (err, res) {
      if (err) {
        if (skipAsk) {
          callback('Credentials Failed', null);
          return;
        }
        MdCloudServices.askCredential(service, callback);
      } else {
        callback(null, credential);
      }
    });
    return;
  }

  // Skip the asking part
  if (skipAsk) {
    callback('Credentials Failed', null);
    return;
  }

  MdCloudServices.askCredential(service, callback);
};

// Bring up browser prompt for the credential
MdCloudServices.askCredential = function (service, callback) {
  switch (service) {
    case 'Google Photos':
      googlePhotos.requestCredential(function (credentialToken) {
        if (credentialToken) {
          var credentialSecret = OAuth._retrieveCredentialSecret(credentialToken);
          if (credentialSecret) {
            Meteor.call('addCredential', 'Google Photos', credentialToken, credentialSecret);
          }
        }
        MdCloudServices.getCredential(service, true, callback);
      });
      break;
    default:
      callback('Service not configured', null);
  }  
}