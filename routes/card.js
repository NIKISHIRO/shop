const {Router} = require('express');
const router = Router();
const Product = require('../models/product');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    let user = await req.user.populate('cart.items.productId').execPopulate();
    let items = user.cart.items;
    if (items[0].productId === null) return res.render('card', {items: []});
    res.render('card', {
        items,
        total: items.reduce((total, p) => {return total += p.productId.price * p.count}, 0)
    });
});

router.post('/add', async (req, res) => {
    const product = await Product.findById(req.body.id);
    await req.user.addToCart(product);
    res.redirect('/card');
});

module.exports = router;