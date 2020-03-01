/* eslint-disable indent */
const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const queryProduct = ctx.params.query;
  let product;
  try {
    product = await Product.findOne(
      {$text: {$search: queryProduct}},
      {score: {$meta: 'textScore'}},
    ).sort({score: {$meta: 'textScore'}});
  } catch (err) {
    product = [];
  }
  ctx.body = {products: product};
};
