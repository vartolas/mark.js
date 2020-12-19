
// Anonymous function that declares Mark.js
(function(global, document) {

  //////////////////////////////
  //// Constant Definitions ////
  //////////////////////////////

  const log = console.log;

  const DEFAULT_HIGHLIGHTER_COLOUR0 = "yellow";
  const DEFAULT_HIGHLIGHTER_COLOUR1 = "cyan";
  const DEFAULT_HIGHLIGHTER_COLOUR2 = "lime";
  const DEFAULT_HIGHLIGHTER_COLOUR3 = "#FFBBBB";

  const DEFAULT_ON_BTN_COLOUR = "";
  const DEFAULT_OFF_BTN_COLOUR = "";

  const DEFAULT_POPUP_BKG_COLOUR = "#FFFFFF";
  const DEFAULT_POPUP_TEXT_COLOUR = "#555555";
  const DEFAULT_SWITCH_TEXT_COLOUR = "#555555";
  const DEFAULT_NOTE_INPUT_COLOUR = "#000000";

  const DEFAULT_POPUP_BORDER_COLOUR = "gray";

  const TURN_ON_BTN_TEXT = "Off";
  const TURN_OFF_BTN_TEXT = "On";

  const INACTIVE_NOTE_BTN_TEXT = "Off";
  const ACTIVE_NOTE_BTN_TEXT = "Click to paste!";
  const DEFAULT_VIEW = 0;
  const COLLAPSED_VIEW = 1;

  const DEFAULT_NUM_LAYERS = 3;


  ////////////////////////////////////////
  //// Helpers for createDefaultPopUp ////
  ////////////////////////////////////////

  function setInitialSwitchAppearance(markInstance, switchElement, on) {
    if (on) {
      switchElement.classList.add("turnOffBtn");
      switchElement.style.backgroundColor = markInstance.style.onButtonBackgroundColour;
      switchElement.style.color = markInstance.style.switchTextColour;
      switchElement.appendChild(document.createTextNode(TURN_OFF_BTN_TEXT));
    } else {
      switchElement.classList.add("turnOnBtn");
      switchElement.style.backgroundColor = markInstance.style.offButtonBackgroundColour;
      switchElement.style.color = markInstance.style.switchTextColour;
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
      highlighterSwtich.style.backgroundColor = markInstance.style.onButtonBackgroundColour;
      highlighterSwtich.removeChild(highlighterSwtich.childNodes[0]);
      highlighterSwtich.appendChild(document.createTextNode(TURN_OFF_BTN_TEXT));
    } else {
      highlighterSwtich.classList.remove("turnOffBtn");
      highlighterSwtich.classList.add("turnOnBtn");
      highlighterSwtich.style.backgroundColor = markInstance.style.offButtonBackgroundColour;
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

      setOffNotetakerSwtichAppearance(markInstance, notetakerSwtich)
    }
  }

  function setOffNotetakerSwtichAppearance(markInstance, notetakerSwtich) {
    notetakerSwtich.classList.remove("turnOffBtn");
    notetakerSwtich.classList.add("turnOnBtn");
    notetakerSwtich.style.backgroundColor = markInstance.style.offButtonBackgroundColour;
    notetakerSwtich.removeChild(notetakerSwtich.childNodes[0]);
    notetakerSwtich.appendChild(document.createTextNode(INACTIVE_NOTE_BTN_TEXT));
  }

  function setOnNotetakerSwtichAppearance(markInstance, notetakerSwtich) {
    notetakerSwtich.classList.remove("turnOnBtn");
    notetakerSwtich.classList.add("turnOffBtn");
    notetakerSwtich.style.backgroundColor = markInstance.style.onButtonBackgroundColour;
    notetakerSwtich.removeChild(notetakerSwtich.childNodes[0]);
    notetakerSwtich.appendChild(document.createTextNode(ACTIVE_NOTE_BTN_TEXT));
  }

  function handleNotetakerSwtichClick(markInstance, highlighterSwtich, notetakerSwtich, colourObjects) {
    /* Turn off the highlighter function if it is on. We must turn on the notetaker AFTER clicking the
    highlighter switch, or else the highlighter switch click will turn off the notetaker immediately. */
    if (markInstance.highlighterIsOn) {
      handleHighlighterSwitchClick(markInstance, highlighterSwtich, notetakerSwtich, colourObjects);
    }

    markInstance.notetakerIsOn = !markInstance.notetakerIsOn;

    if (markInstance.notetakerIsOn) {
      setOnNotetakerSwtichAppearance(markInstance, notetakerSwtich);
    } else {
      setOffNotetakerSwtichAppearance(markInstance, notetakerSwtich);
    }
  }

  function handleColourClick(markInstance, selectedColourObject, colourObjects, newActiveColourIndex, highlighterSwtich, notetakerSwitch) {
    if (!markInstance.highlighterIsOn) {
      markInstance.activeColourIndex = newActiveColourIndex;
      handleHighlighterSwitchClick(markInstance, highlighterSwtich, notetakerSwitch, colourObjects);
      return;
    } else if (markInstance.highlighterIsOn && colourObjects[markInstance.activeColourIndex] === selectedColourObject) {
      return;
    }

    colourObjects.forEach(item => {
      if (item.classList.contains("activeColourBorder")) {
        item.classList.remove("activeColourBorder");
        item.classList.add("inactiveColourBorder");
      }
    });

    if (markInstance.activeColourIndex !== newActiveColourIndex) {
      selectedColourObject.classList.remove("inactiveColourBorder");
      selectedColourObject.classList.add("activeColourBorder");
    }
    markInstance.activeColourIndex = newActiveColourIndex;
  }

  function createHighlighterColourDiv(i, markInstance) {
    const colour = document.createElement("div");
    colour.classList.add("highlighterColour");
    colour.style.backgroundColor = markInstance.style.highlighterColours[i];
    colour.style.borderColor = markInstance.style.popUpBorderColour;
    if (i === markInstance.activeColourIndex && markInstance.highlighterIsOn) {
      colour.classList.add("activeColourBorder");
    } else {
      colour.classList.add("inactiveColourBorder");
    }

    return colour
  }

  function handleUndoButtonClick(markInstance) {
      if (markInstance.highlights.length === 0) {
        return;
      }

      const lastElement = markInstance.highlights.pop();
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
    popUp.style.color = markInstance.style.popUpTextColour;
    popUp.style.backgroundColor = markInstance.style.popUpBackgroundColour;
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
    highlightSection.style.borderColor = markInstance.style.popUpBorderColour;

    const highlightColourBoxHeader = document.createElement("h4");
    highlightColourBoxHeader.classList.add("boxHeader");
    highlightColourBoxHeader.appendChild(document.createTextNode("Highlighter Colour"));

    const colour0 = createHighlighterColourDiv(0, markInstance);
    colour0.classList.add("marginLeft13px");
    const colour1 = createHighlighterColourDiv(1, markInstance);
    const colour2 = createHighlighterColourDiv(2, markInstance);
    const colour3 = createHighlighterColourDiv(3, markInstance);

    highlightSection.appendChild(highlightColourBoxHeader);
    highlightSection.appendChild(colour0);
    highlightSection.appendChild(colour1);
    highlightSection.appendChild(colour2);
    highlightSection.appendChild(colour3);

    // Create an on/off switch for the highlighter.
    // Give the switch an onClick listner below, after the noteSwitch is defined.
    const highlighterSwtich = document.createElement("div");
    highlighterSwtich.classList.add("popUpSection");
    highlighterSwtich.style.borderColor = markInstance.style.popUpBorderColour;
    setInitialSwitchAppearance(markInstance, highlighterSwtich, markInstance.highlighterIsOn);

    // Create undo and reset buttons for the highlighter.
    const higlighterUndoBtn = document.createElement("div");
    higlighterUndoBtn.appendChild(document.createTextNode("Undo"));
    higlighterUndoBtn.style.borderColor = markInstance.style.popUpBorderColour;
    higlighterUndoBtn.classList.add("smallButtonExpandedView");
    higlighterUndoBtn.classList.add("marginLeft10px");
    higlighterUndoBtn.classList.add("marginBottom20px");
    higlighterUndoBtn.classList.add("floatLeft");
    higlighterUndoBtn.addEventListener("click", e => handleUndoButtonClick(markInstance));

    const higlighterResetBtn = document.createElement("div");
    higlighterResetBtn.appendChild(document.createTextNode("Reset"));
    higlighterResetBtn.style.borderColor = markInstance.style.popUpBorderColour;
    higlighterResetBtn.classList.add("smallButtonExpandedView");
    higlighterResetBtn.classList.add("marginRight10px");
    higlighterResetBtn.classList.add("marginBottom20px");
    higlighterResetBtn.classList.add("floatRight");
    higlighterResetBtn.addEventListener("click", e => {
      while (markInstance.highlights.length > 0) {
        const highlight = markInstance.highlights.pop();
        removeElementFromDOM(highlight);
      }
    });

    // Create the note section header.
    const noteSectionHeader = document.createElement("h3");
    noteSectionHeader.appendChild(document.createTextNode("Notetaker"));
    noteSectionHeader.classList.add("sectionHeader");
    noteSectionHeader.classList.add("marginTop20px");

    // Create the note section.
    const noteSection = document.createElement("div");
    noteSection.classList.add("popUpSection");
    noteSection.style.borderColor = markInstance.style.popUpBorderColour;
    noteSection.classList.add("noteSection");

    const noteContentBoxHeader = document.createElement("h4");
    noteContentBoxHeader.appendChild(document.createTextNode("Note Content"));
    noteContentBoxHeader.classList.add("boxHeader");

    const noteTextarea = document.createElement("textarea");
    noteTextarea.style.color = markInstance.style.noteInputColour;
    noteTextarea.setAttribute("placeholder", "Type your note here...");

    noteSection.appendChild(noteContentBoxHeader);
    noteSection.appendChild(noteTextarea);

    // Create a on/off switch for the notetaker.
    const notetakerSwitch = document.createElement("div");
    notetakerSwitch.classList.add("popUpSection");
    notetakerSwitch.style.borderColor = markInstance.style.popUpBorderColour;
    setInitialSwitchAppearance(markInstance, notetakerSwitch, markInstance.notetakerIsOn);
    highlighterSwtich.addEventListener("click", e => handleHighlighterSwitchClick(markInstance, highlighterSwtich, notetakerSwitch, [colour0, colour1, colour2, colour3]));
    notetakerSwitch.addEventListener("click", e => handleNotetakerSwtichClick(markInstance, highlighterSwtich, notetakerSwitch, [colour0, colour1, colour2, colour3]));

    // Create a reset button for the Notetaker.
    const resetNoteLayerBtn = document.createElement("div");
    resetNoteLayerBtn.classList.add("popUpSection");
    resetNoteLayerBtn.style.borderColor = markInstance.style.popUpBorderColour;
    resetNoteLayerBtn.classList.add("resetBtn");
    resetNoteLayerBtn.classList.add("marginBottom10px");
    resetNoteLayerBtn.appendChild(document.createTextNode("Reset Note Layer"));
    resetNoteLayerBtn.addEventListener("click", e => {
      while (markInstance.notes[markInstance.currentLayer].length > 0) {
        removeElementFromDOM(markInstance.notes[markInstance.currentLayer].pop());
      }
    });

    // Create a "change view" button.
    const changeViewBtn = document.createElement("div");
    changeViewBtn.classList.add("changeViewButton");
    changeViewBtn.style.borderColor = markInstance.style.popUpBorderColour;
    const spanText = document.createElement("span");
    spanText.classList.add("minusSignPosition");
    spanText.appendChild(document.createTextNode("-"));
    changeViewBtn.appendChild(spanText);
    changeViewBtn.addEventListener("click", e => handleChangeViewButtonClick(markInstance));

    // Create pop-up layer text and decrement/increment layer buttons.
    const layerTextContainer = document.createElement("div");
    layerTextContainer.classList.add("layerTextContainer");
    layerTextContainer.classList.add("sectionHeader");
    const layerTextNode = document.createTextNode("Note Layer ");
    const layerNumberTextNode = document.createTextNode(markInstance.currentLayer + 1);

    const decrementLayerButton = document.createElement("div");
    decrementLayerButton.classList.add("leftArrow");
    decrementLayerButton.classList.add("arrow");
    decrementLayerButton.addEventListener("click", e => switchLayer(markInstance, -1, layerTextContainer));

    const incrementLayerButton = document.createElement("div");
    incrementLayerButton.classList.add("rightArrow");
    incrementLayerButton.classList.add("arrow");
    incrementLayerButton.addEventListener("click", e => switchLayer(markInstance, 1, layerTextContainer));

    layerTextContainer.appendChild(layerTextNode);
    layerTextContainer.appendChild(layerNumberTextNode);
    layerTextContainer.appendChild(decrementLayerButton);
    layerTextContainer.appendChild(incrementLayerButton);

    // Add event listeners to the highlighter colour option objects.
    colour0.addEventListener("click", e => handleColourClick(markInstance, colour0, [colour0, colour1, colour2, colour3], 0, highlighterSwtich, notetakerSwitch));
    colour1.addEventListener("click", e => handleColourClick(markInstance, colour1, [colour0, colour1, colour2, colour3], 1, highlighterSwtich, notetakerSwitch));
    colour2.addEventListener("click", e => handleColourClick(markInstance, colour2, [colour0, colour1, colour2, colour3], 2, highlighterSwtich, notetakerSwitch));
    colour3.addEventListener("click", e => handleColourClick(markInstance, colour3, [colour0, colour1, colour2, colour3], 3, highlighterSwtich, notetakerSwitch));

    // Add children to the popUp div.
    popUp.appendChild(highlightSectionHeader);
    popUp.appendChild(highlightSection);
    popUp.appendChild(highlighterSwtich);
    popUp.appendChild(higlighterUndoBtn);
    popUp.appendChild(higlighterResetBtn);

    popUp.appendChild(noteSectionHeader);
    popUp.appendChild(noteSection);
    popUp.appendChild(notetakerSwitch);

    popUp.appendChild(layerTextContainer);
    popUp.appendChild(resetNoteLayerBtn);

    if (!markInstance.style.frozen) {
      popUp.appendChild(changeViewBtn);
    }

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
    popUp.style.color = markInstance.style.popUpTextColour;
    popUp.classList.add("width180px");
    popUp.style.backgroundColor = markInstance.style.popUpBackgroundColour;
    popUp.classList.add("paddingTop10px");

    const highlightSectionHeader = document.createElement("h3");
    highlightSectionHeader.appendChild(document.createTextNode("Highlighter"));
    highlightSectionHeader.classList.add("sectionHeader");

    const colour0 = createHighlighterColourDiv(0, markInstance);
    const colour1 = createHighlighterColourDiv(1, markInstance);
    const colour2 = createHighlighterColourDiv(2, markInstance);
    const colour3 = createHighlighterColourDiv(3, markInstance);

    const undoBtn = document.createElement("div");
    undoBtn.appendChild(document.createTextNode("Undo"));
    undoBtn.style.borderColor = markInstance.style.popUpBorderColour;
    undoBtn.classList.add("smallButtonCollapsedView");
    undoBtn.classList.add("marginLeft20px");
    undoBtn.classList.add("floatLeft");
    undoBtn.addEventListener("click", e => handleUndoButtonClick(markInstance));

    const highlighterSwtich = document.createElement("div");
    highlighterSwtich.style.borderColor = markInstance.style.popUpBorderColour;
    highlighterSwtich.classList.add("smallButtonCollapsedView");
    highlighterSwtich.classList.add("floatRight");
    highlighterSwtich.classList.add("marginRight20px");
    setInitialSwitchAppearance(markInstance, highlighterSwtich, markInstance.highlighterIsOn);
    highlighterSwtich.addEventListener("click", e => handleHighlighterSwitchClick(markInstance, highlighterSwtich, undefined, [colour0, colour1, colour2, colour3]));

    // Create a "change view" button.
    const changeViewBtn = document.createElement("div");
    changeViewBtn.style.borderColor = markInstance.style.popUpBorderColour;
    changeViewBtn.classList.add("changeViewButton");
    const spanText = document.createElement("span");
    spanText.classList.add("plusSignPosition");
    spanText.appendChild(document.createTextNode("+"));
    changeViewBtn.appendChild(spanText);
    changeViewBtn.addEventListener("click", e => handleChangeViewButtonClick(markInstance));

    // Add event listeners to the highlighter colour option objects.
    colour0.addEventListener("click", e => handleColourClick(markInstance, colour0, [colour0, colour1, colour2, colour3], 0, highlighterSwtich, undefined));
    colour1.addEventListener("click", e => handleColourClick(markInstance, colour1, [colour0, colour1, colour2, colour3], 1, highlighterSwtich, undefined));
    colour2.addEventListener("click", e => handleColourClick(markInstance, colour2, [colour0, colour1, colour2, colour3], 2, highlighterSwtich, undefined));
    colour3.addEventListener("click", e => handleColourClick(markInstance, colour3, [colour0, colour1, colour2, colour3], 3, highlighterSwtich, undefined));

    popUp.appendChild(highlightSectionHeader);
    popUp.appendChild(colour0);
    popUp.appendChild(colour1);
    popUp.appendChild(colour2);
    popUp.appendChild(colour3);
    popUp.appendChild(undoBtn);
    popUp.appendChild(highlighterSwtich);

    if (!markInstance.style.frozen) {
      popUp.appendChild(changeViewBtn);
    }

    return { popUp };
  }

  ///////////////////////////////////////////////////////
  //// Functions that implement layer-switch feature ////
  ///////////////////////////////////////////////////////

  function switchLayer(markInstance, offset, layerTextContainer) {
    // Remove every note in the current layer from the DOM.
    let notes = markInstance.notes[markInstance.currentLayer];

    for (let i = 0; i < notes.length; i++) {
      removeElementFromDOM(notes[i]);
    }

    // Set the current layer.
    markInstance.currentLayer += offset;
    if (markInstance.currentLayer === -1) {
      markInstance.currentLayer = DEFAULT_NUM_LAYERS - 1;
    } else if (markInstance.currentLayer === DEFAULT_NUM_LAYERS) {
      markInstance.currentLayer = 0;
    }

    // Update the layer number displayed by the pop-up.
    layerTextContainer.removeChild(layerTextContainer.childNodes[1]);
    insertNodeAtIndex(document.createTextNode(markInstance.currentLayer + 1), layerTextContainer, 1);

    // Add every note in this layer to the DOM.
    notes = markInstance.notes[markInstance.currentLayer];
    for (let i = 0; i < notes.length; i++) {
      document.body.appendChild(notes[i]);
    }
  }


  ///////////////////////////////////////////////////////
  //// Functions that implement highlighting feature ////
  ///////////////////////////////////////////////////////

  function removeElementFromDOM(element) {
    if (Array.isArray(element)) {
      /* Then we are removing a highlight from the DOM (represented in the
      Mark instance's hihglights and highlightsAndNotes arrays as an array of
      spans). */
      element.forEach(span => {
        /* Put a textnode containing the text inside the span in the place of
        the span. */
    		const i = getIndexInParentChildNodes(span);
    		const textInSpan = span.innerText;
        const textNode = document.createTextNode(textInSpan);
    		const parent = span.parentNode;
    		parent.removeChild(span);
    		insertNodeAtIndex(textNode, parent, i);
    	});
    } else {
      /* Then we are removing a note from the DOM. */
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
  		const spanCreated = highlightTextNode(t, markInstance.style.highlighterColours[markInstance.activeColourIndex]);
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
  		span.style.backgroundColor = markInstance.style.highlighterColours[markInstance.activeColourIndex];
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
  			span.style.backgroundColor = markInstance.style.highlighterColours[markInstance.activeColourIndex];
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
  			span.style.backgroundColor = markInstance.style.highlighterColours[markInstance.activeColourIndex];
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
  		// markInstance.highlightsAndNotes.push(listOfSpansCreated);
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

  function leaveNote(markInstance, target, x, y, text) {
    // Don't leave a note if the popUp was clicked, nor if the noteTaking function is not on.
    if (target && (!markInstance.notetakerIsOn || isChildOf(target, markInstance.popUp))) {
      return;
    }

    const note = document.createElement("div");
    note.classList.add("note");
    note.classList.add("maximizedNote");
    note.style.top = y + "px";
    note.style.left = x + "px";


    // Define functionality for deleting notes.
    const deleteNoteBtn = document.createElement("div");
    deleteNoteBtn.classList.add("noteButton");
    deleteNoteBtn.classList.add("deleteNoteButton");
    deleteNoteBtn.appendChild(document.createTextNode("✕"));
    deleteNoteBtn.addEventListener("click", e => {
      markInstance.notes[markInstance.currentLayer].splice(markInstance.notes[markInstance.currentLayer].indexOf(note), 1);
      // markInstance.notes[markInstance].splice(markInstance.highlightsAndNotes.indexOf(note), 1);
      note.parentElement.removeChild(note);
    });

    // Create the note content.
    const noteContent = document.createElement("div");
    noteContent.classList.add("noteContent");
    noteContent.classList.add("maximizedNoteContent");
    if (text) {
      noteContent.appendChild(document.createTextNode(text));
    } else {
      noteContent.appendChild(document.createTextNode(markInstance.noteTextarea.value));
    }

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

    note.appendChild(noteContent);
    note.appendChild(changeNoteViewBtn);
    note.appendChild(deleteNoteBtn);

    document.body.appendChild(note);
    markInstance.notes[markInstance.currentLayer].push(note);
    // markInstance.highlightsAndNotes.push(note);

    if (markInstance.notetakerIsOn) {
      handleNotetakerSwtichClick(markInstance, undefined, markInstance.notetakerSwitch, undefined);
    }
  }


  ////////////////////////////
  //// Library definition ////
  ////////////////////////////

  function Mark(selector) {
    this.selector = selector;

    this.highlights = [];
    this.notes = [];

    this.numLayers = DEFAULT_NUM_LAYERS;
    this.currentLayer = 0;
    for (let i = 0; i < this.numLayers; i++) {
      this.notes.push([]);
    }

    this.displays = [DEFAULT_VIEW, COLLAPSED_VIEW];
    this.displayIndex = 0;

    this.activeColourIndex = 0
    this.style = {
      frozen: false,
      highlighterColours: [
        DEFAULT_HIGHLIGHTER_COLOUR0,
        DEFAULT_HIGHLIGHTER_COLOUR1,
        DEFAULT_HIGHLIGHTER_COLOUR2,
        DEFAULT_HIGHLIGHTER_COLOUR3
      ],
      popUpBackgroundColour: DEFAULT_POPUP_BKG_COLOUR,
      popUpTextColour: DEFAULT_POPUP_TEXT_COLOUR,
      popUpBorderColour: DEFAULT_POPUP_BORDER_COLOUR,
      onButtonBackgroundColour: DEFAULT_ON_BTN_COLOUR,
      offButtonBackgroundColour: DEFAULT_OFF_BTN_COLOUR,
      switchTextColour: DEFAULT_SWITCH_TEXT_COLOUR,
      noteInputColour: DEFAULT_NOTE_INPUT_COLOUR
    }

    this.highlighterIsOn = false;
    this.notetakerIsOn = false;

    const { popUp, noteTextarea, notetakerSwitch } = createDefaultPopUp(this);
    this.popUp = popUp;
    this.noteTextarea = noteTextarea;
    this.notetakerSwitch = notetakerSwitch;

    this.position = {
      referenceElement: selector ? document.querySelector(selector) : document.body,
      verticalDist: "0",
      horizontalDist: "0",
      positionRelativeToTop: true,
      positionRelativeToLeft: true,
      fixedPositioning: selector ? false : true
    }

    embedPopUpInDOM.call(this);

    window.addEventListener('mouseup', () => highlight(this));
    window.addEventListener('click', e => leaveNote(this, e.target, e.pageX, e.pageY, null, null));
  }

  ///////////////////////////////////////////////////////////////
  //// Functions added to Mark.prototype (available to devs) ////
  ///////////////////////////////////////////////////////////////

  function hidePopUp() {
    if (this.popUp.parentElement == null) return;

    this.position.referenceElement.removeChild(this.popUp);
  }

  function showPopUp() {
    if (this.popUp.parentElement == null) {
      this.position.referenceElement.appendChild(this.popUp);
    }
  }

  function setPosition() {
    if (this.position.fixedPositioning) {
      this.popUp.style.position = "fixed";
    } else {
      this.popUp.style.position = "absolute";
    }

    if (this.position.positionRelativeToLeft) {
      this.popUp.style.left = this.position.horizontalDist;
      this.popUp.style.right = "auto";
    } else {
      this.popUp.style.left = "auto";
      this.popUp.style.right = this.position.horizontalDist;
    }

    if (this.position.positionRelativeToTop) {
      this.popUp.style.top = this.position.verticalDist;
      this.popUp.style.bottom = "auto";
    } else {
      this.popUp.style.top = "auto";
      this.popUp.style.bottom = this.position.verticalDist;
    }
  }

  function setTop(d) {
    this.position.positionRelativeToTop = true;
    this.position.verticalDist = d;
    resetPopUp.call(this);
  }

  function setBottom(d) {
    this.position.positionRelativeToTop = false;
    this.position.verticalDist = d;
    resetPopUp.call(this);
  }

  function setLeft(d) {
    this.position.positionRelativeToLeft = true;
    this.position.horizontalDist = d;
    resetPopUp.call(this);
  }

  function setRight(d) {
    this.position.positionRelativeToLeft = false;
    this.position.horizontalDist = d;
    resetPopUp.call(this);
  }

  function applyFixedPositioning() {
    this.position.fixedPositioning = true;
    resetPopUp.call(this);
  }

  function applyAbsolutePositioning() {
    this.position.fixedPositioning = false;
    resetPopUp.call(this);
  }

  function setParentElement(selector) {
    this.selector = selector;
    // this.position.referenceElement = document.querySelector(selector);
    resetPopUp.call(this);
  }

  function embedPopUpInDOM() {
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

    setPosition.call(this);
    // Add the pop-up to the current layer.
    const referenceElement = getReferenceElement.call(this);
    referenceElement.appendChild(this.popUp);
  }

  function getReferenceElement() {
    // const referenceElement = this.selector ? this.bodies[this.currentLayer].querySelector(this.selector) : this.bodies[this.currentLayer];
    return this.position.referenceElement;
  }

  function resetPopUp() {
    // Remove the pop-up from every layer.
    const referenceElement = getReferenceElement.call(this);
    referenceElement.removeChild(this.popUp);

    embedPopUpInDOM.call(this);
  }

  function setCurrentHighlighterColour(i) {
    if (0 <= i && i <= 3) {
      this.activeColourIndex = i;
      resetPopUp.call(this);
    }
  }

  function setHighlighterColours(colour0, colour1, colour2, colour3) {
    this.style.highlighterColours = [colour0, colour1, colour2, colour3];
    resetPopUp.call(this);
  }

  function setPopUpBackgroundColour(colour) {
    this.style.popUpBackgroundColour = colour;
    resetPopUp.call(this);
  }

  function setPopUpTextColour(colour) {
    this.style.popUpTextColour = colour;
    resetPopUp.call(this);
  }

  function setPopUpBorderColour(colour) {
    this.style.popUpBorderColour = colour;
    resetPopUp.call(this);
  }

  function setSwitchTextColour(colour) {
    this.style.switchTextColour = colour;
    resetPopUp.call(this);
  }

  function setOffButtonColour(colour) {
    this.style.offButtonBackgroundColour = colour;
    resetPopUp.call(this);
  }

  function setOnButtonColour(colour) {
    this.style.onButtonBackgroundColour = colour;
    resetPopUp.call(this);
  }

  function setNoteInputColour(colour) {
    this.style.noteInputColour = colour;
    resetPopUp.call(this);
  }

  function setNoteLayerNumber(layerNumber) {
    for (let i = 0; i < this.notes[this.currentLayer].length; i++) {
      const note = this.notes[this.currentLayer][i];
      removeElementFromDOM(note);
    }

    this.currentLayer = layerNumber - 1;
    for (let i = 0; i < this.notes[this.currentLayer].length; i++) {
      const note = this.notes[this.currentLayer][i];
      document.body.appendChild(note);
    }
    resetPopUp.call(this);
  }

  function useDarkTheme() {
    this.setPopUpBackgroundColour("#222222");
    this.setPopUpTextColour("#CCCCCC");
    this.setPopUpBorderColour("gray")
    this.setOffButtonColour("#FF6666");
    this.setOnButtonColour("#AAFFAA");
    this.setSwitchTextColour("#222222");
    this.setNoteInputColour("white");
    resetPopUp.call(this);
  }

  function useLightTheme() {
    this.setPopUpBackgroundColour(DEFAULT_POPUP_BKG_COLOUR);
    this.setPopUpTextColour(DEFAULT_POPUP_TEXT_COLOUR);
    this.setPopUpBorderColour(DEFAULT_POPUP_BORDER_COLOUR)
    this.setOffButtonColour(DEFAULT_OFF_BTN_COLOUR);
    this.setOnButtonColour(DEFAULT_ON_BTN_COLOUR);
    this.setSwitchTextColour(DEFAULT_SWITCH_TEXT_COLOUR);
    resetPopUp.call(this);
  }

  /*
  Format of position parameter:
  position = {
    top/bottom: CSS distance,
    left/right: CSS distance
  }
  */
  function addNote(position, text, referenceSelector) {
    const relativeToBottom = position.bottom ? true : false;
    const relativeToRight = position.right ? true : false;

    let reference, x, y;
    if (referenceSelector) {
      reference = document.querySelector(referenceSelector);
      refRect = reference.getBoundingClientRect();
      bodyRect = document.body.getBoundingClientRect();
    }

    if (position.top) {
      if (referenceSelector) {
        y = refRect.top - bodyRect.top + position.top;
      } else {
        y = position.top;
      }
    } else {
      if (referenceSelector) {
        y = refRect.bottom - bodyRect.top - position.bottom;
      } else {
        y = bodyRect.bottom - position.bottom;
      }
    }

    if (position.left) {
      if (referenceSelector) {
        x = refRect.left - bodyRect.left + position.left;
      } else {
        x = position.left;
      }
    } else {
      if (referenceSelector) {
        x = refRect.right - bodyRect.left - position.right;
      } else {
        x = bodyRect.right - position.right;
      }
    }

    leaveNote(this, null, x, y, text);
  }

  function maximize() {
    this.displayIndex = DEFAULT_VIEW;
    resetPopUp.call(this);
  }

  function minimize() {
    this.displayIndex = COLLAPSED_VIEW;
    resetPopUp.call(this);
  }

  function freeze() {
    this.style.frozen = true;
    resetPopUp.call(this);
  }

  function unfreeze() {
    this.style.frozen = false;
    resetPopUp.call(this);
  }

  Mark.prototype = {
    setCurrentHighlighterColour,
    hidePopUp,
    showPopUp,
    setHighlighterColours,
    setTop,
    setBottom,
    setLeft,
    setRight,
    applyFixedPositioning,
    applyAbsolutePositioning,
    setParentElement,
    setPopUpBackgroundColour,
    setPopUpTextColour,
    setPopUpBorderColour,
    setOffButtonColour,
    setOnButtonColour,
    setNoteInputColour,
    setNoteLayerNumber,
    addNote,
    useDarkTheme,
    useLightTheme,
    maximize,
    minimize,
    setSwitchTextColour,
    freeze,
    unfreeze
  }

  // Add the library constructor to the global window object if it is not added already.
  window.Mark = window.Mark || Mark;

})(window, window.document);
