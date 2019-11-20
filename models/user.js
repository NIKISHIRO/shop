const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                }                
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
    console.log('product', product);
    console.log('this', this);
    let items = [...this.cart.items];
    
    const idx = items.findIndex(p => p.productId.toString() === product._id.toString());
    console.log('idx', idx);

    if (idx === -1) {
        items.push({productId: product._id});
    } else {
        items[idx].count += 1;
    }
    this.cart.items = items;
    this.save();
};

module.exports = model('User', userSchema);