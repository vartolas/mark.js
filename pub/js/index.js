const NOTES = [
  {
    text: "Switch between layers...",
    top: 250,
    left: 1030
  },
  {
    text: "Try highlighting this webpage's text using Mark.js! Turn the 'Highlighter' \
    on, select a colour, and highlight away.",
    top: 25,
    left: 370
  },
  {
    text: "Mark.js allows end-users to leave notes like these. Try it yourself! \
    Turn the 'Notetaker' on, write your note, and then click anywhere to paste it.",
    top: 500,
    left: 500
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
