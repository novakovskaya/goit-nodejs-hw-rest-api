const { Contact } = require('../../models/contact');
const { validationById } = require('../../middlewares');

const updateOneById = async (req, res) => {
  const { contactId } = req.params;
  validationById(contactId);

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.json(result);
};

module.exports = updateOneById;
