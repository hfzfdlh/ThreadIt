const express = require('express');
const router = require('./routes/router');
// const fs = require('fs').promises;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use('/',router);

// Tes page register
app.get('/register', (req, res) => {
    res.render('register');
});

// Tes page profiles
app.get('/profile', (req, res) => {
    res.render('profile');
});

// Tes edit profiles
app.get('/edit-profile', (req, res) => {
    res.render('edit-profile');
});

// Tes page threads
app.get('/thread', (req, res) => {
    res.render('thread');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
