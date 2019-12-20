const apiRoutes = require('express').Router(),
    entitiesController = require('../controllers/entities');

module.exports = function (app) {
    apiRoutes.get('/entities', entitiesController.suggest);

    app.use('/api', apiRoutes);
};

