import { AppDataSource, redisClient } from "../../../config/data-source";
import { Quiz } from "../../../entities/Quiz";
import { IQuiz, IQuizSubmission, IQuizResult } from "../../../types/quiz.types";

const quizRepository = AppDataSource.getRepository(Quiz);

export const findQuizzes = async (): Promise<IQuiz[]> => {
    const cacheKey = 'quizzes';
    const cachedQuizzes = await redisClient.get(cacheKey);

    if (cachedQuizzes) {
        console.log("Cache HIT for quizzes");
        return JSON.parse(cachedQuizzes);
    }

    console.log("Cache MISS for quizzes");
    const quizzes = await quizRepository.find({ relations: ["questions", "questions.answers"] });
    await redisClient.setEx(cacheKey, 30, JSON.stringify(quizzes));
    return quizzes;
};

export const findQuizById = async (id: number): Promise<IQuiz | null> => {
    const cacheKey = `quiz:${id}`;
    const cachedQuiz = await redisClient.get(cacheKey);

    if (cachedQuiz) {
        console.log(`Cache HIT for quiz:${id}`);
        return JSON.parse(cachedQuiz);
    }

    console.log(`Cache MISS for quiz:${id}`);
    const quiz = await quizRepository.findOne({ where: { id }, relations: ["questions", "questions.answers"] });
    if (quiz) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(quiz));
    }
    return quiz;
};

export const createQuiz = async (quizData: Partial<IQuiz>): Promise<IQuiz> => {
    const quiz = quizRepository.create(quizData);
    const newQuiz = await quizRepository.save(quiz);
    await redisClient.del('quizzes'); // Invalidate quizzes list cache
    return newQuiz;
};

export const submitQuiz = async (id: number, answers: IQuizSubmission['answers']): Promise<IQuizResult | null> => {
    const quiz = await findQuizById(id);
    if (!quiz) {
        return null;
    }

    let score = 0;
    quiz.questions?.forEach((question) => {
        const correctAnswer = question.answers?.find((a) => a.isCorrect);
        if (correctAnswer && correctAnswer.id === answers[question.id]) {
            score++;
        }
    });

    return { score, total: quiz.questions?.length || 0 };
};

export const deleteQuiz = async (id: number): Promise<boolean> => {
    try {
        // First, find the quiz with all its relations
        const quiz = await quizRepository.findOne({ 
            where: { id }, 
            relations: ["questions", "questions.answers"] 
        });
        
        if (!quiz) {
            return false;
        }
        
        // Manually delete answers first
        for (const question of quiz.questions || []) {
            for (const answer of question.answers || []) {
                await AppDataSource.getRepository("Answer").delete(answer.id);
            }
        }
        
        // Then delete questions
        for (const question of quiz.questions || []) {
            await AppDataSource.getRepository("Question").delete(question.id);
        }
        
        // Finally delete the quiz
        const result = await quizRepository.delete(id);
        
        // Invalidate cache
        await redisClient.del(`quiz:${id}`);
        await redisClient.del('quizzes');
        
        return result.affected && result.affected > 0 ? true : false;
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return false;
    }
};