import { Router } from "express";
import authRoute from "./auth.route";
import threadRoute from "./thread.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/threads", threadRoute);

export default router;
