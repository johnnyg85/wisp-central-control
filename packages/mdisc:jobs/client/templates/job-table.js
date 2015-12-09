var indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item)
      return i;
  }
  return -1;
};

Template.mdJobsJobTable.helpers({
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

Template.mdJobsJobEntry.events({
  'click .pauseBtn': function () {
    MdJobs.jc.getJob(this._id, function (err, res) {
      if (res) {
        res.pause(function (e, r) {
          WtGrowl.success('Job has been paused.');
        });
      } else {
        console.log(err);
        WtGrowl.fail('An error has occurred.');
      }
    })
  },
  'click .resumeBtn': function () {
    MdJobs.jc.getJob(this._id, function (err, res) {
      if (res) {
        res.resume(function (e, r) {
          WtGrowl.success('Job has been resumed.');
        });
      } else {
        console.log(err);
        WtGrowl.fail('An error has occurred.');
      }
    })
  },
  'click .restartBtn': function () {
    MdJobs.jc.getJob(this._id, function (err, res) {
      if (res) {
        res.restart(function (e, r) {
          WtGrowl.success('Job has been restarted.');
        });
      } else {
        console.log(err);
        WtGrowl.fail('An error has occurred.');
      }
    })
  },
  'click .rerunBtn': function () {
    MdJobs.jc.getJob(this._id, function (err, res) {
      if (res) {
        res.rerun(function (e, r) {
          WtGrowl.success('Job has been rerun.');
        });
      } else {
        console.log(err);
        WtGrowl.fail('An error has occurred.');
      }
    })
  },
  'click .cancelBtn': function () {
    MdJobs.jc.getJob(this._id, function (err, res) {
      if (res) {
        res.cancel(function (e, r) {
          WtGrowl.success('Job has been canceled.');
        });
      } else {
        console.log(err);
        WtGrowl.fail('An error has occurred.');
      }
    })
  },
  'click .removeBtn': function () {
    MdJobs.jc.getJob(this._id, function (err, res) {
      if (res) {
        res.remove(function (e, r) {
          WtGrowl.success('Job has been removed.');
        });
      } else {
        console.log(err);
        WtGrowl.fail('An error has occurred.');
      }
    })
  }
});
