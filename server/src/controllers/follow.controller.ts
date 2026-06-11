import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../lib/prisma";

// GET /follows?type=followers | type=following
export const getFollowList = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user!.user_id;
    const type = req.query.type as string;
    const targetUserId = req.query.user_id
      ? parseInt(req.query.user_id as string)
      : currentUserId; // ← default ke current user kalau tidak ada user_id

    if (!type || (type !== "followers" && type !== "following")) {
      return res.status(400).json({
        status: "error",
        message: "Query 'type' harus 'followers' atau 'following'",
      });
    }

    if (type === "followers") {
      const follows = await prisma.following.findMany({
        where: { following_id: targetUserId }, // ← pakai targetUserId
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
            },
          },
        },
      });

      const usersWithStatus = await Promise.all(
        follows.map(async (f) => {
          const isFollowing = await prisma.following.findUnique({
            where: {
              follower_id_following_id: {
                follower_id: currentUserId,
                following_id: f.follower_id,
              },
            },
          });
          return {
            id: String(f.follower.id),
            username: f.follower.username,
            name: f.follower.full_name,
            avatar: f.follower.photo_profile || "",
            is_following: !!isFollowing,
          };
        }),
      );

      return res.json({
        status: "success",
        data: { followers: usersWithStatus },
      });
    } else {
      const follows = await prisma.following.findMany({
        where: { follower_id: targetUserId }, // ← pakai targetUserId
        include: {
          followedUser: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
            },
          },
        },
      });

      // Untuk following, cek apakah current user follow user-user ini
      const usersWithStatus = await Promise.all(
        follows.map(async (f) => {
          const isFollowing = await prisma.following.findUnique({
            where: {
              follower_id_following_id: {
                follower_id: currentUserId,
                following_id: f.following_id,
              },
            },
          });
          return {
            id: String(f.followedUser.id),
            username: f.followedUser.username,
            name: f.followedUser.full_name,
            avatar: f.followedUser.photo_profile || "",
            is_following: !!isFollowing,
          };
        }),
      );

      return res.json({
        status: "success",
        data: { followers: usersWithStatus }, // tetap pakai key "followers" biar frontend konsisten
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Gagal memuat data follow",
    });
  }
};
// POST /follows
export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user!.user_id;
    const { followed_user_id } = req.body;

    if (!followed_user_id) {
      return res.status(400).json({
        status: "error",
        message: "followed_user_id diperlukan",
      });
    }

    const targetId = parseInt(followed_user_id as string); // ← FIX

    if (currentUserId === targetId) {
      return res.status(400).json({
        status: "error",
        message: "Tidak bisa follow diri sendiri",
      });
    }

    const existing = await prisma.following.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: currentUserId,
          following_id: targetId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Anda sudah mengikuti pengguna ini",
      });
    }

    await prisma.following.create({
      data: {
        follower_id: currentUserId,
        following_id: targetId,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "You have successfully followed the user.",
      data: {
        user_id: String(targetId),
        is_following: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Gagal follow user",
    });
  }
};

// DELETE /follows
export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user!.user_id;
    const { followed_id } = req.body;

    if (!followed_id) {
      return res.status(400).json({
        status: "error",
        message: "followed_id diperlukan",
      });
    }

    const targetId = parseInt(followed_id as string); // ← FIX

    const existing = await prisma.following.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: currentUserId,
          following_id: targetId,
        },
      },
    });

    if (!existing) {
      return res.status(400).json({
        status: "error",
        message: "Anda tidak mengikuti pengguna ini",
      });
    }

    await prisma.following.delete({
      where: {
        follower_id_following_id: {
          follower_id: currentUserId,
          following_id: targetId,
        },
      },
    });

    return res.json({
      status: "success",
      message: "You have successfully unfollowed the user.",
      data: {
        user_id: String(targetId),
        is_following: false,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Gagal unfollow user",
    });
  }
};
