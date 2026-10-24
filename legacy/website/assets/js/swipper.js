var swiper = new Swiper("#testimonials-slider .swiper", {
  // Optional parameters
  loop: true,
  slidesPerView: 3,
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    // when window width is <= 320px
    300: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // when window width is <= 480px
    480: {
      slidesPerView: 1,
      spaceBetween: 80,
    },
    // when window width is <= 640px
    640: {
      slidesPerView: 2,
      spaceBetween: 80,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  }
});

