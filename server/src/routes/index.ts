import { Router } from "express";
import authRoute from "./auth.route";
import threadRoute from "./thread.route";
import replyRoute from "./reply.route";
import userRoute from "./user.route";
import followRoute from "./follow.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/threads", threadRoute);
router.use("/reply", replyRoute);
router.use("/user", userRoute);
router.use("/follows", followRoute);

export default router;
