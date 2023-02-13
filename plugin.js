//import fp from 'fastify-plugin'
import fastifyStatic from '@fastify/static';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { createContainer } from './node_modules/astro/dist/core/dev/index.js';
import { createViteLoader } from './node_modules/astro/dist/core/module-loader/index.js';
import { createRouteManifest } from './node_modules/astro/dist/core/routing/index.js';
import { createDevelopmentEnvironment, renderPage, preload } from './node_modules/astro/dist/core/render/dev/index.js';

export default async function (app, { root }) {
  const container = await createContainer({ root });
  const loader = createViteLoader(container.viteServer);
  const manifest = createRouteManifest({ settings: container.settings }, container.logging);
  const env = createDevelopmentEnvironment(container.settings, container.logging, loader);
  
  // dynamic routes
  for (const route of manifest.routes) {
    app.get(route.route, async (req, reply) => {
      const filePath = new URL(route.component, root);

      const request = new Request(`http://localhost${req.url}`, {
        method: req.method
      });

      const response = await renderPage({
        env,
        filePath,
        preload: await preload({ env, filePath }),
        pathname: req.url,
        request,
        route
      });
      

      reply.code(response.status).headers(Object.fromEntries(response.headers.entries()));
      for await (const chunk of response.body) {
        reply.raw.write(chunk);
      }
      reply.raw.end();
    })
  }

  app.register(fastifyStatic, {
    root: fileURLToPath(container.settings.config.publicDir),
    wildcard: false
  })
}