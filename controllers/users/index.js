const signup = require('./signup');
const login = require('./login');
const logout = require('./logout');
const getCurrent = require('./getCurrent');
const updateSubscription = require('./updateSubscrip');
const updateAvatar = require('./updateAvatar');
const verifyEmail = require('./verifyEmail');
const reVerifyUser = require('./reVerifyUser');

module.exports = {
  signup,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  reVerifyUser,
};
