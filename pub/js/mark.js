//////////////////////////////
//// Constant Definitions ////
//////////////////////////////

const DEFAULT_COLOUR0 = "yellow";
const DEFAULT_COLOUR1 = "cyan";
const DEFAULT_COLOUR2 = "lime";
const DEFAULT_COLOUR3 = "#FFBBBB";

const TURN_ON_BTN_TEXT = "Off";
const TURN_OFF_BTN_TEXT = "On";

const INACTIVE_NOTE_BTN_TEXT = "Paste note";
const ACTIVE_NOTE_BTN_TEXT = "Cancel";
const DEFAULT_VIEW = 0;
const COLLAPSED_VIEW = 1;
const HIDDEN_VIEW = 2;


////////////////////////////////////////
//// Helpers for createDefaultPopUp ////
////////////////////////////////////////

function setInitialSwitchAppearance(switchElement, on) {
  if (on) {
    switchElement.classList.add("turnOffBtn");
    switchElement.appendChild(document.createTextNode(TURN_OFF_BTN_TEXT));
  } else {
    switchElement.classList.add("turnOnBtn");
    switchElement.appendChild(document.createTextNode(TURN_ON_BTN_TEXT));
  }
}

function handleHighlighterSwitchClick(markInstance, highlighterSwtich, notetakerSwtich, colourObjects) {
  // Edit state and view of the highlighter section wrt to if it is being turned off or on.
  markInstance.highlighterIsOn = !markInstance.highlighterIsOn;

  // Change the appearance of the highlighter on/off switch.
  if (markInstance.highlighterIsOn) {
    highlighterSwtich.classList.remove("turnOnBtn");
    highlighterSwtich.classList.add("turnOffBtn");
    highlighterSwtich.removeChild(highlighterSwtich.childNodes[0]);
    highlighterSwtich.appendChild(document.createTextNode(TURN_OFF_BTN_TEXT));
  } else {
    highlighterSwtich.classList.remove("turnOffBtn");
    highlighterSwtich.classList.add("turnOnBtn");
    highlighterSwtich.removeChild(highlighterSwtich.childNodes[0]);
    highlighterSwtich.appendChild(document.createTextNode(TURN_ON_BTN_TEXT));
  }

  // Change the appearance of the highlighter colour buttons.
  colourObjects.forEach((obj, i) => {
    if (markInstance.highlighterIsOn) {
      if (markInstance.activeColourIndex === i) {
        obj.classList.remove("inactiveColourBorder");
        obj.classList.add("activeColourBorder");
      }
    } else {
      if (markInstance.activeColourIndex === i) {
        obj.classList.remove("activeColourBorder");
        obj.classList.add("inactiveColourBorder");
      }
    }

  });

  // Edit state and view of the highlighter section if it is being turned off as a result
  // of turning the highlighter on.
  if (notetakerSwtich && markInstance.notetakerIsOn) {
    markInstance.notetakerIsOn = false;

    setOffNotetakerSwtichAppearance(notetakerSwtich)
  }
}

function setOffNotetakerSwtichAppearance(notetakerSwtich) {
  notetakerSwtich.classList.remove("turnOffBtn");
  notetakerSwtich.classList.add("turnOnBtn");
  notetakerSwtich.removeChild(notetakerSwtich.childNodes[0]);
  notetakerSwtich.appendChild(document.createTextNode(TURN_ON_BTN_TEXT));
}

function setOnNotetakerSwtichAppearance(notetakerSwtich) {
  notetakerSwtich.classList.remove("turnOnBtn");
  notetakerSwtich.classList.add("turnOffBtn");
  notetakerSwtich.removeChild(notetakerSwtich.childNodes[0]);
  notetakerSwtich.appendChild(document.createTextNode(TURN_OFF_BTN_TEXT));
}

function handleNotetakerSwtichClick(markInstance, highlighterSwtich, notetakerSwtich, colourObjects) {
  // Turn off the highlighter function if it is on. We must turn on the notetaker AFTER clicking the
  // highlighter switch, or else the highlighter switch click will turn off the notetaker immediately.
  if (markInstance.highlighterIsOn) {
    handleHighlighterSwitchClick(markInstance, highlighterSwtich, notetakerSwtich, colourObjects);
  }

  markInstance.notetakerIsOn = !markInstance.notetakerIsOn;

  if (markInstance.notetakerIsOn) {
    setOnNotetakerSwtichAppearance(notetakerSwtich);
  } else {
    setOffNotetakerSwtichAppearance(notetakerSwtich);
  }
}

