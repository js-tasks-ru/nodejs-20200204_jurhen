/* eslint-disable indent */
const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find({});

  ctx.body = {categories};
  next();
};
