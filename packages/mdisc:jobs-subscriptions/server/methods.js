  Meteor.methods({
    monitorSubscription: function () {
      var userId = Meteor.userId();
      var job = new Job(MdJobsSubscriptions.jc, 'monitorSubscription', 
        {
          userId: userId
        }
      );
      job.priority('normal').repeat({
          schedule: MdJobsSubscriptions.jc.later.parse.text('every 1 minute')
      }).save();
    },
    delaySubscriptionCheck: function (jobId, days) {
        var job = MdJobsSubscriptions.jc.getJob(jobId);
        if (job) {
          var date = new Date();
          date.setDate(date.getDate() + days); // Start checking again after 25 days.
          job.pause();
          job.after(date).save();
        }
    }
  });
