WtPowercode = {};

// Add the database connection
if (Meteor.isServer) {

  var mysql = Npm.require('mysql');
  WtPowercode.pool  = mysql.createPool({
    host      : Meteor.settings.powercode.dbHost,
    user      : Meteor.settings.powercode.dbUser,
    password  : Meteor.settings.powercode.dbPass,
    insecureAuth: true
  });

  // MySQL DB query wrapper
  // http://stackoverflow.com/a/26868647
  WtPowercode.query = function () {
    var queryArgs = Array.prototype.slice.call(arguments),
        events = [],
        eventNameIndex = {};

    this.pool.getConnection(function (err, conn) {
        if (err) {
            if (eventNameIndex.error) {
                eventNameIndex.error();
            }
        }
        if (conn) { 
            var q = conn.query.apply(conn, queryArgs);
            q.on('end', function () {
                conn.release();
            });

            events.forEach(function (args) {
                q.on.apply(q, args);
            });
        }
    });

    return {
        on: function (eventName, callback) {
            events.push(Array.prototype.slice.call(arguments));
            eventNameIndex[eventName] = callback;
            return this;
        }
    };   
  }
}

//WtMenu.addDropdown('Powercode', 'fa-cloud', 0);
//WtMenu.addDropdownItem('Powercode', 'Config', 'pc_config', 'fa-wrench', 0);