const express = require('express');
const router = require('./routes/router');
const path = require('path')
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/',router);



// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
