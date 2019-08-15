const Account = require('../models/account.model.js');

// Create and Save a new account
exports.create = (req, res) => {
    // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "name can not be empty"
        });
    }
    if(!req.body.emailId) {
        return res.status(400).send({
            message: "emailId can not be empty"
        });
    }

    // Create a account
    const account = new Account({
        name: req.body.name,
        emailId: req.body.emailId
    });

    // Save account in the database
    account.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the account."
        });
    });
};

// Retrieve and return all accounts from the database.
exports.findAll = (req, res) => {
    Account.find()
        .then(accounts => {
            res.send(accounts);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving accounts."
        });
    });
};

// Find a single account with a accountId
exports.findOne = (req, res) => {
    Account.findById(req.params.accountId)
        .then(account => {
            if(!account) {
                return res.status(404).send({
                    message: "account not found with id " + req.params.accountId
                });
            }
            res.send(account);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "account not found with id " + req.params.accountId
            });
        }
        return res.status(500).send({
            message: "Error retrieving account with id " + req.params.accountId
        });
    });
};

// Update a account identified by the accountId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.emailId) {
        return res.status(400).send({
            message: "account emailId can not be empty"
        });
    }

    // Find account and update it with the request body
    Account.findByIdAndUpdate(req.params.accountId, {
        title: req.body.title || "Untitled account",
        emailId: req.body.emailId
    }, {new: true})
        .then(account => {
            if(!account) {
                return res.status(404).send({
                    message: "account not found with id " + req.params.accountId
                });
            }
            res.send(account);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "account not found with id " + req.params.accountId
            });
        }
        return res.status(500).send({
            message: "Error updating account with id " + req.params.accountId
        });
    });
};

// Delete a account with the specified accountId in the request
exports.delete = (req, res) => {
    Account.findByIdAndRemove(req.params.accountId)
        .then(account => {
            if(!account) {
                return res.status(404).send({
                    message: "account not found with id " + req.params.accountId
                });
            }
            res.send({message: "account deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "account not found with id " + req.params.accountId
            });
        }
        return res.status(500).send({
            message: "Could not delete account with id " + req.params.accountId
        });
    });
};