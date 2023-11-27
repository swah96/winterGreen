const express = require('express');
const router = express.Router();
const passport = require('passport');
const Vendor = require('../models/vendors');
const { storeReturnTo } = require('../middleware')

router.get('/register', (req, res) => {
    res.render('vendor/register');
});

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const vendor = new Vendor({ email, username });
        const registeredVendor = await Vendor.register(vendor, password);
        req.login(registeredVendor, err => {
            if (err) return next(err);
            res.redirect('/products');
        })
    } catch (err) {
        console.error(err);
        res.redirect('register');
    }
});

router.get('/login', (req,res) => {
    res.render('vendor/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => {
    const redirectUrl = res.locals.returnTo || '/products';
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/products');
    });
}); 


module.exports = router;