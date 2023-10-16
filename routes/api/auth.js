const express = require('express');

const { validateBody, authenticate, upload} = require("../../middlewares");

const { schemas } = require("../../models/user");

const ctrl = require('../../controllers/auth');

const router = express.Router();


router.post("/users/register", validateBody(schemas.authSchema), ctrl.register);

router.get("/users/verify/:verificationToken", ctrl.verifyEmail);

router.post("/users/verify/", validateBody(schemas.emailSchema), ctrl.resendVerifyEmail);

router.post("/users/login", validateBody(schemas.authSchema), ctrl.loginer);

router.get("/users/current", authenticate, ctrl.getCurrent);

router.post("/users/logout", authenticate, ctrl.logouter);

router.patch("/users", authenticate, ctrl.changeSubscription);

router.patch("/users/avatars", authenticate, upload.single("avatar"), ctrl.changeAvatar);

module.exports = router;