Router.route('/google-start/', {
  name: 'mdCloudGoogleStartArchive', 
  template: 'mdCloudGoogleStartArchive'
});


Router.route('/google-connect/', {
  name: 'mdCloudGoogleConnectAccount', 
  template: 'mdCloudGoogleConnectAccount'
});

Router.route('/google-show/', {
  name: 'mdCloudGoogleShowPhotos', 
  template: 'mdCloudGoogleShowPhotos'
});

Router.route('/google-finalize/', {
  name: 'mdCloudGoogleFinalizeOrder', 
  template: 'mdCloudGoogleFinalizeOrder'
});

Router.route('/google-complete/', {
  name: 'mdCloudGoogleOrderPlaced', 
  template: 'mdCloudGoogleOrderPlaced'
});

