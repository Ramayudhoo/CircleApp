import type { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";

export async function getSummary(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.user_id;

    const totalFollowers = await prisma.following.count({
      where: { following_id: userId! },
    });

    const totalThreads = await prisma.threads.count({
      where: { created_by: userId! },
    });

    const totalLikes = await prisma.likes.count({
      where: {
        thread: { created_by: userId! },
      },
    });

    const totalReplies = await prisma.replies.count({
      where: {
        thread: { created_by: userId! },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalFollowers,
        totalThreads,
        totalLikes,
        totalReplies,
      },
    });
  } catch (error) {
    console.error("Error getSummary:", error);
    return res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data summary" });
  }
}

export async function getTopThreads(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.user_id;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const cursor = req.query.cursor as string | undefined;
    const days = req.query.days ? Number(req.query.days) : undefined;

    const dateFilter = days
      ? {
          created_at: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          },
        }
      : {};

    const threads = await prisma.threads.findMany({
      where: { created_by: userId, ...dateFilter },
      select: {
        id: true,
        content: true,
        image: true,
        created_at: true,
        _count: {
          select: { likes: true, replies: true },
        },
      },
    });

    const sorted = threads
      .map((t) => ({
        id: t.id,
        content: t.content,
        image: t.image,
        created_at: t.created_at,
        totalLikes: t._count.likes,
        totalReplies: t._count.replies,
        score: t._count.likes + t._count.replies,
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.id - a.id;
      });

    let startIndex = 0;
    if (cursor) {
      const [cursorScoreStr, cursorIdStr] = cursor.split("_");
      const cursorScore = Number(cursorScoreStr);
      const cursorId = Number(cursorIdStr);

      const cursorIndex = sorted.findIndex(
        (t) => t.score === cursorScore && t.id === cursorId,
      );
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const page = sorted.slice(startIndex, startIndex + limit);
    const lastItem = page[page.length - 1];
    const nextCursor = lastItem ? `${lastItem.score}_${lastItem.id}` : null;
    const hasMore = startIndex + limit < sorted.length;

    return res.status(200).json({
      success: true,
      data: page,
      nextCursor: hasMore ? nextCursor : null,
    });
  } catch (error) {
    console.error("Error getTopThreads:", error);
    return res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data top threads" });
  }
}

export async function getActivity(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.user_id;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const cursor = req.query.cursor as string | undefined;
    const cursorDate = cursor ? new Date(cursor) : undefined;

    const dateFilter = cursorDate ? { created_at: { lt: cursorDate } } : {};

    const [recentLikes, recentReplies, recentFollows] = await Promise.all([
      prisma.likes.findMany({
        where: {
          thread: { created_by: userId },
          user_id: { not: userId },
          ...dateFilter,
        },
        select: {
          id: true,
          created_at: true,
          user: { select: { username: true } },
          thread: { select: { content: true } },
        },
        orderBy: { created_at: "desc" },
        take: limit,
      }),

      prisma.replies.findMany({
        where: {
          thread: { created_by: userId },
          user_id: { not: userId },
          ...dateFilter,
        },
        select: {
          id: true,
          content: true,
          created_at: true,
          user: { select: { username: true } },
        },
        orderBy: { created_at: "desc" },
        take: limit,
      }),

      prisma.following.findMany({
        where: {
          following_id: userId,
          ...dateFilter,
        },
        select: {
          id: true,
          created_at: true,
          follower: { select: { username: true } },
        },
        orderBy: { created_at: "desc" },
        take: limit,
      }),
    ]);

    const merged = [
      ...recentLikes.map((l) => ({
        id: `like-${l.id}`,
        type: "like" as const,
        username: l.user.username,
        excerpt: l.thread?.content?.slice(0, 60) ?? null,
        created_at: l.created_at,
      })),
      ...recentReplies.map((r) => ({
        id: `reply-${r.id}`,
        type: "reply" as const,
        username: r.user.username,
        excerpt: r.content.slice(0, 60),
        created_at: r.created_at,
      })),
      ...recentFollows.map((f) => ({
        id: `follow-${f.id}`,
        type: "follow" as const,
        username: f.follower.username,
        excerpt: null,
        created_at: f.created_at,
      })),
    ].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    const page = merged.slice(0, limit);
    const lastItem = page[page.length - 1];
    const nextCursor = lastItem ? lastItem.created_at.toISOString() : null;
    const hasMore = page.length === limit;

    return res.status(200).json({
      success: true,
      data: page,
      nextCursor: hasMore ? nextCursor : null,
    });
  } catch (error) {
    console.error("Error getActivity:", error);
    return res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data activity" });
  }
}
