const bcrypt = require("bcryptjs");

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

        user: {
            email: newUser.email,
            subscription: "starter"
        }
        // email: newUser.email,

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
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            email: user.email,
            subscription: "starter"
        }
    })

};

const getCurrent = async (req, res) => {
    const { email } = req.user;
    // const { email } = req.user;
    console.log(email);

    res.json({
        email,
    })
};

const logouter = async (req, res) => {
    const { _id } = req.body;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Logout success"
    })
}

module.exports = {
    register: controllerWrapper(register),
    loginer: controllerWrapper(loginer),
    getCurrent: controllerWrapper(getCurrent),
    logouter: controllerWrapper(logouter)
}