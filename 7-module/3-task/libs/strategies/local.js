/* eslint-disable indent */
const User = require('./../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
  {usernameField: 'email', session: false},
  async (email, password, done) => {
    const user = await User.findOne({email});
    if (user) {
      try {
        const isPass = await user.checkPassword(password);
        if (isPass) {
          done(null, user);
          return;
        } else {
          done(null, false, 'Неверный пароль');
          return;
        }
      } catch (err) {
        done(null, false, 'Нет такого пользователя');
        return;
      }
    }
  },
);
