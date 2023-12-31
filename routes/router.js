const Controller = require('../controller/controller');
const { uploadProfile } = require('../helper/helper');

const router = require('express').Router()





router.get('/',Controller.getLogin);
router.get('/login',Controller.getLogin)
router.get('/logout',Controller.logout)
router.post('/login',Controller.postLogin)
router.get('/register',Controller.getRegister)
router.post('/register',uploadProfile,Controller.postRegister)
router.get('/home/:id',Controller.mainPage)
router.get('/home/add/:id',Controller.mainAddPage)
router.get('/home/delete/:userId/:postId',Controller.deleteThread)
router.get('/thread/:userId/:postId', Controller.getThreadDetail )
// router.post('/thread/:id', Controller.postThread )
router.get('/edit-profile/:id',Controller.getEditProfile)
router.post('/edit-profile/:id',Controller.postEditProfile)


// // Tes page profiles
// router.get('/profile', (req, res) => {
//     res.render('profile');
// });

// // Tes edit profiles
// router.get('/edit-profile', (req, res) => {
//     res.render('edit-profile');
// });

// Tes page threads
;


// router.get('/login', (req, res) => {
//     res.render('login');
// });

// Rute untuk proses login
// router.post('/login', (req, res) => {
//     const { userName, password } = req.body;

//     // Baca data pengguna dari file users.json dengan promise menggunakan then dan catch
//     fs.readFile('./data/users.json', 'utf8')
//         .then((data) => {
//             const users = JSON.parse(data);
//             const user = users.find((u) => u.userName === userName && u.password === password);

//             if (user) {
//                 res.redirect('/home');
//             } else {
//                 res.send('Login gagal. Periksa kembali username dan password Anda.');
//             }
//         })
//         .catch((err) => {
//             console.error('Error reading users.json:', err);
//             res.status(500).send('Server error');
//         });
// });

// Rute untuk halaman utama setelah berhasil login





module.exports = router