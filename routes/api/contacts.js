const express = require('express');

const controllers = require("../../controllers/contacts"); 

const { validateBody } = require("../../middlewares");

const schemas = require("../../schemas/contacts")

const router = express.Router();

router.get('/', controllers.getAll);

router.get('/:id', controllers.getById);

router.post('/', validateBody(schemas.addSchema), controllers.addContact);

router.delete('/:id', controllers.deleteContact);

router.put('/:id', validateBody(schemas.addSchema), controllers.updateContact);

module.exports = router;
