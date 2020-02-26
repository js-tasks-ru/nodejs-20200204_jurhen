/* eslint-disable indent */
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next,
) {
  // const products = Product.find({});
  // ctx.body = {products};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  ctx.body = {};
};
