MdCloudServices = {};

MdCloudServices.askCredential = function (service, url) {
  switch (service) {
    case 'Google Photos':
      googlePhotos.requestCredential(url);
      break;
  }
}