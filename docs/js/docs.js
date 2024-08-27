// Using jquery:
const gettingStartedLink = document.querySelector("#gettingStartedLink");
gettingStartedLink.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#gettingStartedHeader").offset().top - 70}, 1000)
});

const apiLink = document.querySelector("#apiLink");
apiLink.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#apiHeader").offset().top - 70}, 1000)
});

const markInstance = new Mark();
// colours that contrast well with whitish-yellow background
markInstance.setHighlighterColours("orange", "lime", "pink", "cyan");

// fix to top-right of viewport
markInstance.setTop("80px");
markInstance.setRight("20px");

// initially minimize
markInstance.minimize();

// leave note for user to use the pop-up
markInstance.addNote({
  top: 100,
  left: 100
}, "Use the Mark.js pop-up located at the top-right of the screen to take notes!");
