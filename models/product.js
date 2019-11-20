const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('Product', productSchema);