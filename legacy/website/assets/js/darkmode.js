// icon feather
feather.replace()
// =======================================================
// toggler
$('.menu-toggler input').click(function () {
    $('.nav').toggleClass('appear');
});
// =======================================================
// darkmode
$('.darkmode button').click(function () {
    $('body').toggleClass('dark');
    $('.feather.sun').toggleClass('appear');
    $('.feather.moon').toggleClass('hide');
    $('.darkmode').toggleClass('whitebg');
    $('.darkmode button').toggleClass('wh');
    $('nav a').toggleClass('whitecr');
    $('.menu-toggler span').toggleClass('whiteburger');
    $('p').toggleClass('whitecr');
    $('h1').toggleClass('whitecr');
    $('h2').toggleClass('whitecr');
    $('h3').toggleClass('whitecr');
    $('h4').toggleClass('whitecr');
    $('h5').toggleClass('whitecr');
    $(".services-item .services-content h3 a ").toggleClass('whitecr');
    $('ul li').toggleClass('whitecr');
    $('.panelFAQs').toggleClass('bgdark');
    $('.FAQs_section').toggleClass('darkFAQ');
    $('.services-item').toggleClass('dark');
    $('.card').toggleClass('dark');
    $('.testimonial-item').toggleClass('testimonial-item_dark');
    $('.testimonial').toggleClass('testimonial_dark');
    $('.card').toggleClass('testimonial_dark');
    $('.testimonial-community').toggleClass('testimonial_dark');
    $('.blog_content').toggleClass('pure_dark');
    $('.description').toggleClass('whitecr');
    $('.head').toggleClass('whitecr');
    $('.contactSection').toggleClass('dark');

});