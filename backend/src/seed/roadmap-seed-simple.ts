// backend/src/seed/roadmap-seed-simple.ts
import { AppDataSource } from '../config/data-source';
import { RoadmapWeek } from '../entities/RoadmapWeek';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const roadmapData = [
    // PHASE 1 — GFG DSA Course
    { phase: "gfg", weekLabel: "1", title: "Analysis of algorithms", description: "GFG: Analysis of algorithms", hours: 2, hasMock: false, color: "blue", order: 1 },
    { phase: "gfg", weekLabel: "1-2", title: "Arrays & Strings", description: "GFG: Arrays Basics, Sliding Window, Strings chapter", hours: 8, hasMock: false, color: "blue", order: 2 },
    { phase: "gfg", weekLabel: "3", title: "Hashing & Maps", description: "GFG: Hashing chapter + LeetCode Easy warm-up", hours: 4, hasMock: true, color: "green", order: 3 },
    { phase: "gfg", weekLabel: "4-5", title: "Sorting & Binary Search", description: "GFG: Sorting chapter, Binary Search variants", hours: 8, hasMock: false, color: "blue", order: 4 },
    { phase: "gfg", weekLabel: "6", title: "Recursion & Backtracking", description: "GFG: Recursion chapter + Permutations, Subsets", hours: 5, hasMock: true, color: "purple", order: 5 },
    { phase: "gfg", weekLabel: "7-8", title: "Linked List", description: "GFG: LL chapter — Reverse, Cycle Detection, Merge", hours: 8, hasMock: false, color: "blue", order: 6 },
    { phase: "gfg", weekLabel: "9", title: "Stack & Queue", description: "GFG: Stack, Queue, Deque — LRU Cache, Min Stack", hours: 4, hasMock: true, color: "orange", order: 7 },
    { phase: "gfg", weekLabel: "10-11", title: "Trees & BST", description: "GFG: Binary Tree, BST chapter — Traversal, Diameter", hours: 8, hasMock: false, color: "blue", order: 8 },
    { phase: "gfg", weekLabel: "12", title: "Heaps", description: "GFG: Heaps chapter — Kth Largest, Median Stream", hours: 4, hasMock: true, color: "green", order: 9 },
    { phase: "gfg", weekLabel: "13-14", title: "Graphs", description: "GFG: BFS, DFS, Shortest Path, Topological Sort", hours: 10, hasMock: false, color: "blue", order: 10 },
    { phase: "gfg", weekLabel: "15", title: "DP Intro + GFG Review", description: "GFG: DP 1D chapter + Full GFG revision mock", hours: 6, hasMock: true, color: "purple", order: 11 },
    { phase: "striver", weekLabel: "16-17", title: "Arrays + Binary Search [Striver]", description: "Striver A2Z: Step 1–3 complete", hours: 8, hasMock: false, color: "blue", order: 12 },
    { phase: "striver", weekLabel: "18", title: "Strings + Hashing [Striver]", description: "Striver A2Z: Step 4 + push LeetCode Medium", hours: 5, hasMock: true, color: "green", order: 13 },
    { phase: "striver", weekLabel: "19-20", title: "Linked List + Stack/Queue [Striver]", description: "Striver: Step 5–6, start LeetCode Hard", hours: 8, hasMock: false, color: "blue", order: 14 },
    { phase: "striver", weekLabel: "21", title: "Trees + BST [Striver]", description: "Striver: Step 7 complete + Mock session", hours: 5, hasMock: true, color: "orange", order: 15 },
    { phase: "striver", weekLabel: "22-23", title: "Graphs [Striver]", description: "Striver: Graph chapter — Dijkstra, Bellman-Ford, Floyd", hours: 8, hasMock: false, color: "blue", order: 16 },
    { phase: "striver", weekLabel: "24-25", title: "DP Advanced [Striver]", description: "Striver: DP step complete — Partition DP, LCS, MCM", hours: 8, hasMock: true, color: "purple", order: 17 },
    { phase: "striver", weekLabel: "26", title: "Full Revision + Mock Blitz", description: "Weak areas + System Design basics + 2 full mock sessions", hours: 6, hasMock: true, color: "red", order: 18 }
];

async function seedRoadmapWithUser() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected');

        const roadmapRepository = AppDataSource.getRepository(RoadmapWeek);
        const userRepository = AppDataSource.getRepository(User);

        // Create a default user if no users exist
        let users = await userRepository.find();

        if (users.length === 0) {
            console.log('No users found. Creating a default user...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            const defaultUser = userRepository.create({
                name: 'Demo User',
                email: 'demo@example.com',
                password: hashedPassword
            });
            await userRepository.save(defaultUser);
            users = [defaultUser];
            console.log('✅ Created default user: demo@example.com / password123');
        }

        // Add roadmap for each user
        for (const user of users) {
            // Check if user already has roadmap
            const existingCount = await roadmapRepository.count({
                where: { userId: user.id }
            });

            if (existingCount > 0) {
                console.log(`User ${user.email} already has ${existingCount} roadmap items. Skipping...`);
                continue;
            }

            // Add all roadmap weeks
            for (const weekData of roadmapData) {
                const week = roadmapRepository.create({
                    ...weekData,
                    userId: user.id
                });
                await roadmapRepository.save(week);
            }

            console.log(`✅ Added ${roadmapData.length} roadmap weeks for ${user.email}`);
        }

        console.log('🎉 Roadmap seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding roadmap:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seedRoadmapWithUser();