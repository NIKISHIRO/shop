const {Schema, model} = require('mongoose');

const cardSchema = new Schema({
    cart: {
        items: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    }
});

module.exports = model('Card', cardSchema);