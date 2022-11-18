import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
const prisma = new PrismaClient();
const logs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/logs/", async function (request, reply) {
    return prisma.timeLog.findMany();
  });
  fastify.get("/logs/project/:project_id", async function (request, reply) {
    let params = request.params as { project_id: number };
    let project = await prisma.project.findUnique({
      where: { id: params.project_id },
    });
    if (!project) {
      reply.code(404);
      return { error: "Project not found" };
    }
    return prisma.timeLog.findMany({
      where: {
        project: {
          id: project.id,
        },
      },
    });
  });
  fastify.get("/logs/user/:user_id", async function (request, reply) {
    let params = request.params as { user_id: number };
    let user = await prisma.user.findUnique({
      where: { id: params.user_id },
    });
    if (!user) {
      reply.code(404);
      return { error: "User not found" };
    }

    return prisma.timeLog.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  });
  fastify.post("/logs/", async function (request, reply) {
    let body = request.body as any;
    return prisma.timeLog.create(body);
  });
};
export default logs;
