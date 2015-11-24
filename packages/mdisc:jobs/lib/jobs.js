
MdJobs = {
  jc:     JobCollection('md_jobs'),
  paused: WtCollection('md_jobs_paused')
};

if (Meteor.isServer) {
  MdJobs.jc.allow({
    // Grant full permission to any authenticated user
    // ToDo: only allow admin role users this access level.
    admin: function (userId, method, params) {
      if (Roles.userIsInRole(userId, ['admin'])) return true;  // is admin
      return false; // everyone else;
    }
  });

  Meteor.startup(function () {
    // Normal Meteor publish call, the server always
    // controls what each client can see
    Meteor.publish('allJobs', function () {
      if (!this.userId) return false; // Not logged in
      if (Roles.userIsInRole(this.userId, ['admin'])) return MdJobs.jc.find({});  // is admin
      return false; // everyone else;
    });

    // Start the queue running
    return MdJobs.jc.startJobServer();
  });

}

if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.subscribe('allJobs');
  });
}