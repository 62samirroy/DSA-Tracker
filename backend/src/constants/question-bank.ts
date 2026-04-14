// backend/src/constants/question-bank.ts
export const QUESTION_BANK: Record<string, {
    question: string; difficulty: 'easy' | 'medium' | 'hard'; mins: number;
}[]> = {
    'Arrays & Strings': [
        { question: 'Two Sum', difficulty: 'easy', mins: 15 },
        { question: 'Best Time to Buy and Sell Stock', difficulty: 'easy', mins: 20 },
        { question: 'Contains Duplicate', difficulty: 'easy', mins: 10 },
        { question: 'Maximum Subarray (Kadane)', difficulty: 'medium', mins: 25 },
        { question: 'Longest Substring Without Repeating', difficulty: 'medium', mins: 30 },
        { question: 'Sliding Window Maximum', difficulty: 'hard', mins: 45 },
        { question: 'Trapping Rain Water', difficulty: 'hard', mins: 45 },
    ],
    'Hashing & Maps': [
        { question: 'Valid Anagram', difficulty: 'easy', mins: 15 },
        { question: 'Group Anagrams', difficulty: 'medium', mins: 30 },
        { question: 'Top K Frequent Elements', difficulty: 'medium', mins: 30 },
        { question: 'Longest Consecutive Sequence', difficulty: 'hard', mins: 40 },
    ],
    'Sorting & Binary Search': [
        { question: 'Binary Search', difficulty: 'easy', mins: 15 },
        { question: 'Search in Rotated Sorted Array', difficulty: 'medium', mins: 30 },
        { question: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', mins: 25 },
        { question: 'Merge Intervals', difficulty: 'medium', mins: 35 },
        { question: 'Median of Two Sorted Arrays', difficulty: 'hard', mins: 50 },
    ],
    'Recursion & Backtracking': [
        { question: 'Subsets', difficulty: 'medium', mins: 25 },
        { question: 'Permutations', difficulty: 'medium', mins: 30 },
        { question: 'Combination Sum', difficulty: 'medium', mins: 35 },
        { question: 'N-Queens', difficulty: 'hard', mins: 50 },
        { question: 'Sudoku Solver', difficulty: 'hard', mins: 55 },
    ],
    'Linked List': [
        { question: 'Reverse Linked List', difficulty: 'easy', mins: 15 },
        { question: 'Merge Two Sorted Lists', difficulty: 'easy', mins: 20 },
        { question: 'Linked List Cycle', difficulty: 'easy', mins: 20 },
        { question: 'Remove Nth Node From End', difficulty: 'medium', mins: 30 },
        { question: 'LRU Cache', difficulty: 'hard', mins: 50 },
    ],
    'Stack & Queue': [
        { question: 'Valid Parentheses', difficulty: 'easy', mins: 15 },
        { question: 'Min Stack', difficulty: 'medium', mins: 25 },
        { question: 'Daily Temperatures', difficulty: 'medium', mins: 30 },
        { question: 'Largest Rectangle in Histogram', difficulty: 'hard', mins: 50 },
    ],
    'Trees & BST': [
        { question: 'Invert Binary Tree', difficulty: 'easy', mins: 15 },
        { question: 'Maximum Depth of Binary Tree', difficulty: 'easy', mins: 15 },
        { question: 'Diameter of Binary Tree', difficulty: 'easy', mins: 20 },
        { question: 'Binary Tree Level Order Traversal', difficulty: 'medium', mins: 30 },
        { question: 'Lowest Common Ancestor', difficulty: 'medium', mins: 35 },
        { question: 'Serialize & Deserialize BT', difficulty: 'hard', mins: 55 },
    ],
    'Heaps': [
        { question: 'Kth Largest Element in Array', difficulty: 'medium', mins: 25 },
        { question: 'Top K Frequent Words', difficulty: 'medium', mins: 30 },
        { question: 'Merge K Sorted Lists', difficulty: 'hard', mins: 50 },
        { question: 'Find Median from Data Stream', difficulty: 'hard', mins: 55 },
    ],
    'Graphs': [
        { question: 'Number of Islands', difficulty: 'medium', mins: 30 },
        { question: 'Clone Graph', difficulty: 'medium', mins: 35 },
        { question: 'Course Schedule', difficulty: 'medium', mins: 35 },
        { question: 'Pacific Atlantic Water Flow', difficulty: 'medium', mins: 40 },
        { question: "Dijkstra's Shortest Path", difficulty: 'hard', mins: 55 },
    ],
    'Dynamic Programming': [
        { question: 'Climbing Stairs', difficulty: 'easy', mins: 15 },
        { question: 'House Robber', difficulty: 'medium', mins: 25 },
        { question: 'Coin Change', difficulty: 'medium', mins: 35 },
        { question: 'Longest Common Subsequence', difficulty: 'medium', mins: 40 },
        { question: 'Edit Distance', difficulty: 'hard', mins: 55 },
        { question: 'Burst Balloons', difficulty: 'hard', mins: 60 },
    ],
};

export function normalizeTopic(topic: string): string {
    const map: Record<string, string> = {
        'DP Intro + GFG Review': 'Dynamic Programming',
        'DP Advanced [Striver]': 'Dynamic Programming',
        'Arrays + Binary Search [Striver]': 'Arrays & Strings',
        'Strings + Hashing [Striver]': 'Hashing & Maps',
        'Linked List + Stack/Queue [Striver]': 'Linked List',
        'Trees + BST [Striver]': 'Trees & BST',
        'Graphs [Striver]': 'Graphs',
        'Full Revision + Mock Blitz': 'Dynamic Programming',
    };
    return map[topic] ?? topic;
}