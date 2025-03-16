const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number, 
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true
    },
    colors: {
        type: [String],
        default: [],
    },
    ratings: {
        type: [Number],
        default: [],
    },
    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    }
},{timestamps: true});



module.exports = mongoose.model('Product', productSchema);  


