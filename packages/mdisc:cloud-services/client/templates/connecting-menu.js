Template.mdCloudServiceConnectingStepsMenu.helpers({
  color: function(step) {
    var curStep = Session.get('cloudConnectingStep');
    if (step == curStep) return "current";
    if (step < curStep) return "done";
  }
});