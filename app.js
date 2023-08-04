const express = require('express');
const router = require('./routes/router');
const path = require('path')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());
app.use('/',router);



// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
