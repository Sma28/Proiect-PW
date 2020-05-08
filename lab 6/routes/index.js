const Router = require('express')();

const AuthorsController = require('../Authors/controllers.js');
const BooksController = require('../Books/controllers.js');
const UsersController = require('../Users/controllers.js');
const FoodController = require('../Food/controllers.js');
const ArticleController = require('../Article/controllers.js');

Router.use('/authors', AuthorsController);
Router.use('/books', BooksController);
Router.use('/users', UsersController);
Router.use('/food', FoodController);
Router.use('/article', ArticleController);

module.exports = Router;