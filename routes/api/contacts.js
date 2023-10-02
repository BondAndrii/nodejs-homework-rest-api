const express = require('express');

const controllers = require("../../controllers/contacts"); 

const { validateBody, isValidId, validateFavorite } = require("../../middlewares");

const {schemasJoi} = require("../../models/contact")

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/:id', isValidId, controllers.getById);

router.post('/', validateBody(schemasJoi.addSchema), controllers.addContact);

router.delete('/:id', isValidId,   controllers.deleteContact);

router.put('/:id', isValidId, validateBody(schemasJoi.addSchema), controllers.updateContact);

router.patch('/:id/favorite', isValidId, validateFavorite(schemasJoi.updateFavoriteSchema), controllers.updateStatusContact);

module.exports = router;
