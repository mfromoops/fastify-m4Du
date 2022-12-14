import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
const prisma = new PrismaClient();
const logs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/logs/", async function (request, reply) {
    return prisma.timeLog.findMany({ include: { project: true, user: true } });
  });
  fastify.post("/logs/start", async function (request, reply) {
    let body = request.body as {
      project_id: string;
      user_id: string;
      details: string;
      session_name: string;
      log_type: string;
    };
    let project = await prisma.project.findUnique({
      where: { id: Number(body.project_id) },
    });
    if (!project) {
      reply.code(404);
      return { error: "Project not found" };
    }
    let user = await prisma.user.findUnique({
      where: { id: Number(body.user_id) },
    });
    if (!user) {
      reply.code(404);
      return { error: "User not found" };
    }
    let membership = await prisma.projectMembership.findFirst({
      where: {
        project: {
          id: project.id,
        },
        user: {
          id: user.id,
        },
      },
    });
    if (!membership) {
      reply.code(404);
      return { error: "User is not a member of this project" };
    }
    let log = await prisma.timeLog.create({
      data: {
        project: {
          connect: {
            id: project.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        date: new Date(),
        start_time: new Date(),
        log_type: "Work",
        session_name: body.session_name,
        details: body.details,
      },
    });
    return log;
  });
  fastify.put("/logs/end", async function (request, reply) {
    let body = request.body as { log_id: string };
    let log = await prisma.timeLog.findUnique({
      where: { id: Number(body.log_id) },
    });
    if (!log) {
      reply.code(404);
      return { error: "Log not found" };
    }
    return prisma.timeLog.update({
      where: {
        id: Number(body.log_id),
      },
      data: {
        end_time: new Date(),
      },
    });
  });
  fastify.get("/logs/project/:project_id", async function (request, reply) {
    let params = request.params as { project_id: string };
    let project = await prisma.project.findUnique({
      where: { id: Number(params.project_id) },
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
      include: {
        user: true,
        project: true,
      },
    });
  });
  fastify.get("/logs/user/:user_id", async function (request, reply) {
    let params = request.params as { user_id: string };
    console.log(typeof params.user_id);
    let user = await prisma.user.findUnique({
      where: { id: Number(params.user_id) },
    });
    if (!user) {
      reply.code(404);
      return { error: "User not found" };
    }

    return prisma.timeLog.findMany({
      where: {
        user: {
          id: +user.id,
        },
      },
      include: {
        user: true,
        project: true,
      },
    });
  });
};
export default logs;
