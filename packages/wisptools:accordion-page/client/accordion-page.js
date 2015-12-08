WtAccordionPage = {
  show: function(tabId) {
    $('#wt_heading_' + tabId).find('a').click();
  },
  disable: function(tabId) {
    $('#wt_heading_' + tabId).find('a').prop('disabled', true);
  },
  enable: function(tabId) {
    $('#wt_heading_' + tabId).find('a').prop('disabled', false);
  }  
}