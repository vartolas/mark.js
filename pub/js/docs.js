const gettingStartedLink = document.querySelector("#gettingStartedLink");
gettingStartedLink.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#gettingStartedHeader").offset().top - 70}, 1000)
});

const apiLink = document.querySelector("#apiLink");
apiLink.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#apiHeader").offset().top - 70}, 1000)
});
