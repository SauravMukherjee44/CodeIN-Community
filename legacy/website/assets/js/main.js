// let teamsContainer = document.getElementById('testimonials');
// let teamCard = "";

// fetch("assets/js/team.json")
// .then(response => response.json())
// .then(teams => {
//     // console.log(teams);

//     teams.forEach(team => {
//         teamCard += `
//         <div class="item">
//                 <div class="testimonial-item">
//                   <div class="img-thumb">
//                     <img src="./assets/img/team/${team.name}.png" alt="">
//                   </div>
//                   <div class="info">
//                     <h2><a href="#">${team.name}</a></h2>
//                     <h3><a href="#">${team.tag}</a></h3>
//                   </div>

//                   <div class="media-icons">
//                     <a href="${team.socials.github}" target="_blank"><i class="fab fa-github"></i></a>
//                     <a href="${team.socials.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
//                 </div>
                  
//                 </div>
//               </div>`
//     });
//     teamsContainer.innerHTML = teamCard;
// });



(function($) {
  
  "use strict";  

  $(window).on('load', function() {

  /*Page Loader active
  ========================================================*/
  $('#preloader').fadeOut();

  // Sticky Nav
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            $('.scrolling-navbar').addClass('top-nav-collapse');
        } else {
            $('.scrolling-navbar').removeClass('top-nav-collapse');
        }
    });

    // one page navigation 
    $('.navbar-nav').onePageNav({
      currentClass: 'active'
    });

    /* Auto Close Responsive Navbar on Click
    ========================================================*/
    function close_toggle() {
        if ($(window).width() <= 768) {
            $('.navbar-collapse a').on('click', function () {
                $('.navbar-collapse').collapse('hide');
            });
        }
        else {
            $('.navbar .navbar-inverse a').off('click');
        }
    }
    close_toggle();
    $(window).resize(close_toggle);

    /* WOW Scroll Spy
    ========================================================*/
     var wow = new WOW({
      //disabled for mobile
        mobile: false
    });

    wow.init();    

     /* Testimonials Carousel 
    ========================================================*/
    var owl = $("#testimonials");
      owl.owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        center: true,
        margin: 15,
        slideSpeed: 1000,
        stopOnHover: true,
        autoPlay: true,
        responsiveClass: true,
        responsiveRefreshRate: true,
        responsive : {
            0 : {
                items: 1
            },
            768 : {
                items: 2
            },
            960 : {
                items: 3
            },
            1200 : {
                items: 3
            },
            1920 : {
                items: 3
            }
        }
      });  
      

    /* Back Top Link active
    ========================================================*/
      var offset = 200;
      var duration = 500;
      $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
          $('.back-to-top').fadeIn(400);
        } else {
          $('.back-to-top').fadeOut(400);
        }
      });

      $('.back-to-top').on('click',function(event) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: 0
        }, 600);
        return false;
      });

    
      
  });      

}(jQuery));
