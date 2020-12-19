const example1Link = document.querySelector("#example1Link");
example1Link.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#example1Header").offset().top - 70}, 1000)
});

const example2Link = document.querySelector("#example2Link");
example2Link.addEventListener("click", e => {
  $('body, html').animate({scrollTop:$("#example2Header").offset().top - 70}, 1000)
});

const markInstance1 = new Mark("#bankStatementTable");
markInstance1.setBottom("-150px")
markInstance1.setRight("0")
markInstance1.minimize();
markInstance1.useDarkTheme();
markInstance1.freeze();