function handleColourClick(markInstance, colourObject, otherColourObjects, newActiveColourIndex) {
  if (!markInstance.highlighterIsOn) {
    return;
  }

  otherColourObjects.forEach(item => {
    if (item.classList.contains("activeColourBorder")) {
      item.classList.remove("activeColourBorder");
      item.classList.add("inactiveColourBorder");
    }
  });

  if (markInstance.activeColourIndex !== newActiveColourIndex) {
    colourObject.classList.remove("inactiveColourBorder");
    colourObject.classList.add("activeColourBorder");
  }
  markInstance.activeColourIndex = newActiveColourIndex;
}

function createHighlighterColourDiv(i, markInstance) {
  const colour = document.createElement("div");
  colour.classList.add("highlighterColour");
  colour.style.backgroundColor = markInstance.colours[i];
  if (i === markInstance.activeColourIndex && markInstance.highlighterIsOn) {
    colour.classList.add("activeColourBorder");
  } else {
    colour.classList.add("inactiveColourBorder");
  }

  return colour
}

function handleUndoButtonClick(markInstance) {
    if (markInstance.highlightsAndNotes.length === 0) {
      return;
    }

    const lastElement = markInstance.highlightsAndNotes.pop();
    removeElementFromDOM(lastElement);
}

function handleChangeViewButtonClick(markInstance) {
  markInstance.displayIndex = (markInstance.displayIndex + 1) % markInstance.displays.length;
  resetPopUp.call(markInstance);
}

function switchToDefaultView(markInstance) {
  const { popUp, noteTextarea } = createDefaultPopUp(markInstance);
  markInstance.popUp = popUp;
  markInstance.nodeTextarea = nodeTextarea;
}

