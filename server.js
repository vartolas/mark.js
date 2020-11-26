'use strict';
const log = console.log

const express = require('express')
const app = express();

const path = require('path');

// Setting up a static directory for the files in /pub using Express middleware.
app.use(express.static(path.join(__dirname, '/pub')))

const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
})

app.get('/', (req, res) => {
	// sending a string
	//res.send('This should be the root route!')

	//sending some HTML
	res.send('<h1>This should be the root route!</h1>')
})
