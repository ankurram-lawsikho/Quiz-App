import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IAnswer, IQuestion } from "../types/quiz.types";

@Entity()
export class Answer implements IAnswer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column()
    isCorrect!: boolean;

    @ManyToOne("Question", "answers", { onDelete: "CASCADE" })
    question!: IQuestion;
}