// Set up login services
Meteor.startup(function() {
  ServiceConfiguration.configurations.upsert(
    { service: "google" },
    {
      $set: {
        clientId: Meteor.settings.google.clientId,
        loginStyle: "redirect",
        secret: Meteor.settings.google.secret
      }
    }
  );
});