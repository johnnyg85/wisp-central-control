
Template.mdCloudGoogleFinalizeOrder.helpers({
  showOrderForm: function() {
    if (Session.get('isCloudConnecting')) {
      return true;
    }
    return false;
  },
  showAccountSize: function() {
    if (Session.get('accountSize')) {
      return true;
    }
    return false;
  },
  accountSize: function() {
    var bytes = Session.get('accountSize');
     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
     if (bytes == 0) return '0 Byte';
     var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
     return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  },
  recentPhotos: function() {
    return Session.get('recentUrls');
  }
});
