const express = require('express');
const path = require('path');


var app = express();


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;  
app.listen(port, () => console.log(`Project Pickle is running on port ${port}!`));  