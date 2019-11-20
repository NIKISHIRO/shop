const {Router} = require('express');
const router = Router();
const Product = require('../models/product');
const Category = require('../models/category');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const products = await Product.find();
    const categories = await Category.find();
    res.render('products', {
        title: 'Продукты',
        products,
        categories,
        isProducts: true
    });
});

router.get('/add', auth, async (req, res) => {
    const category = await Category.find();
    res.render('products-add', {
        category,
        title: 'Добавить продукт'
    });
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('product', {
        product
    });
});

router.post('/', async (req, res) => {
    const categories = JSON.parse(req.body.categories);
    let products;
    if (categories.length) {
        products = await Product.find({categories: {$all: categories}});
    } else {
        products = await Product.find();
    }
    res.status(200).send(products);
});

router.post('/add', auth, async (req, res) => {
    let {title, description, price, image, categories} = req.body;
    categories = JSON.parse(categories);
    const product = new Product({title, description, price, image, categories});
    await product.save();
    res.redirect('/products');
});

module.exports = router;