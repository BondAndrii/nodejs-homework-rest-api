const express = require('express');

const controllers = require("../../controllers/contacts"); 

const { validateBody, isValidId, validateFavorite, authenticate } = require("../../middlewares");

const {schemasJoi} = require("../../models/contact")

const router = express.Router();

router.get('/', authenticate, controllers.getAll);

router.get('/:id', authenticate, isValidId, controllers.getById);

router.post('/', authenticate, validateBody(schemasJoi.addSchema), controllers.addContact);

router.delete('/:id', authenticate, isValidId,   controllers.deleteContact);

router.put('/:id', authenticate, isValidId, validateBody(schemasJoi.addSchema), controllers.updateContact);

router.patch('/:id/favorite', authenticate, isValidId, validateFavorite(schemasJoi.updateFavoriteSchema), controllers.updateStatusContact);

module.exports = router;
