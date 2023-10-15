const express = require('express');

const { validateBody, authenticate, upload} = require("../../middlewares");

const { authSchema } = require("../../models/user");

const ctrl = require('../../controllers/auth');

const router = express.Router();


router.post("/users/register", validateBody(authSchema), ctrl.register );

router.post("/users/login", validateBody(authSchema), ctrl.loginer);

router.get("/users/current", authenticate, ctrl.getCurrent);

router.post("/users/logout", authenticate, ctrl.logouter);

router.patch("/users", authenticate, ctrl.changeSubscription);

router.patch("/users/avatars", authenticate, upload.single("avatar"), ctrl.changeAvatar);

module.exports = router;