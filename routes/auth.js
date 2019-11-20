const {Router} = require('express');
const router = Router();
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('auth', {
        title: 'Авторизация', 
        isLogin: true
    });
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const data = await User.findOne({email, password})
    if (!data) {
        console.log('Неверный логин/пароль');
        return res.redirect('/auth');
    }
    req.session.isAuthenticated = true;
    req.session.user = data;
    return res.redirect('/');
});

router.post('/register', async (req, res) => {
    const {login, email, password} = req.body;
    const data = await User.findOne({email});
    if (data) {
        console.log('Такой Email уже занят');
        return res.redirect('/auth');
    }
    const user = new User({login, email, password});
    req.session.isAuthenticated = true;
    req.session.user = await user.save();
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err);
        res.locals.isAuth = false;
        res.redirect('/');
    });
});

module.exports = router;