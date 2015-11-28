  Meteor.methods({
    monitorSubscription: function () {
      var userId = Meteor.userId();
      if (!userId) throw new Meteor.Error(401, "Not authorized"); // Check user logged in.
      var job = new Job(MdJobsSubscriptions.jc, 'monitorSubscription', 
        {
          userId: userId
        }
      );
      job.priority('normal').repeat({
          schedule: MdJobsSubscriptions.jc.later.parse.text('every 1 day')
      }).delay(10*1000).save(); // delay 10 seconds to allow for webhook call.
    },
    delaySubscriptionCheck: function (jobId, days) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) throw new Meteor.Error(401, "Not authorized"); // Check if calling user is admin
        var job = MdJobsSubscriptions.jc.getJob(jobId);
        if (job) {
          var date = new Date();
          date.setDate(date.getDate() + days);
          job.pause();
          job.after(date).save();
        }
    }
  });
