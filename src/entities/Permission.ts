import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IRole } from "../types/auth.types";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @Column()
    resource!: string; // e.g., 'quiz', 'user', 'role'

    @Column()
    action!: string; // e.g., 'create', 'read', 'update', 'delete'

    @ManyToMany("Role", "permissions")
    roles!: IRole[];
}
