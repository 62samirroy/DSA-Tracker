// backend/src/entities/PracticeTask.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { PracticePlan } from "./PracticePlan";

@Entity()
export class PracticeTask {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    planId: string;

    @ManyToOne(() => PracticePlan, (plan) => plan.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "planId" })
    plan: PracticePlan;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    topic: string;

    @Column()
    question: string;

    @Column({ default: 'medium' })
    difficulty: string;

    @Column({ type: 'int', default: 30 })
    estimateMins: number;

    @Column({ default: false })
    done: boolean;

    @Column({ type: 'text', nullable: true })
    note: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}