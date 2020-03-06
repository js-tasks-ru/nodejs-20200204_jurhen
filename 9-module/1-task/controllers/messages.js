/* eslint-disable indent */
const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user.id})
    .select('date text user')
    .limit(20);

  ctx.body = {
    messages: [...messages],
  };
};
