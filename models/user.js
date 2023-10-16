const { Schema, model } = require('mongoose');

const Joi = require("joi");

const { handleMongooseError } = require('../helpers');

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type: String,
            default: null,
        },
        avatarURL: {
            type: String,
            required: true,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
            default: "",
  },
    }, { versionKey: false, timestamps: true }
);
userSchema.post("save", handleMongooseError);

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const emailSchema = Joi.object({
    email: Joi.string().email().required(),
});

const schemas = {
    authSchema,
    emailSchema,
}
const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}