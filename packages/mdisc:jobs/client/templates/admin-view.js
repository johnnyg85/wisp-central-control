
Template.mdJobsWorkingAll.helpers({
  jobs: function () {
    return MdJobs.jc.find({status: {$ne:'completed'}}).fetch();
  }
});
