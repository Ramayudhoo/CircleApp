import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;

    const user = await prisma.users.findUnique({
      where: { id: userId! },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        bio: true,
        photo_profile: true,
        created_at: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "user tidak ditemukan",
      });
    }
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Profile Succesfully",
      data: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        bio: user.bio,
        avatar: user.photo_profile,
        follower_count: user._count.followers,
        following_count: user._count.following,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "internal Server Error",
    });
  }
};
export const getUserThreads = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params["id"] as string);
    const currentUserId = req.user?.user_id;

    const threads = await prisma.threads.findMany({
      where: {
        created_by: userId,
      },
      orderBy: {
        created_at: "desc",
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
        likes: true,
        replies: true,
      },
    });

    const data = threads.map((threads) => ({
      id: threads.id,
      content: threads.content,
      image: threads.image,
      created_at: threads.created_at,
      user: {
        id: threads.user.id,
        username: threads.user.username,
        name: threads.user.full_name,
        profile_picture: threads.user.photo_profile,
      },
      likes: threads.likes.length,
      reply: threads.replies.length,
      isLiked: threads.likes.some((like) => like.user_id === currentUserId),
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get USer Thread succesfully",
      data: { threads: data },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;

    const { full_name, username, bio } = req.body;
    const photo_profile = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    const updatedUser = await prisma.users.update({
      where: {
        id: userId!,
      },
      data: {
        full_name,
        username,
        bio,
        ...(photo_profile && { photo_profile }),
      },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        bio: updatedUser.bio,
        photo_profile: updatedUser.photo_profile,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Get profile user lain berdasarkan ID
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const currentUserId = req.user?.user_id;

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        full_name: true,
        email: true,
        bio: true,
        photo_profile: true,
        created_at: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    // Cek apakah current user follow user ini
    const isFollowing = await prisma.following.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: currentUserId!,
          following_id: userId,
        },
      },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get User Profile Successfully",
      data: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        bio: user.bio,
        avatar: user.photo_profile,
        follower_count: user._count.followers,
        following_count: user._count.following,
        is_following: !!isFollowing, // ← penting untuk tombol follow/unfollow
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};
export const searchUser = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;
    const currentUserId = req.user?.user_id;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Query pencarian tidak boleh kosong",
      });
    }

    const users = await prisma.users.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { full_name: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
      },
      take: 20, // batasi 20 hasil
    });

    // Cek follow status untuk tiap user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        if (user.id === currentUserId) {
          return { ...user, is_following: null }; // diri sendiri
        }

        const isFollowing = await prisma.following.findUnique({
          where: {
            follower_id_following_id: {
              follower_id: currentUserId!,
              following_id: user.id,
            },
          },
        });

        return {
          id: user.id,
          username: user.username,
          name: user.full_name || user.username, // ← fallback ke username
          avatar: user.photo_profile || "",
          is_following: user.id === currentUserId ? null : !!isFollowing,
        };
      }),
    );

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Search users successfully",
      data: { users: usersWithStatus },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};

// Get suggested users (yang belum di-follow)
export const getSuggestedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.user_id;

    // Validasi: pastikan user_id ada
    if (!currentUserId) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Unauthorized",
      });
    }

    const limit = parseInt(req.query.limit as string) || 5;

    const users = await prisma.users.findMany({
      where: {
        id: { not: currentUserId }, // ← sekarang pasti number
        followers: {
          none: { follower_id: currentUserId }, // ← pasti number
        },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
        bio: true,
      },
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const mapped = users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.full_name || user.username,
      avatar: user.photo_profile || "",
      bio: user.bio || "",
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get suggested users successfully",
      data: { users: mapped },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};
