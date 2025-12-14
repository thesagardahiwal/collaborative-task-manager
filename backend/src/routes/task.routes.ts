import { Router } from "express";
import controller from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.patch("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
