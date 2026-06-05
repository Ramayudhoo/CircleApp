import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";

// ============ GET THREADS ============
export const getThreads = async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 25;
    const currentUserId = req.user?.user_id;

    const threads = await prisma.threads.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
        likes: true,
        replies: true,
      },
    });

    const data = threads.map((thread) => ({
      id: thread.id,
      content: thread.content,
      image: thread.image,
      created_at: thread.created_at,
      user: {
        id: thread.user.id,
        username: thread.user.username,
        name: thread.user.full_name,
        profile_picture: thread.user.photo_profile,
      },
      likes: thread.likes.length,
      reply: thread.replies.length,
      isLiked: thread.likes.some((like) => like.user_id === currentUserId),
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: { threads: data },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal ambil data thread",
    });
  }
};

// ============ CREATE THREAD ============
export const createThread = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.user?.user_id;

    if (!content) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Content thread tidak boleh kosong",
      });
    }

    const Thread = await prisma.threads.create({
      data: {
        content,
        created_by: userId!,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
      },
    });

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Thread created successfully",
      data: {
        thread: {
          id: Thread.id,
          content: Thread.content,
          image: Thread.image,
          created_at: Thread.created_at,
          user: {
            id: Thread.user.id,
            username: Thread.user.username,
            name: Thread.user.full_name,
            profile_picture: Thread.user.photo_profile,
          },
          likes: 0,
          reply: 0,
          isLiked: false,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal membuat thread",
    });
  }
};

// ============ TOGGLE LIKE ============
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const threadId = parseInt(req.params["id"] as string);
    const userId = req.user?.user_id;

    const existingLike = await prisma.likes.findUnique({
      where: {
        user_id_thread_id: {
          user_id: userId!,
          thread_id: threadId,
        },
      },
    });

    if (existingLike) {
      await prisma.likes.delete({
        where: {
          user_id_thread_id: {
            user_id: userId!,
            thread_id: threadId,
          },
        },
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Thread unliked",
      });
    } else {
      await prisma.likes.create({
        data: {
          user_id: userId!,
          thread_id: threadId,
        },
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Thread liked",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal toggle like thread",
    });
  }
};
