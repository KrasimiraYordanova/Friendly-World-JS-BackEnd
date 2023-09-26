const notFoundController = require('express').Router();

notFoundController.get('*', (req, res) => {
    res.render('404');
})

module.exports = notFoundController;