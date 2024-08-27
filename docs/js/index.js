const NOTES = [
  {
    text: "Try navigating between note layers! First, \
    expand the pop-up. Then, click on the right arrow next to the 'Note Layer 1' text.",
    top: 70,
    left: 1100
  },
  {
    text: "Try highlighting this webpage's text with Mark.js! Turn the 'Highlighter' \
    on, select a colour, and highlight away.",
    top: 600,
    left: 420
  },
  {
    text: "With Mark.js, you can leave notes like these. Try it! \
    Turn the 'Notetaker' on, write a note, then click anywhere to paste it.",
    top: 630,
    left: 1100
  }
];

// Instantiate a Mark.js instance.
const markInstance = new Mark();
markInstance.setTop("120px");
markInstance.setLeft("120px");
markInstance.setNoteLayerNumber(1);
for (let i = 0; i < NOTES.length; i++) {
  markInstance.addNote({
    left: NOTES[i].left,
    top: NOTES[i].top
  }, NOTES[i].text);
}
markInstance.setNoteLayerNumber(2);
markInstance.addNote({
  left: 400,
  top: 120
}, "Good job! You navigated to 'Note Layer 2'.");
markInstance.setNoteLayerNumber(1);

markInstance.setHighlighterColours("yellow", "cyan", "#EECEEE", "lime");
markInstance.minimize();
markInstance.useDarkTheme();
