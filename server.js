// Require the framework and instantiate it
import Fastify from 'fastify';
import fastifyAstro from './plugin.js';

const fastify = Fastify({ logger: true });

// Declare a route
/*fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})*/

fastify.register(fastifyAstro, {
  root: new URL('./', import.meta.url)
});

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


/*
fastify.register(
  require('./my-plugin'),
  { options }
)
*/