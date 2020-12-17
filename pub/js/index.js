const NOTES = [
  {
    text: "Switch between layers...",
    top: "250px",
    left: "1030px"
  },
  {
    text: "Try highlighting this webpage's text using Mark.js! Turn the 'Highlighter' \
    on, select a colour, and highlight away.",
    top: "25px",
    left: "370px"
  },
  {
    text: "Mark.js allows end-users to leave notes like these. Try it yourself! \
    Turn the 'Notetaker' on, write your note, and then click anywhere to paste it.",
    top: "500px",
    left: "500px"
  }
];

// Paste the initial set of the notes on the landing page.
for (let i = 0; i < NOTES.length; i++) {
  const note = document.createElement("div");
  note.classList.add("note");
  note.classList.add("maximizedNote");

  // Define functionality for deleting notes.
  const deleteNoteBtn = document.createElement("div");
  deleteNoteBtn.classList.add("noteButton");
  deleteNoteBtn.classList.add("deleteNoteButton");
  deleteNoteBtn.appendChild(document.createTextNode("✕"));
  deleteNoteBtn.addEventListener("click", e => {
    note.parentElement.removeChild(note);
  });

  // Create the note content.
  const noteContent = document.createElement("div");
  noteContent.classList.add("noteContent");
  noteContent.classList.add("maximizedNoteContent");
  noteContent.appendChild(document.createTextNode(NOTES[i].text));

  // Define functionality for changing note view (maximizing/minimizing).
  const changeNoteViewBtn = document.createElement("div");
  changeNoteViewBtn.classList.add("noteButton");
  changeNoteViewBtn.classList.add("changeNoteViewButton");
  changeNoteViewBtn.classList.add("changeNoteViewButtonMaximized");
  changeNoteViewBtn.appendChild(document.createTextNode("-"));
  changeNoteViewBtn.addEventListener("click", e => {
    if (changeNoteViewBtn.innerText == "-") {
      // Minimize the note's view.
      note.classList.remove("maximizedNote");
      note.classList.add("minimizedNote");

      noteContent.classList.remove("maximizedNoteContent");
      noteContent.classList.add("minimizedNoteContent");

      changeNoteViewBtn.removeChild(changeNoteViewBtn.childNodes[0]);
      changeNoteViewBtn.appendChild(document.createTextNode("+"));
      changeNoteViewBtn.classList.remove("changeNoteViewButtonMaximized");
      changeNoteViewBtn.classList.add("changeNoteViewButtonMinimized");
    } else {
      // Maximize the note's view.
      note.classList.remove("minimizedNote");
      note.classList.add("maximizedNote");

      noteContent.classList.remove("minimizedNoteContent");
      noteContent.classList.add("maximizedNoteContent");

      changeNoteViewBtn.removeChild(changeNoteViewBtn.childNodes[0]);
      changeNoteViewBtn.appendChild(document.createTextNode("-"));
      changeNoteViewBtn.classList.remove("changeNoteViewButtonMinimized");
      changeNoteViewBtn.classList.add("changeNoteViewButtonMaximized");
    }
  });

  // Place the note with the library title.
  note.style.left = NOTES[i].left;
  note.style.top = NOTES[i].top;

  const header = document.querySelector("#landingHeader");

  // Append the note
  note.appendChild(noteContent);
  note.appendChild(changeNoteViewBtn);
  note.appendChild(deleteNoteBtn);

  document.body.appendChild(note);
}

// Instantiate a Mark.js instance.
const markInstance = new Mark();
markInstance.setTop("150px");
markInstance.setLeft("80px");
markInstance.setHighlighterColours("yellow", "cyan", "#EECEEE", "lime");
