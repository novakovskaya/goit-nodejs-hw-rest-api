const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');

const { User } = require('../../models/user');
const { createError, sendEmail } = require('../../helpers');

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw createError(409, `Email "${email}" in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const { subscription } = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: 'Please, confirm your email.',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click to confirm</a>`,
  };
  await sendEmail(mail);

  res.status(201).json({
    status: 'Created',
    code: 201,
    user: {
      email,
      avatarURL,
      subscription,
      verificationToken,
    },
  });
};

module.exports = signup;
