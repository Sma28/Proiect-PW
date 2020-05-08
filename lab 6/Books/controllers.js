const express = require('express');

const BooksService = require('./services.js');
const {
    validateFields
} = require('../utils');
const {
    authorizeAndExtractToken
} = require('../security/Jwt');
const {
    ServerError
} = require('../errors');
const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        name,
        authorId,
        genres
    } = req.body;

    // validare de campuri
    try {

        const fieldsToBeValidated = {
            name: {
                value: name,
                type: 'ascii'
            },
            authorId: {
                value: authorId,
                type: 'ascii'
            }
        };

        validateFields(fieldsToBeValidated);

        if (genres.length === 0) {
            throw new ServerError("No genre defined!", 400);
        }

        for (let genre of genres) {
            if (typeof genre !== 'string') {
                throw new ServerError("Genres should be an array of strings!", 400);
            }
        }
        await BooksService.add(name, authorId, genres);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        // pot sa primesc eroare si ca genul nu e bun
        if (err.message.includes('is not a valid enum value')) {
            next(new ServerError(`Wrong genre selection!`, 400));
        }
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    try {

        const books = await BooksService.getAll();
        res.json(books);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        const book = await BooksService.getById(id);
        res.json(book);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/authors/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const {
        id
    } = req.params;
    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        const books = await BooksService.getByAuthorId(id);
        res.json(books);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        name,
        authorId,
        genres
    } = req.body;
    try {

        const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'ascii'
            },
            name: {
                value: name,
                type: 'ascii'
            },
            authorId: {
                value: authorId,
                type: 'ascii'
            }
        };

        validateFields(fieldsToBeValidated);

        if (genres.length === 0) {
            throw new ServerError("No genre defined!", 400);
        }

        for (let genre of genres) {
            if (typeof genre !== 'string') {
                throw new ServerError("Genres should be an array of strings!", 400);
            }
        }

        await BooksService.updateById(id, name, authorId, genres);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.delete('/:id', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        id
    } = req.params;

    try {

        validateFields({
            id: {
                value: id,
                type: 'ascii'
            }
        });
        // se poate modifica 
        await BooksService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;