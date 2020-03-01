/* eslint-disable indent */
const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const queryProduct = ctx.request.query.query;
  let product;

  try {
    product = await Product.find(
      {$text: {$search: queryProduct}},
      {score: {$meta: 'textScore'}},
    ).sort({score: {$meta: 'textScore'}});
  } catch (err) {
    product = [];
  }
  ctx.body = {products: product};
};
