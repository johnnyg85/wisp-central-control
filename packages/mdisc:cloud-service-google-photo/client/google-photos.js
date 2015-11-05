googlePhotos = [];

googlePhotos.requestCredential = function (callback) {
  Google.requestCredential({
    requestPermissions: ['https://picasaweb.google.com/data/'],
    requestOfflineToken: 'true'
  }, callback);
};