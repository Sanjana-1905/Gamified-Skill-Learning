import ReactECharts from 'echarts-for-react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  createdAt: Date;
}

export interface Question {
  id: string;
  topic: 'arrays' | 'linkedlists';
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  createdBy: string;
  createdAt: Date;
}

export interface TestAttempt {
  id: string;
  studentId: string;
  questions: Question[];
  answers: number[];
  score: number;
  timeSpent: number;
  algorithmsUsed: AlgorithmSelection;
  executionTimes: Record<string, number>;
  completedAt: Date;
  testType: 'normal' | 'spaced_repetition';
}

export interface AlgorithmSelection {
  reviewScheduling: 'SM2' | 'MinHeap';
  questionSelection: 'QLearning' | 'Knapsack';
  rewardSystem: 'VariableRatio' | 'FenwickTree';
  knowledgeTracing: 'DKT' | 'DP';
}

export interface StudentProgress {
  studentId: string;
  arraysProgress: {
    mastery: number;
    questionsAnswered: number;
    correctAnswers: number;
    averageTime: number;
    streak: number;
  };
  linkedListsProgress: {
    mastery: number;
    questionsAnswered: number;
    correctAnswers: number;
    averageTime: number;
    streak: number;
  };
  totalTests: number;
  lastActivity: Date;
  achievements: string[];
}

export interface AlgorithmExecutionResult {
  algorithmName: string;
  executionTime: number;
  complexity: {
    time: string;
    space: string;
  };
  description: string;
  visualization?: any;
  topic?: string;
  result?: any;
}

export interface AlgorithmInsights {
  questionSelection: string;
  knowledgeTracing: string;
  reviewScheduler: string;
  rewardSystem: string;
}