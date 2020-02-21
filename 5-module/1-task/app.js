const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const clients = [];

router.get('/subscribe', async (ctx, next) => {
  const r = ctx.request.query.r;

  clients.push(ctx);

  await new Promise((resolve, reject) => {
    setInterval(() => {
      if (clients.length > 0) return;
      resolve(true);
    }, 10);
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.response.status = 406;
    return;
  }

  clients.forEach((clientCtx) => {
    clientCtx.response.body = message;
  });

  clients.length = 0;

  ctx.response.status = 201;
});

app.use(router.routes());

module.exports = app;
