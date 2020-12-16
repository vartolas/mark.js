'use strict';

// Note that most of the library's DOM manipulation occurs in end-user interactions with the library.
const mark = new Mark("#datelineSeparator");
mark.applyFixedPositioning(); // redundant because specifying a selector gives fixed positioning
mark.setTop("220px");
mark.setLeft("80px");
mark.setColours("yellow", "cyan", "#EECEEE", "lime");
mark.setPopUpBackgroundColour("black");
mark.setPopUpTextColour("white");
mark.setPopUpBorderColour("red");
mark.setCurrentHighlighterColour(0); // redundant because we are setting the current colour to be the default colour
mark.setOffButtonBackgroundColour("black");
mark.setOnButtonBackgroundColour("red");


// const mark = new Mark("#datelineSeparator");
// mark.applyFixedPositioning(); // redundant because specifying a selector gives fixed positioning
// mark.setTop("220px");
// mark.setLeft("80px");
// mark.setColours("yellow", "cyan", "#EECEEE", "lime");
// mark.setPopUpBackgroundColour("#FFFFF8");
// mark.setPopUpTextColour("#555555");
// mark.setPopUpBorderColour("#555555");
// mark.setCurrentHighlighterColour(0); // redundant because we are setting the current colour to be the default colour
