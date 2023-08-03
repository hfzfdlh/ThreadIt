const express = require('express');
const fs = require('fs').promises;
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Rute untuk halaman login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rute untuk proses login
app.post('/login', (req, res) => {
    const { userName, password } = req.body;

    // Baca data pengguna dari file users.json dengan promise menggunakan then dan catch
    fs.readFile('./data/users.json', 'utf8')
        .then((data) => {
            const users = JSON.parse(data);
            const user = users.find((u) => u.userName === userName && u.password === password);

            if (user) {
                res.redirect('/home');
            } else {
                res.send('Login gagal. Periksa kembali username dan password Anda.');
            }
        })
        .catch((err) => {
            console.error('Error reading users.json:', err);
            res.status(500).send('Server error');
        });
});

// Rute untuk halaman utama setelah berhasil login
app.get('/home', (req, res) => {
    res.render('home');
});

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
