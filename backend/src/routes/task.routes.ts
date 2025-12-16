import { Router } from "express";
import controller from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, controller.getAll);
router.get("/assigned", authMiddleware, controller.getAssignedTasks);
router.get("/created", authMiddleware, controller.getCreatedTasks);
router.get("/overdue", authMiddleware, controller.getOverdueTasks);

router.post("/", authMiddleware, controller.create);
router.patch("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
