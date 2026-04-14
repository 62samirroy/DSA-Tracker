// backend/src/entities/PracticePlan.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { PracticeTask } from "./PracticeTask";

@Entity()
export class PracticePlan {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.plans, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => PracticeTask, (task) => task.plan, { cascade: true })
    tasks: PracticeTask[];
}