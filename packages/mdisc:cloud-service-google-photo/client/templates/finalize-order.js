
Template.mdCloudGoogleFinalizeOrder.helpers({
  tabData: {
    showTitle: false,
    title: "Order",
    pages: [
      {
        tabName: "1. ARCHIVE DETAILS",
        tabId: "arch_name",
        tabTemplate: "mdArchiveName",
        tabOpen: "true"
      },{
        tabName: "2. CHOOSE SUBSCRIPTION PLAN",
        tabId: "arch_plan",
        tabTemplate: "mdArchivePlan",
        tabOpen: "false"
      },{
        tabName: "3. YOUR SHIPPING INFO",
        tabId: "arch_shipping",
        tabTemplate: "mdArchiveShipping",
        tabOpen: "false"
      },{
        tabName: "4. ENTER PAYMENT DETAILS",
        tabId: "arch_pay",
        tabTemplate: "mdArchivePayment",
        tabOpen: "false"
      },{
        tabName: "5. REVIEW YOUR ORDER",
        tabId: "arch_review",
        tabTemplate: "mdArchiveReview",
        tabOpen: "false"
      }
    ]
  }
});
