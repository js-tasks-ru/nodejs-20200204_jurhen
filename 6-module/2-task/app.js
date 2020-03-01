const Koa = require('koa');
const Router = require('koa-router');
const {
  productsBySubcategory,
  productList,
  productById,
} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');

const Category = require('./models/Category');
const Product = require('./models/Product');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

(async function() {
  await Category.deleteMany();
  await Product.deleteMany();

  category = await Category.create({
    title: 'Category1',
    subcategories: [
      {
        title: 'Subcategory1',
      },
    ],
  });

  product = await Product.create({
    title: 'Product1',
    description: 'Description1',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[0].id,
    images: ['image1'],
  });
})();

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

app.use(router.routes());

module.exports = app;
