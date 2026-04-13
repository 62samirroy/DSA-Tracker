// src/entities/StudyLog.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./User";

@Entity()
@Index(["userId", "date"])
export class StudyLog {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.logs)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    person: string; // "Me" | "Joydeep" | "Both"

    @Column({ type: "timestamp" })
    date: Date;

    @Column()
    phase: string; // "gfg" | "striver" | "leetcode"

    @Column()
    topic: string;

    @Column({ type: "float", default: 0 })
    hours: number;

    @Column({ default: 0 })
    questions: number;

    @Column({ nullable: true })
    difficulty: string; // "easy" | "medium" | "hard"

    @Column({ type: "text", nullable: true })
    note: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}