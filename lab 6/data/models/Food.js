
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String
    }

}, { timestamps: true });

const FoodModel = mongoose.model('Food', FoodSchema);
module.exports = FoodModel;
