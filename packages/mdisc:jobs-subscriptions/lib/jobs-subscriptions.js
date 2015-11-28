
MdJobsSubscriptions = {
  jc:     JobCollection('md_jobs_subscriptions')
};

if (Meteor.isServer) {
  MdJobsSubscriptions.jc.allow({
    // Grant full permission to any authenticated user
    // ToDo: only allow admin role users this access level.
    admin: function (userId, method, params) {
      if (Roles.userIsInRole(userId, ['admin'])) return true;  // is admin
      return false; // everyone else;
    }
  });

  Meteor.startup(function () {
    if (Meteor.settings.isJobServer || process.env.IS_JOB_SERVER) {
      // Start the queue running
      console.log('Subscription Job Server Started');
      return MdJobsSubscriptions.jc.startJobServer();
    }
  });

}