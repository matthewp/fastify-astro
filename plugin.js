import { DevApp } from 'astro/app/dev';

export default async function (fastify, { root }) {
  const app = new DevApp({ root });
  await app.load();
  
  // dynamic routes
  for (const route of app.routes) {
    fastify.get(route.route, async (req, reply) => {
      const request = new Request(`http://localhost${req.url}`, {
        method: req.method
      });

      const response = await app.render(request);      

      reply.code(response.status).headers(Object.fromEntries(response.headers.entries()));
      for await (const chunk of response.body) {
        reply.raw.write(chunk);
      }
      reply.raw.end();
    });
  }
}