function createDefaultPopUp(markInstance) {
  const popUp = document.createElement("div");
  popUp.classList.add("popUp");
  popUp.classList.add("width200px");
  popUp.classList.add("paddingTop10px");

  // Create the highlight section header.
  const highlightSectionHeader = document.createElement("h3");
  highlightSectionHeader.appendChild(document.createTextNode("Highlighter"));
  highlightSectionHeader.classList.add("sectionHeader");

  // Create the highlight section.
  const highlightSection = document.createElement("div");
  highlightSection.classList.add("popUpSection");
  highlightSection.classList.add("highlightSection");

  const highlightColourBoxHeader = document.createElement("h4");
  highlightColourBoxHeader.classList.add("boxHeader");
  highlightColourBoxHeader.appendChild(document.createTextNode("Highlighter Colour"));

  const colour0 = createHighlighterColourDiv(0, markInstance);
  const colour1 = createHighlighterColourDiv(1, markInstance);
  const colour2 = createHighlighterColourDiv(2, markInstance);
  const colour3 = createHighlighterColourDiv(3, markInstance);

  colour0.addEventListener("click", e => handleColourClick(markInstance, colour0, [colour1, colour2, colour3], 0));
  colour1.addEventListener("click", e => handleColourClick(markInstance, colour1, [colour0, colour2, colour3], 1));
  colour2.addEventListener("click", e => handleColourClick(markInstance, colour2, [colour0, colour1, colour3], 2));
  colour3.addEventListener("click", e => handleColourClick(markInstance, colour3, [colour0, colour1, colour2], 3));

  highlightSection.appendChild(highlightColourBoxHeader);
  highlightSection.appendChild(colour0);
  highlightSection.appendChild(colour1);
  highlightSection.appendChild(colour2);
  highlightSection.appendChild(colour3);

  // Create an on/off switch for the highlighter.
  // Give the switch an onClick listner below, after the noteSwitch is defined.
  const highlighterSwtich = document.createElement("div");
  highlighterSwtich.classList.add("popUpSection");
  setInitialSwitchAppearance(highlighterSwtich, markInstance.highlighterIsOn);

  // Create the note section header.
  const noteSectionHeader = document.createElement("h3");
  noteSectionHeader.appendChild(document.createTextNode("Notetaker"));
  noteSectionHeader.classList.add("sectionHeader");
  noteSectionHeader.classList.add("marginTop20px");

  // Create the note section.
  const noteSection = document.createElement("div");
  noteSection.classList.add("popUpSection");
  noteSection.classList.add("noteSection");

  const noteContentBoxHeader = document.createElement("h4");
  noteContentBoxHeader.appendChild(document.createTextNode("Note Content"));
  noteContentBoxHeader.classList.add("boxHeader");

  const noteTextarea = document.createElement("textarea");
  noteTextarea.setAttribute("placeholder", "Type your note here...");

  noteSection.appendChild(noteContentBoxHeader);
  noteSection.appendChild(noteTextarea);

  // Create a on/off switch for the notetaker.
  const notetakerSwitch = document.createElement("div");
  notetakerSwitch.classList.add("popUpSection");
  setInitialSwitchAppearance(notetakerSwitch, markInstance.notetakerIsOn);
  highlighterSwtich.addEventListener("click", e => handleHighlighterSwitchClick(markInstance, highlighterSwtich, notetakerSwitch, [colour0, colour1, colour2, colour3]));
  notetakerSwitch.addEventListener("click", e => handleNotetakerSwtichClick(markInstance, highlighterSwtich, notetakerSwitch, [colour0, colour1, colour2, colour3]));

  // Create the eraser section header.
  const eraserSectionHeader = document.createElement("h3");
  eraserSectionHeader.appendChild(document.createTextNode("Eraser"));
  eraserSectionHeader.classList.add("sectionHeader");
  eraserSectionHeader.classList.add("marginTop20px");

  // Create an undo button.
  const undoBtn = document.createElement("div");
  undoBtn.classList.add("popUpSection");
  undoBtn.classList.add("undoBtn");
  undoBtn.appendChild(document.createTextNode("Undo"));
  undoBtn.addEventListener("click", e => handleUndoButtonClick(markInstance));

  // Create a reset button.
  const resetBtn = document.createElement("div");
  resetBtn.classList.add("popUpSection");
  resetBtn.classList.add("resetBtn");
  resetBtn.appendChild(document.createTextNode("Reset"));
  resetBtn.addEventListener("click", e => {
    while (markInstance.highlightsAndNotes.length > 0) {
      removeElementFromDOM(markInstance.highlightsAndNotes.pop());
    }
  });

  // Create a "change view" button.
  const changeViewBtn = document.createElement("div");
  changeViewBtn.classList.add("changeViewButton");
  const spanText = document.createElement("span");
  spanText.classList.add("minusSignPosition");
  spanText.appendChild(document.createTextNode("-"));
  changeViewBtn.appendChild(spanText);
  changeViewBtn.addEventListener("click", e => handleChangeViewButtonClick(markInstance));

  // Add children to the popUp div.
  popUp.appendChild(highlightSectionHeader);
  popUp.appendChild(highlightSection);
  popUp.appendChild(highlighterSwtich);

  popUp.appendChild(noteSectionHeader);
  popUp.appendChild(noteSection);
  popUp.appendChild(notetakerSwitch);

  popUp.appendChild(eraserSectionHeader);
  popUp.appendChild(undoBtn);
  popUp.appendChild(resetBtn);
  popUp.appendChild(changeViewBtn);

  return { popUp, noteTextarea, notetakerSwitch };
}

