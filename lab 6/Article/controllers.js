const express = require('express');

const ArticleService = require('./services.js');

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

router.post('/', authorizeAndExtractToken, authorizeRoles('admin', 'user', 'support'), async (req, res, next) => {
    const {
        username,
        userEmail,
        important,
        question,
        answer
    } = req.body;

    // validare de campuri
    try {
        console.log(userEmail + ' ' +
            important+ ' ' +
            question+ ' ' +
            answer);
        // const fieldsToBeValidated = {
        //     answer: {
        //         value: answer,
        //         type: 'ascii'
        //     },
        //     question: {
        //         value: question,
        //         type: 'ascii'
        //     }
        // };

        // validateFields(fieldsToBeValidated);

        await ArticleService.add(username, userEmail, important, question, answer);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});
router.get('/', authorizeAndExtractToken, authorizeRoles('admin', 'user', 'support'), async (req, res, next) => {
    try {

        const authors = await ArticleService.getAll();
        console.log('aici');
        res.json(authors);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user', 'support'), async (req, res, next) => {
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
        const author = await ArticleService.getById(id);
        res.json(author);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.put('/:id', authorizeAndExtractToken, authorizeRoles('admin', 'user', 'support'), async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        answer,
        important,
        email,
        question
    } = req.body;
    try {

        // const fieldsToBeValidated = {
        //     id: {
        //         value: id,
        //         type: 'ascii'
        //     },
        //     question: {
        //         value: firstName,
        //         type: 'ascii'
        //     },
        //     answer: {
        //         value: lastName,
        //         type: 'ascii'
        //     }
        // };

        // validateFields(fieldsToBeValidated);

        await ArticleService.updateById(id,  answer, important, email, question);
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
        await ArticleService.deleteById(id);
        res.status(204).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

module.exports = router;