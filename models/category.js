const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    name: String,
    categories: [String]
});

module.exports = model('Category', categorySchema);