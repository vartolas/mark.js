const tutorialLink = document.querySelector("#tutorialLink");
tutorialLink.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#tutorialHeader").offset().top - 70}, 1000)
});


const example1Link = document.querySelector("#example1Link");
example1Link.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#example1Header").offset().top - 70}, 1000)
});

const example2Link = document.querySelector("#example2Link");
example2Link.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#example2Header").offset().top - 70}, 1000)
});

const markInstance = new Mark("#tutorialDescription");
markInstance.setTop("200px");
markInstance.setLeft("50px");
markInstance.addNote({
  top: 20,
  left: 20
}, "You're currently on 'Note Layer 1'. Change the note layer by using \
the pop-up below!", "#tutorialHeader");
markInstance.setNoteLayerNumber(2);
markInstance.addNote({
  top: 20,
  left: 20
}, "Good job! You've navigated to the second note layer!", "#tutorialHeader");
markInstance.setNoteLayerNumber(1);


const markInstance1 = new Mark("#bankStatementTable");
markInstance1.setBottom("-150px")
markInstance1.setRight("0")
markInstance1.minimize();
markInstance1.useDarkTheme();
markInstance1.freeze();
