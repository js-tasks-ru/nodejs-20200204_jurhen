const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = {};

router.get('/subscribe', async (ctx, next) => {
  const r = ctx.request.query.r || Math.random();

  const res = await new Promise((resolve, reject) => {
    clients[r] = resolve;
  });

  ctx.body = res;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    ctx.response.status = 406;
    return;
  }

  for (const r in clients) {
    if (clients.hasOwnProperty(r)) {
      clients[r](message);
    }
  }

  clients = {};

  ctx.response.status = 201;
});

app.use(router.routes());

module.exports = app;
