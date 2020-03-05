/* eslint-disable indent */
const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done,
) {
  if (!email) {
    done(null, false, `Не указан email`);
    return;
  }

  let user = await User.findOne({email});

  if (user) {
    done(null, user);
    return;
  }

  try {
    user = await User.create({
      email,
      displayName,
    });

    done(null, user);
  } catch (err) {
    done(err, false, `ValidationError`);
    return;
  }
};
