Router.map(function() {
  this.route('/admin/roles', {
    path: '/admin/roles',
    name: 'rolesUser', 
    template: 'wtRolesUser',

    onBeforeAction: function() {
      user = Meteor.user();
      if(!Roles.userIsInRole(user, ['admin'])) {
       
        return;
      }
   
     this.next();
    }
  })
});

