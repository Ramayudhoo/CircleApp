import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    username: string;
    email: string;
  };
}

interface JwtPayload {
  user_id: number;
  username: string;
  email: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized - Token tidak ada",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized - Token tidak ada",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized - Token tidak valid",
    });
  }
};
