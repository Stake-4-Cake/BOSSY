const screenWidth = screen.width;
var navbarheight;

$(document).ready(function () {
  const noticeBannerHeight =
    $(".notice_banner").length > 0 ? $(".notice_banner").height() : 0;

  navbarheight = $("nav").height() + 10 + noticeBannerHeight; // get height of nav bar  notice bar

  // Nav link click event listener
  $(".nav_li a").click(function (e) {
    e.preventDefault();
    moveToSection(this.hash);
  });

  $(".hamburger_menu").on("click", toggleMobileMenu);

  activateNavbarBg();
});

function moveToSection(targetSection) {
  closeMenu();
  var target = $(targetSection);
  window.location.hash = targetSection;

  $("html, body").animate(
    {
      scrollTop: target.offset().top - navbarheight, // scroll to position minus height of navbar
    },
    100
  );
  return false;
}

function activateNavbarBg() {
  const scrollPos = $(window).scrollTop();

  if (scrollPos > 100) {
    $("nav").addClass("navbar_scroll");
    $(".nav_logo").removeClass("nav_logo_hidden");
  } else {
    $("nav").removeClass("navbar_scroll");
    $(".nav_logo").addClass("nav_logo_hidden");
  }
}

$(window).on("load", function () {
  // Scroll to initial section
  if (window.location.hash) {
    moveToSection(window.location.hash);
  }
});

$(window).on("scroll", activateNavbarBg);

function toggleMobileMenu() {
  $(".hamburger_menu").toggleClass("active");
  $(".nav_menu").toggleClass("active");
}

function closeMenu() {
  $(".hamburger_menu").removeClass("active");
  $(".nav_menu").removeClass("active");
}