function createCollapsedPopUp(markInstance) {
  // Turn off the notetaker function if it is on; it cannot be accessed from the
  // small popUp.
  if (markInstance.notetakerIsOn) {
    markInstance.notetakerIsOn = false;
  }

  const popUp = document.createElement("div");
  popUp.classList.add("popUp");
  popUp.classList.add("width180px");
  popUp.classList.add("paddingTop10px");

  const highlightSectionHeader = document.createElement("h3");
  highlightSectionHeader.appendChild(document.createTextNode("Highlighter"));
  highlightSectionHeader.classList.add("sectionHeader");

  const colour0 = createHighlighterColourDiv(0, markInstance);
  const colour1 = createHighlighterColourDiv(1, markInstance);
  const colour2 = createHighlighterColourDiv(2, markInstance);
  const colour3 = createHighlighterColourDiv(3, markInstance);

  colour0.addEventListener("click", e => handleColourClick(markInstance, colour0, [colour1, colour2, colour3], 0));
  colour1.addEventListener("click", e => handleColourClick(markInstance, colour1, [colour0, colour2, colour3], 1));
  colour2.addEventListener("click", e => handleColourClick(markInstance, colour2, [colour0, colour1, colour3], 2));
  colour3.addEventListener("click", e => handleColourClick(markInstance, colour3, [colour0, colour1, colour2], 3));

  const undoBtn = document.createElement("div");
  undoBtn.appendChild(document.createTextNode("Undo"));
  undoBtn.classList.add("smallButton");
  undoBtn.classList.add("marginLeft20px");
  undoBtn.classList.add("colorGray");
  undoBtn.addEventListener("click", e => handleUndoButtonClick(markInstance));

  const highlighterSwtich = document.createElement("div");
  highlighterSwtich.classList.add("smallButton");
  highlighterSwtich.classList.add("colorGray");
  setInitialSwitchAppearance(highlighterSwtich, markInstance.highlighterIsOn);
  highlighterSwtich.addEventListener("click", e => handleHighlighterSwitchClick(markInstance, highlighterSwtich, undefined, [colour0, colour1, colour2, colour3]));

  // Create a "change view" button.
  const changeViewBtn = document.createElement("div");
  changeViewBtn.classList.add("changeViewButton");
  const spanText = document.createElement("span");
  spanText.classList.add("plusSignPosition");
  spanText.appendChild(document.createTextNode("+"));
  changeViewBtn.appendChild(spanText);
  changeViewBtn.addEventListener("click", e => handleChangeViewButtonClick(markInstance));

  popUp.appendChild(highlightSectionHeader);
  popUp.appendChild(colour0);
  popUp.appendChild(colour1);
  popUp.appendChild(colour2);
  popUp.appendChild(colour3);
  popUp.appendChild(undoBtn);
  popUp.appendChild(highlighterSwtich);
  popUp.appendChild(changeViewBtn);

  return { popUp };
}


///////////////////////////////////////////////////////
//// Functions that implement highlighting feature ////
///////////////////////////////////////////////////////

function removeElementFromDOM(element) {
  if (Array.isArray(element)) {
    element.forEach(span => {
  		const i = getIndexInParentChildNodes(span);
  		const textNode = span.childNodes[0];
  		const parent = span.parentNode;
  		parent.removeChild(span);
  		insertNodeAtIndex(textNode, parent, i);
  	});
  } else {
    document.body.removeChild(element);
  }

}

function highlightTextNode(node, colour) {
	if (node.nodeType === Node.TEXT_NODE) {
		let i = getIndexInParentChildNodes(node);

		const parent = node.parentNode;
		parent.removeChild(node);
		const span = document.createElement('span');
		span.style.backgroundColor = colour;
		span.appendChild(node);

		insertNodeAtIndex(span, parent, i);

		return span;
	}

	return null;
}

function getIntermediateTextNodes(root, start, end) {
	let foundStart = false;
	let foundEnd = false;
	let result = [];

	function preOrderTraverse(node) {
		if (node === end) {
			foundEnd = true;
		}
		if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "" && foundStart && !foundEnd) {
			result.push(node);
		} else {
			for (let i = 0; i < node.childNodes.length; i++) {
				preOrderTraverse(node.childNodes[i]);
			}
		}
		if (node === start) {
			foundStart = true;
		}
	}

	preOrderTraverse(root);
	return result;
}

function getIndexInParentChildNodes(node) {
	let parentIndex = 0;
	let sibling = node.previousSibling;
	while (sibling != null) {
		sibling = sibling.previousSibling;
		parentIndex++;
	}
	return parentIndex
}

function insertNodeAtIndex(node, parent, i) {
	if (parent.childNodes.length === 0) {
		parent.appendChild(node);
	} else if (parent.childNodes.length === i) {
		parent.appendChild(node);
	} else {
		parent.insertBefore(node, parent.childNodes[i]);
	}
}

