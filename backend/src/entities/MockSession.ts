// src/entities/MockSession.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class MockSession {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.mocks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({ nullable: true })
    weekNum: number;

    @Column({ type: "timestamp" })
    date: Date;

    @Column()
    topic: string;

    @Column({ nullable: true })
    duration: number;

    @Column({ type: "text", nullable: true })
    q1: string;

    @Column({ type: "text", nullable: true })
    q2: string;

    @Column({ nullable: true })
    perf: string;

    @Column({ type: "text", nullable: true })
    note: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}