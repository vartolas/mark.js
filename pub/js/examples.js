'use strict';

// Note that most of the library's DOM manipulation occurs in end-user interactions with the library.
const mark = new Mark("#datelineSeparator");
mark.applyFixedPositioning(); // redundant because specifying a selector gives fixed positioning
mark.setTop("220px");
mark.setLeft("80px");
mark.setColours("#FFFFFF", "yellow", "lime", "#FED8B1");
mark.setCurrentHighlighterColour(0); // redundant because we are setting the current colour to be the default colour