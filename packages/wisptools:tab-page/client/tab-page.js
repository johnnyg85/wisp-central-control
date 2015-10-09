WtTabPage = {
  show: function(tabId) {
    $('#wt_tab_' + tabId).tab('show');
  },
  disable: function(tabId) {
    $('#wt_tab_' + tabId).prop('disabled', true);
  },
  enable: function(tabId) {
    $('#wt_tab_' + tabId).prop('disabled', false);
  }
}