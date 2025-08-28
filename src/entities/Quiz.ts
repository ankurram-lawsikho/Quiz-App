import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IQuiz, IQuestion } from "../types/quiz.types";

@Entity()
export class Quiz implements IQuiz {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @OneToMany("Question", "quiz", { cascade: true, onDelete: "CASCADE" })
    questions!: IQuestion[];
}