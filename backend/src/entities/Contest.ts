// src/entities/Contest.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Contest {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.contests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    name: string;

    @Column({ type: "timestamp" })
    date: Date;

    @Column({ nullable: true })
    myRank: number;

    @Column({ nullable: true })
    partnerRank: number;

    @Column({ default: "0/4" })
    mySolved: string;

    @Column({ default: "0/4" })
    partnerSolved: string;

    @Column({ type: "text", nullable: true })
    note: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}