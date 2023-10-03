const express = require('express');

const { validateBody } = require("../../middlewares");

const { authSchema } = require("../../models/user");

const ctrl = require('../../controllers/auth');

const router = express.Router();


router.post("/user/register", validateBody(authSchema), ctrl.register );

router.post("/users/login", validateBody(authSchema), ctrl.loginer)

module.exports = router;