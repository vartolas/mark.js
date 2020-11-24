function handleColourClick(markInstance, colourObject, otherColourObjects, colour) {
  otherColourObjects.forEach(item => {
    if (item.classList.contains("activeColourBorder")) {
      item.classList.remove("activeColourBorder");
      item.classList.add("inactiveColourBorder");
    }
  });


  if (markInstance.colour !== colour) {
    colourObject.classList.remove("inactiveColourBorder");
    colourObject.classList.add("activeColourBorder");
  }
  markInstance.colour = colour;
}

function createDefaultPopUp(markInstance) {
  const popUp = document.createElement("div");
  popUp.classList.add("popUp");

  // Create the highlight section.
  const highlightSection = document.createElement("div");
  highlightSection.classList.add("popUpSection");
  highlightSection.classList.add("highlightSection");

  const highlightSectionHeader = document.createElement("h4");
  highlightSectionHeader.classList.add("sectionHeader");
  highlightSectionHeader.appendChild(document.createTextNode("Highlighter Settings"));

  const yellow = document.createElement("div");
  yellow.classList.add("highlighterColour");
  yellow.classList.add("yellow");
  yellow.classList.add("activeColourBorder");

  const cyan = document.createElement("div");
  cyan.classList.add("highlighterColour");
  cyan.classList.add("cyan");
  cyan.classList.add("inactiveColourBorder");

  const lime = document.createElement("div");
  lime.classList.add("highlighterColour");
  lime.classList.add("lime");
  lime.classList.add("inactiveColourBorder");

  const none = document.createElement("div");
  none.classList.add("highlighterColour");
  none.classList.add("none");
  none.classList.add("inactiveColourBorder");
  const noneChild = document.createElement("span");
  noneChild.appendChild(document.createTextNode("OFF"));
  none.appendChild(noneChild);

  yellow.addEventListener("click", e => handleColourClick(markInstance, yellow, [cyan, lime, none], "yellow"));
  cyan.addEventListener("click", e => handleColourClick(markInstance, cyan, [yellow, lime, none], "cyan"));
  lime.addEventListener("click", e => handleColourClick(markInstance, lime, [yellow, cyan, none], "lime"));
  none.addEventListener("click", e => handleColourClick(markInstance, none, [yellow, cyan, lime], "none"));

  highlightSection.appendChild(highlightSectionHeader);
  highlightSection.appendChild(yellow);
  highlightSection.appendChild(cyan);
  highlightSection.appendChild(lime);
  highlightSection.appendChild(none);

  // Create the undo button.
  const undoBtn = document.createElement("div");
  undoBtn.classList.add("popUpSection");
  undoBtn.classList.add("undoBtn");
  undoBtn.appendChild(document.createTextNode("Undo"));

  // Create the reset button.
  const resetBtn = document.createElement("div");
  resetBtn.classList.add("popUpSection");
  resetBtn.classList.add("resetBtn");
  resetBtn.appendChild(document.createTextNode("Reset"));

  // Add the 3 children to the popUp div.
  popUp.appendChild(highlightSection);
  popUp.appendChild(undoBtn);
  popUp.appendChild(resetBtn);

  return { popUp, highlightSection, undoBtn, resetBtn };
}

function Mark(selector) {
  this.highlights = [];
  this.colour = "yellow";

  const { popUp, highlightSection, undoBtn, resetBtn } = createDefaultPopUp(this);
  this.popUp = popUp;
  this.highlightSection = highlightSection;
  this.undoBtn = undoBtn;
  this.resetBtn = resetBtn;

  this.element = document.querySelector(selector);
  this.element.appendChild(popUp);
}

function hidePopUp() {
  if (this.popUp.parentElement == null) return;

  this.element.removeChild(popUp);
}

function showPopUp() {
  if (this.popUp.parentElement == null) {
    this.element.appendChild(popUp);
  }
}

function setPosition(top, left) {
  this.popUp.style.top = top;
  this.popUp.style.left = left;
}

function setHighlighterColour(colour) {
  // if (colour is not valid) throw Error()
  // else {
  //
  // }
}

Mark.prototype = {
  setHighlighterColour,
  setPosition,
  hidePopUp,
  showPopUp
}
