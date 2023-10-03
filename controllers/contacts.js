const {Contact} = require("../models/contact")

const { HttpError, controllerWrapper } = require("../helpers");

const getAll = async (_, res) => {

    const result = await Contact.find({}, "-createdAt -updatedAt -__v");

    res.json(result);
};

const getById = async (req, res) => {

    const { id } = req.params;

    const result = await Contact.findById(id);

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const addContact = async (req, res) => {

    const data = req.body;
    const result = await Contact.create(data);

    res.status(201).json(result);
};
const deleteContact = async (req, res) => {

    const { id } = req.params;

    const result = await Contact.findByIdAndDelete(id);

    if (!result) {      
      throw HttpError(404, "Not found");      
    }

    res.json({"message": "contact deleted"});
}

const updateContact = async (req, res) => {

    const data = req.body;
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, data, {new: true} );

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const updateStatusContact = async (req, res) => {
    const data = req.body;
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, data, {new: true} );

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

module.exports = {
    getAll: controllerWrapper(getAll),
    getById: controllerWrapper(getById),
    addContact: controllerWrapper(addContact),
    deleteContact: controllerWrapper(deleteContact),
    updateContact: controllerWrapper(updateContact),
    updateStatusContact: controllerWrapper(updateStatusContact)
}