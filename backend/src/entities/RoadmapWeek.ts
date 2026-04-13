// src/entities/RoadmapWeek.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class RoadmapWeek {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.weeks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    phase: string; // "gfg" | "striver"

    @Column()
    weekLabel: string;

    @Column()
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ default: 4 })
    hours: number;

    @Column({ default: false })
    hasMock: boolean;

    @Column({ default: "blue" })
    color: string;

    @Column({ default: 0 })
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}