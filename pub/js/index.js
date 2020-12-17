const NOTE_TEXT = "Click here ^ to try pasting notes like these yourself!"

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
noteContent.appendChild(document.createTextNode(NOTE_TEXT));

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
note.style.left = "20px";
note.style.top = "20px";

const header = document.querySelector("#landingHeader");


// Append the note
note.appendChild(noteContent);
note.appendChild(changeNoteViewBtn);
note.appendChild(deleteNoteBtn);

document.body.appendChild(note);
