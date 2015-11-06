Template.header.helpers({
  isCloudConnecting: function () {
    if (Session.get('isCloudConnecting')) {
      return true;
    } else {
      return false;
    }
  }
});
