import { Router } from "express";
import { getQuizzes, getQuiz, postQuiz, postSubmission, deleteQuiz, updateQuizTitle } from "../controllers/quiz.controller";

const router = Router();

router.get("/", getQuizzes);
router.post("/", postQuiz);
router.get("/:id", getQuiz);
router.post("/:id/submit", postSubmission);
router.delete("/:id", deleteQuiz);
router.put("/:id", updateQuizTitle);

export default router;