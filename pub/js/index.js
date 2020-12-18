const NOTES = [
  {
    text: "Try navigating between note layers!",
    top: 140,
    left: 900
  },
  {
    text: "Try highlighting this webpage's text with Mark.js! Turn the 'Highlighter' \
    on, select a colour, and highlight away.",
    top: 90,
    left: 420
  },
  {
    text: "With Mark.js, you can leave notes like these. Try it! \
    Turn the 'Notetaker' on, write a note, then click anywhere to paste it.",
    top: 650,
    left: 600
  }
];

// Instantiate a Mark.js instance.
const markInstance = new Mark();
markInstance.setTop("150px");
markInstance.setLeft("80px");
markInstance.setNoteLayerNumber(1);
for (let i = 0; i < NOTES.length; i++) {
  markInstance.addNote({
    left: NOTES[i].left,
    top: NOTES[i].top
  }, NOTES[i].text);
}
markInstance.setHighlighterColours("yellow", "cyan", "#EECEEE", "lime");
markInstance.setPopUpBackgroundColour("#FFFFF2");
markInstance.setPopUpTextColour("#555555");
