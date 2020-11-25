const DEFAULT_COLOUR0 = "yellow";
const DEFAULT_COLOUR1 = "cyan";
const DEFAULT_COLOUR2 = "lime";
const DEFAULT_COLOUR3 = "#FFBBBB";


function handleColourClick(markInstance, colourObject, otherColourObjects, newActiveColourIndex) {
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
  if (i === markInstance.activeColourIndex) {
    colour.classList.add("activeColourBorder");
  } else {
    colour.classList.add("inactiveColourBorder");
  }

  return colour
}

function removeHighlight(spans) {
	spans.forEach(span => {

		const i = getIndexInParentChildNodes(span);
		const textNode = span.childNodes[0];
		const parent = span.parentNode;
		parent.removeChild(span);
		insertNodeAtIndex(textNode, parent, i);
	});
}

function createDefaultPopUp(markInstance) {
  const popUp = document.createElement("div");
  popUp.classList.add("popUp");

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

  const none = document.createElement("div");
  none.classList.add("highlighterColour");
  none.classList.add("none");
  none.classList.add("inactiveColourBorder");

  colour0.addEventListener("click", e => handleColourClick(markInstance, colour0, [colour1, colour2, none], 0));
  colour1.addEventListener("click", e => handleColourClick(markInstance, colour1, [colour0, colour2, none], 1));
  colour2.addEventListener("click", e => handleColourClick(markInstance, colour2, [colour0, colour1, none], 2));
  none.addEventListener("click", e => handleColourClick(markInstance, none, [colour0, colour1, colour2], -1));

  highlightSection.appendChild(highlightColourBoxHeader);
  highlightSection.appendChild(colour0);
  highlightSection.appendChild(colour1);
  highlightSection.appendChild(colour2);
  highlightSection.appendChild(none);

  // Create an on/off switch for the highlighter.
  const highlighterSwtich = document.createElement("div");
  highlighterSwtich.classList.add("popUpSection");
  highlighterSwtich.classList.add("turnOnBtn");
  highlighterSwtich.appendChild(document.createTextNode("Turn On"));
  highlighterSwtich.addEventListener("click", e => {

  });

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

  const noteInput = document.createElement("textarea");
  noteInput.setAttribute("placeholder", "Type your note here...");

  noteSection.appendChild(noteContentBoxHeader);
  noteSection.appendChild(noteInput);

  // Create a on/off switch for the notetaker.
  const noteSwitch = document.createElement("div");
  noteSwitch.classList.add("popUpSection");
  noteSwitch.classList.add("turnOnBtn");
  noteSwitch.appendChild(document.createTextNode("Turn On"));
  noteSwitch.addEventListener("click", e => {

  });

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
  undoBtn.addEventListener("click", e => {
    if (markInstance.highlights.length === 0) {
      return;
    }

    const lastHighlight = markInstance.highlights.pop();
    removeHighlight(lastHighlight);
  });

  // Create a reset button.
  const resetBtn = document.createElement("div");
  resetBtn.classList.add("popUpSection");
  resetBtn.classList.add("resetBtn");
  resetBtn.appendChild(document.createTextNode("Reset"));
  resetBtn.addEventListener("click", e => {
    while (markInstance.highlights.length > 0) {
      removeHighlight(markInstance.highlights.pop());
    }
  });

  // Add children to the popUp div.
  popUp.appendChild(highlightSectionHeader);
  popUp.appendChild(highlightSection);
  popUp.appendChild(highlighterSwtich);

  popUp.appendChild(noteSectionHeader);
  popUp.appendChild(noteSection);
  popUp.appendChild(noteSwitch);

  popUp.appendChild(eraserSectionHeader);
  popUp.appendChild(undoBtn);
  popUp.appendChild(resetBtn);

  return { popUp, highlightSection, undoBtn, resetBtn };
}


///////////////////////////////////////////////////////
//// FUNCTIONS THAT IMPLEMENT HIGHLIGHTING FEATURE ////
///////////////////////////////////////////////////////

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
	if (sel.toString().trim() === "" || markInstance.activeColourIndex > 2 || markInstance.activeColourIndex < 0) {
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
		markInstance.highlights.push(listOfSpansCreated);
	}
}





function Mark(selector) {
  this.highlights = [];
  this.colours = [DEFAULT_COLOUR0, DEFAULT_COLOUR1, DEFAULT_COLOUR2];
  this.activeColourIndex = 0;

  const { popUp, highlightSection, undoBtn, resetBtn } = createDefaultPopUp(this);
  this.popUp = popUp;
  this.highlightSection = highlightSection;
  this.undoBtn = undoBtn;
  this.resetBtn = resetBtn;

  this.element = document.querySelector(selector);
  this.element.appendChild(popUp);

  window.addEventListener('mouseup', () => highlight(this));
}


///////////////////////////////////////////////////////////////
//// FUNCTIONS ADDED TO Mark.prototype (AVAILABLE TO DEVS) ////
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

  const { popUp, highlightSection, undoBtn, resetBtn } = createDefaultPopUp(this);
  this.popUp = popUp;
  this.highlightSection = highlightSection;
  this.undoBtn = undoBtn;
  this.resetBtn = resetBtn;

  this.setPosition(top, left);
  this.element.appendChild(popUp);
}

function setCurrentHighlighterColour(i) {
  if (0 <= i && i <= 2) {
    this.activeColourIndex = i;
    resetPopUp.call(this);
  }
}

function setColours(colour0, colour1, colour2) {
  this.colours = [colour0, colour1, colour2];
  resetPopUp.call(this);
}

Mark.prototype = {
  setCurrentHighlighterColour,
  setPosition,
  hidePopUp,
  showPopUp,
  setColours
}
