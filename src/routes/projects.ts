import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
const prisma = new PrismaClient();
const projects: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/projects/", async function (request, reply) {
    return prisma.project.findMany();
  });
  fastify.post("/projects/", async function (request, reply) {
    let body = request.body as { name: string; description: string };
    return prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
      },
    });
  });
  fastify.put("/projects/", async function (request, reply) {
    let body = request.body as { id: number };

    return prisma.project.update({
      where: {
        id: body.id,
      },
      data: request.body as any,
    });
  });
  fastify.delete("/projects/", async function (request, reply) {
    let body = request.body as { id: number };
    return prisma.project.delete({
      where: {
        id: body.id,
      },
    });
  });
};

export default projects;
