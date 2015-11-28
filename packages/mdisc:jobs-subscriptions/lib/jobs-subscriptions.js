
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
    if (Meteor.settings.mdisc.isJobServer) {
      // Start the queue running
      return MdJobsSubscriptions.jc.startJobServer();
    }
  });

}