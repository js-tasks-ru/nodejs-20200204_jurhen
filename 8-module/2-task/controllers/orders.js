const User = require('../models/User');
const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  if (!ctx.user) {
    ctx.status = 401;
    return;
  }

  const order = new Order({
    user: ctx.user,
    product,
    phone,
    address,
  });

  try {
    await order.validate();
  } catch (err) {
    ctx.status = 400;

    const errObj = {};
    const errors = err.errors;
    for (const e in errors) {
      if (errors.hasOwnProperty(e)) {
        errObj[e] = errors[e].properties.message;
      }
    }
    ctx.body = {errors: {...errObj}};
    return;
  }

  const res = await order.save();
  if (res) {
    await sendMail({
      to: ctx.user.email,
      locals: {id: res._id, product: {title: product}},
      template: 'order-confirmation',
    });
    ctx.body = {order: res._id};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;

  if (!user) {
    ctx.status = 401;
    return;
  }

  const orders = await Order.find({user});

  ctx.body = {orders};
};
