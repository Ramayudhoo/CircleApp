import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";
import { io } from "../index";
import { timeStamp } from "node:console";
import { threadId } from "node:worker_threads";

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
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const Thread = await prisma.threads.create({
      data: {
        content,
        created_by: userId!,
        image: imageUrl,
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
    const responseData = {
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
    };

    io.emit("new_thread", responseData);

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Thread created successfully",
      data: {
        thread: responseData,
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

// ============ TOGGLE LIKE THREADS ============
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
          reply_id: null,
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
// ============ TOGGLE LIKE REPLIES ============
export const toggleReplyLike = async (req: AuthRequest, res: Response) => {
  try {
    const replyId = parseInt(req.params["id"] as string);
    const userId = req.user?.user_id;

    const existingLike = await prisma.likes.findUnique({
      where: {
        user_id_reply_id: {
          user_id: userId!,
          reply_id: replyId,
        },
      },
    });

    if (existingLike) {
      await prisma.likes.delete({
        where: {
          user_id_reply_id: {
            user_id: userId!,
            reply_id: replyId,
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
          reply_id: replyId,
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

// ============== GET THREAD DETAIL =============
export const getThreadDetail = async (req: AuthRequest, res: Response) => {
  try {
    const threadId = parseInt(req.params["id"] as string);
    const currentUserId = req.user?.user_id;

    if (isNaN(threadId)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Thread ID tidak valid",
      });
    }

    const thread = await prisma.threads.findUnique({
      where: { id: threadId },
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

    if (!thread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread tidak ditemukan",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
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
        replies: thread.replies.length,
        isLiked: thread.likes.some((like) => like.user_id === currentUserId),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal ambil detail thread",
    });
  }
};
// ============== GET REPLIES =============

export const getReplies = async (req: AuthRequest, res: Response) => {
  try {
    const threadId = parseInt(req.query["thread_id"] as string);

    if (isNaN(threadId)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "thread_id tidak valid",
      });
    }

    const replies = await prisma.replies.findMany({
      where: { thread_id: threadId },
      orderBy: { created_at: "asc" },
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
      },
    });

    const data = replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      image: reply.image,
      created_at: reply.created_at,
      likes: reply.likes.length,
      isLiked: reply.likes.some((like) => like.user_id === req.user?.user_id),
      user: {
        id: reply.user.id,
        username: reply.user.username,
        name: reply.user.full_name,
        profile_picture: reply.user.photo_profile,
      },
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Replies Successfully",
      data: { replies: data },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal ambil replies",
    });
  }
};

// ============== CREATE REPLIES =============

export const CreateReplies = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const threadId = parseInt(req.query.thread_id as string);
    const userId = req.user?.user_id;

    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    if (!content || isNaN(threadId)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Content dan Thread wajib diisi",
      });
    }

    const reply = await prisma.replies.create({
      data: {
        user_id: userId!,
        thread_id: Number(threadId),
        content,
        image: imageUrl,
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
      message: "Reply berhasil dibuat",
      data: {
        reply: {
          id: reply.id,
          content: reply.content,
          image: reply.image,
          created_at: reply.created_at,
          user: {
            id: reply.user.id,
            username: reply.user.username,
            name: reply.user.full_name,
            profile_picture: reply.user.photo_profile,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal membuat reply",
    });
  }
};

// ============== GET THREAD REPLIES =============
export const getThreadReplies = async (req: AuthRequest, res: Response) => {
  try {
    const threadId = parseInt(req.params["id"] as string);
    const limit = parseInt(req.query.limit as string) || 25;

    if (isNaN(threadId)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Thread ID tidak valid",
      });
    }

    const replies = await prisma.replies.findMany({
      where: { thread_id: threadId },
      take: limit,
      orderBy: { created_at: "asc" },
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
      },
    });

    const data = replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      image: reply.image,
      created_at: reply.created_at,
      likes: reply.likes.length,
      isLiked: reply.likes.some((like) => like.user_id === req.user?.user_id),
      user: {
        id: reply.user.id,
        username: reply.user.username,
        name: reply.user.full_name,
        profile_picture: reply.user.photo_profile,
      },
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Replies Successfully",
      data: { replies: data },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Gagal ambil replies",
    });
  }
};