function highlight(markInstance) {
	// TODO: Find out which browsers have window.getSelection function?
  const sel = window.getSelection();

	// We don't want to count clicks as highlights.
	if (sel.toString().trim() === "" || markInstance.activeColourIndex > 3 || markInstance.activeColourIndex < 0 || !markInstance.highlighterIsOn) {
		return;
	}

  // Highlight text nodes that are between the selected anchor and focus nodes.
	const intermediateTextNodes = getIntermediateTextNodes(document.body, sel.anchorNode, sel.focusNode);
	const listOfSpansCreated = [];
	intermediateTextNodes.map( t => {
		const spanCreated = highlightTextNode(t, markInstance.colours[markInstance.activeColourIndex]);
		if (spanCreated) {
			listOfSpansCreated.push(spanCreated);
		}
	});

  // Highlight the selected anchor and focus nodes (if they are text nodes).
	const anchor = sel.anchorNode;
	const anchorOffset = sel.anchorOffset;
	const focus = sel.focusNode;
	const focusOffset = sel.focusOffset;
	const anchorText = anchor.nodeValue;
	const focusText = focus.nodeValue;

	if (anchor === focus && anchor.nodeType === Node.TEXT_NODE) {
		const startIdx = Math.min(anchorOffset, focusOffset);
		const endIdx = Math.max(anchorOffset, focusOffset);
		const firstUnselectedText = anchorText.substring(0, startIdx);
		const selectedText = anchorText.substring(startIdx, endIdx);
		const lastUnselectedText = anchorText.substring(endIdx, anchorText.length);

		const firstTextNode = document.createTextNode(firstUnselectedText);

		const span = document.createElement('span');
		span.style.backgroundColor = markInstance.colours[markInstance.activeColourIndex];
		const selectedTextNode = document.createTextNode(selectedText);
		span.appendChild(selectedTextNode);

		const lastTextNode = document.createTextNode(lastUnselectedText);

		const anchorIdx = getIndexInParentChildNodes(anchor);
		const parent = anchor.parentNode;
		parent.removeChild(anchor);

		insertNodeAtIndex(firstTextNode, parent, anchorIdx);
		insertNodeAtIndex(span, parent, anchorIdx + 1);
		insertNodeAtIndex(lastTextNode, parent, anchorIdx + 2);

		listOfSpansCreated.push(span);
	} else {
		if (anchor.nodeType === Node.TEXT_NODE) {
			const unselectedText = anchorText.substring(0, anchorOffset);
			const selectedText = anchorText.substring(anchorOffset, anchorText.length);

			const unselectedTextNode = document.createTextNode(unselectedText);

			const span = document.createElement('span');
			span.style.backgroundColor = markInstance.colours[markInstance.activeColourIndex];
			const selectedTextNode = document.createTextNode(selectedText);
			span.appendChild(selectedTextNode);

			const anchorIdx = getIndexInParentChildNodes(anchor);
			const parent = anchor.parentNode;
			parent.removeChild(anchor);

			insertNodeAtIndex(unselectedTextNode, parent, anchorIdx);
			insertNodeAtIndex(span, parent, anchorIdx + 1);

			listOfSpansCreated.push(span);
		}

		if (focus.nodeType === Node.TEXT_NODE) {
			const selectedText = focusText.substring(0, focusOffset);
			const unselectedText = focusText.substring(focusOffset, focusText.length);

			const span = document.createElement('span');
			span.style.backgroundColor = markInstance.colours[markInstance.activeColourIndex];
			const selectedTextNode = document.createTextNode(selectedText);
			span.appendChild(selectedTextNode);

			const unselectedTextNode = document.createTextNode(unselectedText);

			const focusIdx = getIndexInParentChildNodes(focus);
			const parent = focus.parentNode;
			parent.removeChild(focus);

			insertNodeAtIndex(span, parent, focusIdx);
			insertNodeAtIndex(unselectedTextNode, parent, focusIdx + 1);

			listOfSpansCreated.push(span);
		}
	}

	if (listOfSpansCreated.length !== 0) {
		markInstance.highlightsAndNotes.push(listOfSpansCreated);
    markInstance.highlights.push(listOfSpansCreated);
	}
}


/////////////////////////////////////////////////////
//// Functions that implement notetaking feature ////
/////////////////////////////////////////////////////

function isChildOf(node, potentialParent) {
  let curr = node;
  while (curr != null && curr != potentialParent) {
    curr = curr.parentNode;
  }

  return curr != null;
}

