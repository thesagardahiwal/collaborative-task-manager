import { Router } from "express";
import controller from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Protected route → Only logged in users can see user list
router.get("/", authMiddleware, controller.getAll);
router.get("/u", authMiddleware, controller.getProfile);
router.put("/", authMiddleware, controller.updateProfile);
export default router;
