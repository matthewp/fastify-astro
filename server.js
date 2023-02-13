// Require the framework and instantiate it
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyAstro from './plugin.js';
import { fileURLToPath } from 'node:url';

const fastify = Fastify({ logger: true });

fastify.register(fastifyAstro, {
  root: new URL('./', import.meta.url)
});


fastify.register(fastifyStatic, {
  root: fileURLToPath(new URL('./public/', import.meta.url)),
  wildcard: false
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()