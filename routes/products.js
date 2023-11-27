const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { isLoggedIn } = require('../middleware');

const categories = ['airlines', 'accomodation', 'transport'];

router.get('/', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('products/new', { categories })
});

router.post('/', isLoggedIn, async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product })
});

router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
});

router.put('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
});

router.delete('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

module.exports = router;