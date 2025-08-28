import { Router } from "express";
import { getQuizzes, getQuiz, postQuiz, postSubmission, deleteQuizById, updateQuizById } from "../controllers/quiz.controller";
import { authenticateToken, requirePermission } from "../../../middleware/auth.middleware";

const router = Router();

router.get("/", authenticateToken, requirePermission('quiz', 'read'), getQuizzes);
router.post("/", authenticateToken, requirePermission('quiz', 'create'), postQuiz);
router.get("/:id", authenticateToken, requirePermission('quiz', 'read'), getQuiz);
router.post("/:id/submit", authenticateToken, requirePermission('quiz', 'submit'), postSubmission);
router.delete("/:id", authenticateToken, requirePermission('quiz', 'delete'), deleteQuizById);
router.put("/:id", authenticateToken, requirePermission('quiz', 'update'), updateQuizById);

export default router;