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
  fastify.get(
    "/memberships/project/:project_id",
    async function (request, reply) {
      let params = request.params as { project_id: string };
      let project = await prisma.project.findUnique({
        where: { id: Number(params.project_id) },
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
  fastify.get(
    "/memberships/project/:project_id/member-status",
    async function (request, reply) {
      let params = request.params as { project_id: string };
      let project = await prisma.project.findUnique({
        where: { id: Number(params.project_id) },
      });
      if (!project) {
        reply.code(404);
        return { error: "Project not found" };
      }
      const users = await prisma.user.findMany();

      const current_members = await prisma.projectMembership.findMany({
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

      // add a new property to each user object where the value is true if the user is a member of the project
      const users_with_membership_status = users.map((user) => {
        const is_member = current_members.some(
          (member) => member.user.id === user.id
        );
        let membership_id = null;
        if (is_member)
          membership_id = current_members.find(
            (member) => member.user.id === user.id
          )?.id;
        return { ...user, is_member, membership_id };
      });

      return users_with_membership_status;
    }
  );
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
