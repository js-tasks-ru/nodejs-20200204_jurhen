/* eslint-disable indent */
const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();

  const {email, displayName, password} = ctx.request.body;

  const resEmail = await User.findOne({email});
  if (resEmail) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  const newUser = new User({
    email,
    displayName,
    verificationToken: token,
    passwordHash: '',
    salt: '',
  });
  newUser.setPassword(password);
  await newUser.save();

  await sendMail({
    to: email,
    template: 'confirmation',
    subject: `http://localhost:3000/confirm/${token}`,
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOneAndUpdate(
    {verificationToken},
    {$unset: {verificationToken: 1}},
  );

  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  const token = uuid();
  ctx.body = {token};
};
