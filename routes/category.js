const {Router} = require('express');
const router = Router();
const Category = require('../models/category');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    const category = await Category.find();
    res.render('category', {
        titel:'Добавить новую категорию',
        category
    });
});

router.post('/', async (req, res) => {
    let {name, categories} = req.body;
    categories = categories.split(',');
    const cats = categories.map(c => c.trim());
    const category = new Category({
        name: name,
        categories: cats
    });
    await category.save();
    res.redirect('/category');
});

router.post('/edit', async (req, res) => {
    const {catId, catGeneral, catsArray} = req.body;
    const result = await Category.updateOne({_id: catId}, {name: catGeneral, categories: catsArray});
    res.status(200);
});

module.exports = router;