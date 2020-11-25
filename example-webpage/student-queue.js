/* Student queue js */
'use strict';
const log = console.log;
console.log('Student queue');

// Let's get the elements we need first
const form = document.querySelector('#queueForm')
const queue = document.querySelector('#queue')

// Adding an event listener for the 'submit' event onto the form
form.addEventListener('submit', addStudent)

function addStudent(e) {
	e.preventDefault(); // prevent default form action

	log('Adding a student')

	// First, need to get the student's name and course
	// from the text fields

	const studentName = document.querySelector('#sName').value
	const studentCourse = document.querySelector('#sCourse').value

	// Format the text for the list item
	// String formatting through template literals
	const studentText = `${studentName} - ${studentCourse}`

	// Now we can create the DOM element
	// first a list element to hold the student text
	const listElement = document.createElement('li')

	// add the class to the list element
	listElement.className = 'student'

	// add the text to list element
	listElement.appendChild(document.createTextNode(studentText))

	// create and add a remove button
	const removeButton = document.createElement('button')
	removeButton.className = 'remove'
	removeButton.appendChild(document.createTextNode('remove'))
	listElement.appendChild(removeButton)

	// Put in the right place depending on addAfter
	const students = document.querySelectorAll('.student')
	const position = document.querySelector('#sAddAt').value

	log(students)
	log(position)

	try {
		if (position > students.length) {
			queue.appendChild(listElement) // put at the end
		} else {
			students[position - 1].before(listElement)
		}
	} catch (e) {
		log('Invalid position')
	}
}


// Adding a click event listener to the entire queue
queue.addEventListener('click', removeStudent)

function removeStudent(e) {
	// checking if the click was on a remove button
	if (e.target.classList.contains('remove')) {
		log('remove student')
		// getting the remove buttons parent element, the student <li>
		const studentToRemove = e.target.parentElement
		queue.removeChild(studentToRemove)
	}
}


/// Kicking students at the end of queue at a set time interval
const kickButton = document.querySelector('#kickButton')
kickButton.addEventListener('click', startTimeLimit)

function startTimeLimit(e) {
	const timeLimit = parseInt(document.querySelector('#timeLimit').value)

	const kickInterval = setInterval(function () {
		log('kicked')
		try {
			queue.removeChild(queue.lastElementChild)
		} catch (e) {
			// clearing the interval we made if no more students to kick
			clearInterval(kickInterval)
			log('done kicking')
		}
	}, timeLimit * 1000)
}

const mark = new Mark("body");
mark.setPosition("200px", "800px");
mark.setColours("#DDDDDD", "yellow", "lime", "cyan");
mark.setCurrentHighlighterColour(1);
