/* eslint-disable indent */
const Product = require('../models/Product');
const mongodb = require('mongodb');

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next,
) {
  const subcategory = ctx.query.subcategory;

  if (subcategory) {
    const products = await Product.find({subcategory});
    ctx.body = {products};
    return;
  }

  await next();
  ctx.body = ctx.products;
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.products = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (!mongodb.ObjectID.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const product = await Product.findOne({_id: id});
  if (product) {
    ctx.body = {product};
  } else {
    ctx.status = 404;
  }
};
