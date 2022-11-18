import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
const prisma = new PrismaClient();
const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/users/", async function (request, reply) {
    return prisma.user.findMany();
  });
  fastify.get("/users/:id", async function (request, reply) {
    let params = request.params as { id: number };
    let user = await prisma.user.findUnique({
      where: { id: params.id },
    });
    if (!user) {
      reply.code(404);
      return { error: "User not found" };
    }
    return user;
  });
  fastify.post("/users/", async function (request, reply) {
    let body = request.body as { name: string; email: string; type: string };
    let user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        type: body.type,
      },
    });
    return user;
  });
  fastify.put("/users/", async function (request, reply) {
    let body = request.body as {
      id: number;
      name: string;
      email: string;
      type: string;
    };
    return prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        email: body.email,
        type: body.type,
      },
    });
  });
  fastify.delete("/users/", async function (request, reply) {
    let body = request.body as { id: number };
    return prisma.user.delete({
      where: {
        id: body.id,
      },
    });
  });
};

export default users;