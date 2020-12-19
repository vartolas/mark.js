const arrow = document.querySelector(".scrollDownArrow");
arrow.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$(".scrollDownArrow").offset().top}, 1000)
})
