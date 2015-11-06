
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

  Meteor.methods({
    downloadArchive: function (archiveId) {
      var job = new Job(MdJobs.jc, 'downloadArchive', 
        {
          archiveId: archiveId
        }
      );
      job.priority('normal').retry({retries: 5, wait: 5*60*1000}).save();
    },
    moveArchiveToNAS: function (server, data) {
      var job = new Job(MdJobs.jc, 'moveArchiveToNAS-' + server, data);
      job.priority('normal').retry({retries: 5, wait: 5*60*1000}).save();
      //TODO: check if moveArchiveToNAS is paused
    },
    recordArchiveOnARU: function (aru, archiveId) {
      var job = new Job(MdJobs.jc, 'recordArchiveOnARU-' + aru, 
        {
          archiveId: archiveId
        }
      );
      job.priority('normal').retry({retries: 5, wait: 5*60*1000}).save();
      Meteor.call('setArchiveStatus', 'Queued', archiveId);
    },
    pauseArchiveToNAS: function () {
      MdJobs.paused.update({jobType: 'moveArchiveToNAS'}, {$set: {paused: true}}, {upsert: true});
      //TODO: find all type moveArchiveToNAS jobs that are waiting or ready then call MdJobs.jc.pauseJobs()
    },
    resumeArchiveToNAS: function () {
      MdJobs.paused.update({jobType: 'moveArchiveToNAS'}, {$set: {paused: true}}, {upsert: false});
      //TODO: find all type moveArchiveToNAS jobs that are waiting or ready then call MdJobs.jc.resumeJobs()
    }
  });

  // Not implemented at this time...
  MdJobs.initAutoCloudArchive = function (archiveId) {
      var job = new Job(MdJobs.jc, 'initAutoCloudArchive', 
        {
          archiveId: archiveId
        }
      );
      job.priority('normal').save();    
  }
}

if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.subscribe('allJobs');
  });
}