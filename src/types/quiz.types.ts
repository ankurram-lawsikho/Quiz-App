export interface IAnswer {
    id: number;
    text: string;
    isCorrect: boolean;
    question?: IQuestion;
}

export interface IQuestion {
    id: number;
    text: string;
    quiz?: IQuiz;
    answers?: IAnswer[];
}

export interface IQuiz {
    id: number;
    title: string;
    questions?: IQuestion[];
}

export interface IQuizSubmission {
    answers: { [questionId: number]: number };
}

export interface IQuizResult {
    score: number;
    total: number;
}
