import { Router } from "express";
import authRoute from "./auth.route";
import threadRoute from "./thread.route";
import replyRoute from "./reply.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/threads", threadRoute);
router.use("/reply", replyRoute);

export default router;
