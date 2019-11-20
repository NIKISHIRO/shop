const path = require('path');
const mongoose = require('mongoose');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const exphbs  = require('express-handlebars');
const express = require('express');
const app = express();
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const cardRoutes = require('./routes/card');
const vars = require('./middleware/vars');
const user = require('./middleware/user');

const URI = 'mongodb://localhost:27017/tests';

var store = new MongoDBStore({
    uri: URI,
    collection: 'sessions'
});

app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({extended: true}));
app.use(vars);
app.use(user);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/card', cardRoutes);

async function start() {
    await mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
    app.listen(3000);
}
start();