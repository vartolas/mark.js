'use strict';

const mark = new Mark("#datelineSeparator");
mark.applyFixedPositioning(); // redundant because specifying a selector gives fixed positioning
mark.setTop("220px");
mark.setLeft("80px");
mark.setColours("#FFFFFF", "yellow", "lime", "cyan");
mark.setCurrentHighlighterColour(0); // redundant because we are setting the current colour to be the default colour
