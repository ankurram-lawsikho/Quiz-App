import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { IPermission, IUser } from "../types/auth.types";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @ManyToMany("Permission", "roles", { cascade: true })
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
    })
    permissions!: IPermission[];

    @ManyToMany("User", "roles")
    users!: IUser[];
}
