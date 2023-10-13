const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

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
    const avatarURL = gravatar.url(email);
    
    const newUser = await User.create({ ...req.body, password: createHachPassword, avatarURL });

    res.status(201).json({

        user: {
            email: newUser.email,
            subscription: newUser.subscription
        }

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
            subscription: user.subscription
        }
    })

};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription
    })
};

const logouter = async (req, res) => {
    const { _id } = req.body;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204)
        .json({
        message: "Logout success"
    })
}

const changeSubscription = async (req, res) => {
    const user = req.user;
    const { subscription } = req.body;
    
    if (subscription !== 'starter' && subscription !== 'pro' && subscription !== 'business') {
        throw HttpError(400, "Please, enter one of variants: 'starter', 'pro', 'business' ")
    }
    await User.findByIdAndUpdate({_id: user._id}, {subscription: subscription}, {new: true});
    
    res.status(200).json({
        message: "Subscription successfuly updated"
    });
}

module.exports = {
    register: controllerWrapper(register),
    loginer: controllerWrapper(loginer),
    getCurrent: controllerWrapper(getCurrent),
    logouter: controllerWrapper(logouter),
    changeSubscription: controllerWrapper(changeSubscription),
}