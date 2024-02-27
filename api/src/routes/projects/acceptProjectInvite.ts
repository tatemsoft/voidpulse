import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import * as emoji from "node-emoji";
import { v4 } from "uuid";
import { z } from "zod";
import { ProjectRoleId } from "../../app-router-type";
import { db } from "../../db";
import { boards } from "../../schema/boards";
import { projectUsers } from "../../schema/project-users";
import { users } from "../../schema/users";
import { publicProcedure } from "../../trpc";
import { sendAuthCookies } from "../../utils/createAuthTokens";
import { checkProjectInviteCode } from "../../utils/email/sendProjectInviteEmail";

export const acceptProjectInvite = publicProcedure
  .input(
    z.object({
      code: z.string(),
    })
  )
  .mutation(async ({ input: { code }, ctx }) => {
    const info = await checkProjectInviteCode(code);

    if (!info) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invite not found",
      });
    }

    let user = await db.query.users.findFirst({
      where: eq(users.email, info.email.toLowerCase()),
    });

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: info.email.toLowerCase(),
          passwordHash: "",
        })
        .returning();
    }

    const boardId = v4();

    await db.insert(projectUsers).values({
      projectId: info.projectId,
      userId: user.id,
      role: ProjectRoleId.editor,
      boardOrder: [boardId],
    });

    const [board] = await db
      .insert(boards)
      .values({
        id: boardId,
        creatorId: user.id,
        emoji: emoji.random().emoji,
        title: "My Board",
        projectId: info.projectId,
      })
      .returning();

    sendAuthCookies(ctx.res, user);

    return {
      projectId: info.projectId,
      board,
    };
  });