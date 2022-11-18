import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
const prisma = new PrismaClient();
const memberships: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/memberships/", async function (request, reply) {
    return prisma.projectMembership.findMany({
      include: { user: true, project: true },
    });
  });
  fastify.get(
    "/memberships/project/:project_id",
    async function (request, reply) {
      let params = request.params as { project_id: number };
      let project = await prisma.project.findUnique({
        where: { id: params.project_id },
      });
      if (!project) {
        reply.code(404);
        return { error: "Project not found" };
      }
      return prisma.projectMembership.findMany({
        where: {
          project: {
            id: project.id,
          },
        },
        include: {
          user: true,
          project: true,
        },
      });
    }
  );
  fastify.get("/memberships/user/:user_id", async function (request, reply) {
    let params = request.params as { user_id: string };
    let user = await prisma.user.findUnique({
      where: { id: Number(params.user_id) },
    });
    if (!user) {
      reply.code(404);
      return { error: "User not found" };
    }
    return prisma.projectMembership.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      include: {
        user: true,
        project: true,
      },
    });
  });
  fastify.post("/memberships/", async function (request, reply) {
    let body = request.body as { project_id: number; user_id: number };
    return prisma.projectMembership.create({
      data: {
        project: {
          connect: {
            id: body.project_id,
          },
        },
        user: {
          connect: {
            id: body.user_id,
          },
        },
      },
    });
  });
  fastify.delete("/memberships/", async function (request, reply) {
    let body = request.body as { id: number };
    return prisma.projectMembership.delete({
      where: {
        id: body.id,
      },
    });
  });
};
export default memberships;
