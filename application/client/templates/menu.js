Template.menu.onRendered(function() {

  // Fade nav bar
  $(window).scroll(function() {
    if ($(window).scrollTop() > 0) {
      $('nav').addClass('fixed');
    } else {
      $('nav').removeClass('fixed');
    }
  });

  // Close mobile menu once link is clicked
  $('.menu li a').click(function(){
    if($('nav').hasClass('nav-open')){
    $('nav').removeClass('nav-open');
    }
  });

  // Mobile nav
  $('.mobile-toggle').click(function() {
    $(this).closest('nav').toggleClass('nav-open');
    if ($(this).closest('nav').hasClass('nav-3')) {
      $(this).toggleClass('active');
    }
  });

});

Template.menu.events({
  'click #at-nav-sign-out': function(e, t) {
    e.preventDefault();
    Meteor.logout();
  }
});

