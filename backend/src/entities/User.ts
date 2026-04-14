// backend/src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { StudyLog } from "./StudyLog";
import { MockSession } from "./MockSession";
import { Contest } from "./Contest";
import { RoadmapWeek } from "./RoadmapWeek";
import { PracticeSession } from "./PracticeSession";
import { PracticePlan } from "./PracticePlan";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    startDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => StudyLog, (log) => log.user, { cascade: true })
    logs: StudyLog[];

    @OneToMany(() => MockSession, (mock) => mock.user, { cascade: true })
    mocks: MockSession[];

    @OneToMany(() => Contest, (contest) => contest.user, { cascade: true })
    contests: Contest[];

    @OneToMany(() => RoadmapWeek, (week) => week.user, { cascade: true })
    weeks: RoadmapWeek[];

    @OneToMany(() => PracticeSession, (session) => session.user, { cascade: true })
    sessions: PracticeSession[];

    @OneToMany(() => PracticePlan, (plan) => plan.user, { cascade: true })
    plans: PracticePlan[];
}