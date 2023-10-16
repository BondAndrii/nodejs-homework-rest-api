const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require('../models/user');

const { HttpError, controllerWrapper, resizeAvatar, sendEmail } = require("../helpers");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    };

    const createHachPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    
    const newUser = await User.create({ ...req.body, password: createHachPassword, avatarURL, verificationToken});
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click this for verifycation</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({

        user: {
            email: newUser.email,
            subscription: newUser.subscription
        }

    })
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404, 'User not found');
    }
    
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
        message: "Email verify succes",
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body; 

    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404, 'User not found');
    }

    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click this for verifycation</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent",
    })
};

const loginer = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };
    if (!user.verify) {
        throw HttpError(401, "User is not verified");
    }
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
};

const changeSubscription = async (req, res) => {
    const user = req.user;
    const { subscription } = req.body;
    
    if (subscription !== 'starter' && subscription !== 'pro' && subscription !== 'business') {
        throw HttpError(400, "Please, enter one of variants: 'starter', 'pro', 'business' ")
    }
    await User.findByIdAndUpdate({ _id: user._id }, { subscription: subscription }, { new: true });
    
    res.status(200).json({
        message: "Subscription successfuly updated"
    });
};

const changeAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const filename = `${_id}_${originalname}`;
    
    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);

    resizeAvatar(resultUpload);
    
    const avatarURL = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, { avatarURL });
   

    res.json({
        avatarURL,
    })
};

module.exports = {
    register: controllerWrapper(register),
    verifyEmail: controllerWrapper(verifyEmail),
    resendVerifyEmail: controllerWrapper(resendVerifyEmail),
    loginer: controllerWrapper(loginer),
    getCurrent: controllerWrapper(getCurrent),
    logouter: controllerWrapper(logouter),
    changeSubscription: controllerWrapper(changeSubscription),
    changeAvatar: controllerWrapper(changeAvatar),    
}