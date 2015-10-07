Template.mdCreateShippingLabel.helpers({
  tabData: {
    showTitle: true,
    title: "Shipping Label",
    pages: [
      {
        tabName: "Shipping Address",
        tabId: "md_shipping_address",
        tabTemplate: "mdShippingAddress"
      },
      {
        tabName: "Shipping Parcel",
        tabId: "md_shipping_parcel",
        tabTemplate: "mdParcel",
        
      },
      {
        tabName: "Shipping Label",
        tabId: "md_shipping_label",
        tabTemplate: "mdShippinglabel",
        
      }
    ]
  }
});