// backend/src/entities/PracticeSession.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class PracticeSession {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    weekId: string;

    @Column({ type: 'int', default: 0 })
    focusMins: number;

    @Column({ type: 'int', default: 0 })
    breakMins: number;

    @Column({ type: 'int', default: 0 })
    cycles: number;

    @CreateDateColumn({ type: 'timestamp' })
    date: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}