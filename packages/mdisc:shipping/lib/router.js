Router.route('/shipping/', {
  name: 'mdShipping', 
  template: 'mdShipping'
});

Router.route('/shipping/info/qr', {
  name: 'mdShippingInfoQR', 
  template: 'mdShippingInfoQR'
});

Router.route('/shipping/info/barcode', {
  name: 'mdShippingInfoBarcode', 
  template: 'mdShippingInfoBarcode'
});

Router.route('/shipping/scan/', {
  name: 'mdShippingScan', 
  template: 'mdShippingScan'
});