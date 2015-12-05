Router.route('/google-start/', {
  name: 'mdCloudGoogleStartArchive', 
  template: 'mdCloudGoogleStartArchive'
});



Router.route('/google-connect/', {
  name: 'mdCloudGoogleConnectAccount', 
  template: 'mdCloudGoogleConnectAccount'
});

Router.route('/google-connect-login/', {
  name: 'mdCloudGoogleConnectCheckLogin', 
  template: 'mdCloudGoogleConnectCheckLogin'
});

Router.route('/google-show/', {
  name: 'mdCloudGoogleShowPhotos', 
  template: 'mdCloudGoogleShowPhotos'
});

Router.route('/google-no-photos/', {
  name: 'mdCloudGoogleNoPhotos', 
  template: 'mdCloudGoogleNoPhotos'
});

Router.route('/google-finalize/', {
  name: 'mdCloudGoogleFinalizeOrder', 
  template: 'mdCloudGoogleFinalizeOrder'
});

Router.route('/google-complete/', {
  name: 'mdCloudGoogleOrderPlaced', 
  template: 'mdCloudGoogleOrderPlaced'
});

