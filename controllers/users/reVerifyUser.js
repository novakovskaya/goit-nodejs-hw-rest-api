const { User } = require('../../models/user');
const { createError, sendEmail } = require('../../helpers');

const reVerifyUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw createError(401, 'Email or password is wrong.');
  }

  if (user.verify) {
    throw createError(400, 'Verification has already been passed');
  }

  const mail = {
    to: email,
    subject: 'Confirmation of registration',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click to confirm</a>`,
  };
  await sendEmail(mail);

  res.json({
    code: 200,
    message: 'Verification email sent',
  });
};

module.exports = reVerifyUser;
