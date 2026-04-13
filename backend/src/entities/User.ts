// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { StudyLog } from "./StudyLog";
import { MockSession } from "./MockSession";
import { Contest } from "./Contest";
import { RoadmapWeek } from "./RoadmapWeek";

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
    createdAt: Date;

    @OneToMany(() => StudyLog, (log) => log.user, { cascade: true })
    logs: StudyLog[];

    @OneToMany(() => MockSession, (mock: MockSession) => mock.user, { cascade: true })
    mocks: MockSession[];

    @OneToMany(() => Contest, (contest: Contest) => contest.user, { cascade: true })
    contests: Contest[];

    @OneToMany(() => RoadmapWeek, (week: RoadmapWeek) => week.user, { cascade: true })
    weeks: RoadmapWeek[];
}