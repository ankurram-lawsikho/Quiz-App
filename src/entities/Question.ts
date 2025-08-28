import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { IQuestion, IQuiz, IAnswer } from "../types/quiz.types";

@Entity()
export class Question implements IQuestion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @ManyToOne("Quiz", "questions", { onDelete: "CASCADE" })
    quiz!: IQuiz;

    @OneToMany("Answer", "question", { cascade: true, onDelete: "CASCADE" })
    answers!: IAnswer[];
}