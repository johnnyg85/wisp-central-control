  Meteor.methods({
    monitorSubscription: function () {
      var userId = Meteor.userId();
      var date = new Date();
      date.setDate(date.getDate() + 25); // Start checking 25 days from now. The first archive is scheduled when order placed.
      var job = new Job(MdJobsSubscriptions.jc, 'monitorSubscription', 
        {
          userId: userId
        }
      );
      job.priority('normal').repeat({
          schedule: MdJobsSubscriptions.jc.later.parse.text('every day')
      }).after(date).save();
    }
  });
