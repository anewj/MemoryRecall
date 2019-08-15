module.exports = (app) => {
    const account = require('../controllers/account.controller.js');

    // Create a new account
    app.post('/account', account.create);

    // Retrieve all account
    app.get('/account', account.findAll);

    // Retrieve a single account with accountId
    app.get('/account/:accountId', account.findOne);

    // Update a account with accountId
    app.put('/account/:accountId', account.update);

    // Delete a account with accountId
    app.delete('/account/:accountId', account.delete);
}