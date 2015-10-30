Template.home.onRendered(function() {

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

    // Append .background-image-holder <img>'s as CSS backgrounds

    $('.background-image-holder').each(function() {
        var imgSrc = $(this).children('img').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('img').hide();
        $(this).css('background-position', '50% 50%');
    });
    
    // Fade in background images
    $('.background-image-holder').each(function() {
      $(this).addClass('fadeIn');
    });


    // Hook up video controls on local video

    $('.local-video-container .play-button').click(function() {
        $(this).toggleClass('video-playing');
        $(this).closest('.local-video-container').find('.background-image-holder').toggleClass('fadeout');
        var video = $(this).closest('.local-video-container').find('video');
        if (video.get(0).paused === true) {
            video.get(0).play();
        } else {
            video.get(0).pause();
        }
    });

    $('video').bind("pause", function() {
        var that = this;
        triggerVid = setTimeout(function() {
            $(that).closest('section').find('.play-button').toggleClass('video-playing');
            $(that).closest('.local-video-container').find('.background-image-holder').toggleClass('fadeout');
            $(that).closest('.modal-video-container').find('.modal-video').toggleClass('reveal-modal');
        }, 100);
    });

    $('video').on('play', function() {
        if (typeof triggerVid === 'number') {
            clearTimeout(triggerVid);
        }
    });

    $('video').on('seeking', function() {
        if (typeof triggerVid === 'number') {
            clearTimeout(triggerVid);
        }
    });
  
    videojs.autoSetup();

    videojs('main_video').ready(function(){
      console.log(this.options()); //log all of the default videojs options
      
       // Store the video object
      var myPlayer = this, id = myPlayer.id();
      // Make up an aspect ratio
      var aspectRatio = 387/580; 

      function resizeVideoJS(){
        var width = document.getElementById(id).parentElement.offsetWidth;
        myPlayer.width(width).height( width * aspectRatio );

      }
      
      // Initialize resizeVideoJS()
      resizeVideoJS();
      // Then on resize call resizeVideoJS()
      window.onresize = resizeVideoJS; 
    });

});