const express = require('express');

const FoodService = require('./services.js');

const {
    validateFields
} = require('../utils');
const {
    authorizeAndExtractToken
} = require('../security/Jwt');

const {
    authorizeRoles
} = require('../security/Roles');

const router = express.Router();

router.post('/', authorizeAndExtractToken, authorizeRoles('admin'), async (req, res, next) => {
    const {
        name,
        description,
        picture
    } = req.body;

    // validare de campuri
    try {

        const fieldsToBeValidated = {
            name: {
                value: name,
                type: 'alpha'
            },
            description: {
                value: description,
                type: 'alpha'
            },
            picture: {
                value: picture,
                type: 'String'
            }
        };

        validateFields(fieldsToBeValidated);

        await FoodService.add(name, description, picture);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    try {
        
        const food = await FoodService.getAll();

        res.json(food);
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
        const author = await FoodService.getById(id);
        res.json(author);
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
        description
    } = req.body;
    try {

        const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'ascii'
            },
            name: {
                value: name,
                type: 'alpha'
            },
            description: {
                value: description,
                type: 'alpha'
            }
        };

        validateFields(fieldsToBeValidated);

        await FoodService.updateById(id, name, description);
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
        await FoodService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;