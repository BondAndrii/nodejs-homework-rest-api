const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const { User } = require('../models/user');

const { HttpError, controllerWrapper } = require("../helpers");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    };

    const createHachPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({ ...req.body, password: createHachPassword });

    res.status(201).json({

        email: newUser.email,

    })
};

const loginer = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }
    const payload = {

        id: user._id,
        
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "11h"} );

    res.json({
        token,
    })

}

module.exports = {
    register: controllerWrapper(register),
    loginer: controllerWrapper(loginer)
}