function leaveNote(markInstance, target, x, y) {
  // Don't leave a note if the popUp was clicked, or if the noteTaking function is not on,
  // or if there is no note message.
  if (!markInstance.notetakerIsOn || isChildOf(target, markInstance.popUp)) {
    return;
  }
  // ALSO NEED
  // if (markInstance.noteTextarea.value === "") {
  //   return;
  // }

  log(markInstance.noteTextarea.value)

  const note = document.createElement("div");
  note.classList.add("note");
  note.style.left = x + "px";
  note.style.top = y + "px";

  note.appendChild(document.createTextNode(markInstance.noteTextarea.value));
  // markInstance.noteTextarea.value = "";

  document.body.appendChild(note);
  markInstance.notes.push(note);
  markInstance.highlightsAndNotes.push(note);

  handleNotetakerSwtichClick(markInstance, undefined, markInstance.notetakerSwitch, undefined);
}


////////////////////////////
//// Library definition ////
////////////////////////////

function Mark(selector) {
  this.highlights = [];
  this.notes = [];
  this.highlightsAndNotes = [];

  this.displays = [DEFAULT_VIEW, COLLAPSED_VIEW];
  this.displayIndex = 0;

  this.colours = [DEFAULT_COLOUR0, DEFAULT_COLOUR1, DEFAULT_COLOUR2, DEFAULT_COLOUR3];
  this.activeColourIndex = 0;

  this.highlighterIsOn = false;
  this.notetakerIsOn = false;

  const { popUp, noteTextarea, notetakerSwitch } = createDefaultPopUp(this);
  this.popUp = popUp;
  this.noteTextarea = noteTextarea;
  this.notetakerSwitch = notetakerSwitch;

  this.element = document.querySelector(selector);
  this.element.appendChild(popUp);

  window.addEventListener('mouseup', () => highlight(this));
  window.addEventListener('click', e => leaveNote(this, e.target, e.pageX, e.pageY));
}

///////////////////////////////////////////////////////////////
//// Functions added to Mark.prototype (available to devs) ////
///////////////////////////////////////////////////////////////

function hidePopUp() {
  if (this.popUp.parentElement == null) return;

  this.element.removeChild(this.popUp);
}

function showPopUp() {
  if (this.popUp.parentElement == null) {
    this.element.appendChild(this.popUp);
  }
}

function setPosition(top, left) {
  this.popUp.style.top = top;
  this.popUp.style.left = left;
}

function resetPopUp() {
  const top = this.popUp.style.top;
  const left = this.popUp.style.left;

  this.element.removeChild(this.popUp);

  if (this.displayIndex === DEFAULT_VIEW) {
    const result = createDefaultPopUp(this);
    this.popUp = result.popUp
    this.noteTextarea = result.noteTextarea;
    this.notetakerSwitch = result.notetakerSwitch;
  } else if (this.displayIndex === COLLAPSED_VIEW) {
    const result = createCollapsedPopUp(this);
    this.popUp = result.popUp
    this.noteTextarea = result.noteTextarea;
    this.notetakerSwitch = result.notetakerSwitch;
  }

  this.setPosition(top, left);
  this.element.appendChild(this.popUp);
}

function setCurrentHighlighterColour(i) {
  if (0 <= i && i <= 3) {
    this.activeColourIndex = i;
    resetPopUp.call(this);
  }
}

function setColours(colour0, colour1, colour2, colour3) {
  this.colours = [colour0, colour1, colour2, colour3];
  resetPopUp.call(this);
}

// // Displays is an array containing one or more instances of DEFAULT_VIEW,
// // COLLAPSED_VIEW, and HIDDEN_VIEW. initialDisplay is the value of the display type
// // that the popUp should initially have. The popUp will cycle through the list
// // of displays, from front to back starting from the initial display.
// function defineDisplayCycle(displays, initialDisplay) {
//   this.displays = displays;
//   this.displayIndex = 0;
//   while (displays[this.displayIndex] !== initialDisplay) {
//     this.displayIndex++;
//   }
// }

Mark.prototype = {
  setCurrentHighlighterColour,
  setPosition,
  hidePopUp,
  showPopUp,
  setColours,
  DEFAULT_VIEW,
  COLLAPSED_VIEW,
  HIDDEN_VIEW
}
