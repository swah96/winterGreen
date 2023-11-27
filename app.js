const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Vendor = require('./models/vendors');
const Product = require('./models/product');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const vendorRoutes = require('./routes/vendor');
const productRoutes = require('./routes/products');

mongoose.connect('mongodb://localhost:27017/winterGreen', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("Connected to database");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Vendor.authenticate()));
passport.serializeUser(Vendor.serializeUser());
passport.deserializeUser(Vendor.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentVendor = req.user;
    next();
})

app.use('/', vendorRoutes);
app.use('/products', productRoutes);



app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('serving on port 3000')
}) 