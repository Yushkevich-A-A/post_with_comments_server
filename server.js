const http = require('http');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const json = require('koa-json');
const router = new Router();
const uuid = require('uuid');
const { ArrPosts } = require('./ArrPosts/ArrPosts');
const posts = new ArrPosts();

app.use(json());

app.use( async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    console.log('! OPTIONS');
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

router.get('/posts/latest', (ctx) => {
  ctx.response.body = {
    status: 'ok',
    data: posts.getLastPosts()
  }
})

router.get('/posts/:posts_id/comments/latest', (ctx) => {
  const id = +ctx.params.posts_id;
  ctx.response.body = {
    status: 'ok',
    data: posts.getLastComments(id),
  }
})

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(port);