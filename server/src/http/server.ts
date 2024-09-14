import fastify from "fastify";

const app = fastify();

await app.listen({ port: 3333 });

console.log("Server is running on port 3333");
