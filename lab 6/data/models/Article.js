
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    important: {
        type: Boolean,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    }

}, { timestamps: true });

const ArticleModel = mongoose.model('Article', ArticleSchema);
module.exports = ArticleModel;
