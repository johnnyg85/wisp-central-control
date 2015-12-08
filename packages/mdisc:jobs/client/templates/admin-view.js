var tick = 2500;
var reactiveDate = new ReactiveVar(new Date());
var indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item)
      return i;
  }
  return -1;
};

Meteor.setInterval((function () {
  return reactiveDate.set(new Date());
}), tick);

var timeFormatter = function (time) {
  var now = reactiveDate.get();
  if (Math.abs(time - now) < tick) {
    return "Now";
  } else {
    return moment(time).from(now);
  }
};

Template.registerHelper("relativeTime", function (time) {
  return timeFormatter(time);
});

Template.registerHelper("equals", function (a, b) {
  return a === b;
});
  
Template.mdJobsWorkingAll.helpers({
  jobs: function () {
    return MdJobs.jc.find({status: {$ne:'completed'}}).fetch();
  }
});

Template.mdJobsJobEntry.helpers({
  restartable: function () {
    if (indexOf.call(MdJobs.jc.jobStatusRestartable, this.status) > -1) {
      return true;
    }
    return false;
  },
  pausable: function () {
    if (indexOf.call(MdJobs.jc.jobStatusPausable, this.status) > -1) {
      return true;
    }
    return false;
  },
  cancellable: function () {
    if (indexOf.call(MdJobs.jc.jobStatusCancellable, this.status) > -1) {
      return true;
    }
    return false;
  },
  removable: function () {
    if (indexOf.call(MdJobs.jc.jobStatusRemovable, this.status) > -1) {
      return true;
    }
    return false;
  }
});
