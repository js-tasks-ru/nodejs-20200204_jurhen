/* eslint-disable indent */
const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done,
) {
  if (!email) {
    done(null, false, `You have to specify email adress`);
    return;
  }

  const user = await User.findOne({email});

  if (!user) {
    try {
      await User.create({
        email,
        displayName,
      });
    } catch (err) {
      done(null, false, `The email is wrong`);
      return;
    }
  }

  done(null, user);
};
