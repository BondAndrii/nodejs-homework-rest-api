const contacts = require("../models/contacts");

const { HttpError, controllerWrapper } = require("../helpers");

const getAll = async (_, res) => {

    const result = await contacts.listContacts();

    res.json(result);
};

const getById = async (req, res) => {

    const { id } = req.params;
    const result = await contacts.getContactById(id);

    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const addContact = async (req, res) => {

    const data = req.body;
    const result = await contacts.addContact(data);

    res.status(201).json(result);
};
const deleteContact = async (req, res) => {

    const { id } = req.params;
    const result = await contacts.removeContact(id);

    if (!result) {      
      throw HttpError(404, "Not found");      
    }

    res.json({"message": "contact deleted"});
}

const updateContact = async (req, res) => {

    const data = req.body;
    const { id } = req.params;
    const result = await contacts.updateContact(id, data);

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
    updateContact: controllerWrapper(updateContact)
}