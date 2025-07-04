import React, { createContext, useContext, useEffect, useState } from 'react';
import { Question, TestAttempt, StudentProgress } from '../types';

interface DataContextType {
  questions: Question[];
  testAttempts: TestAttempt[];
  studentProgress: Record<string, StudentProgress>;
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  addTestAttempt: (attempt: Omit<TestAttempt, 'id'>) => void;
  updateStudentProgress: (studentId: string, progress: Partial<StudentProgress>) => void;
  getStudentProgress: (studentId: string) => StudentProgress;
  getQuestionsDueForReview: (studentId: string, allQuestions: Question[]) => Question[];
  getReviewData: (studentId: string) => Record<string, ReviewData>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface ReviewData {
  lastReviewed: string; // ISO date string
  nextReview: string; // ISO date string
  interval: number; // in minutes
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    topic: 'arrays',
    difficulty: 'easy',
    title: 'Array Basic Operations',
    description: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'Array access by index is O(1) because arrays provide direct access to elements using their index.',
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    id: '2',
    topic: 'arrays',
    difficulty: 'medium',
    title: 'Array Searching',
    description: 'What is the average time complexity of binary search in a sorted array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.',
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    id: '3',
    topic: 'linkedlists',
    difficulty: 'easy',
    title: 'Linked List Basics',
    description: 'What is the time complexity of inserting an element at the beginning of a linked list?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'Inserting at the beginning of a linked list only requires updating the head pointer, which is O(1).',
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    id: '4',
    topic: 'linkedlists',
    difficulty: 'medium',
    title: 'Linked List Traversal',
    description: 'What is the time complexity of finding an element in a singly linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
    explanation: 'Finding an element in a linked list requires traversing from the head, which takes O(n) time in the worst case.',
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    id: '5',
    topic: 'arrays',
    difficulty: 'hard',
    title: 'Dynamic Arrays',
    description: 'What is the amortized time complexity of appending to a dynamic array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: 'Although individual append operations might take O(n) when resizing, the amortized complexity is O(1).',
    createdBy: 'system',
    createdAt: new Date()
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [studentProgress, setStudentProgress] = useState<Record<string, StudentProgress>>({});

  useEffect(() => {
    // Load data from localStorage
    const savedQuestions = localStorage.getItem('questions');
    const savedAttempts = localStorage.getItem('testAttempts');
    const savedProgress = localStorage.getItem('studentProgress');

    setQuestions(savedQuestions ? JSON.parse(savedQuestions) : defaultQuestions);
    setTestAttempts(savedAttempts ? JSON.parse(savedAttempts) : []);
    setStudentProgress(savedProgress ? JSON.parse(savedProgress) : {});

    // Save default questions if none exist
    if (!savedQuestions) {
      localStorage.setItem('questions', JSON.stringify(defaultQuestions));
    }
  }, []);

  const addQuestion = (question: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
  };

  const updateQuestion = (id: string, updatedQuestion: Partial<Question>) => {
    const updatedQuestions = questions.map(q => 
      q.id === id ? { ...q, ...updatedQuestion } : q
    );
    setQuestions(updatedQuestions);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem('questions', JSON.stringify(updatedQuestions));
  };

  const getReviewData = (studentId: string): Record<string, ReviewData> => {
    const data = localStorage.getItem(`reviewData_${studentId}`);
    return data ? JSON.parse(data) : {};
  };

  const setReviewData = (studentId: string, data: Record<string, ReviewData>) => {
    localStorage.setItem(`reviewData_${studentId}` , JSON.stringify(data));
  };

  const updateReviewAfterTest = (studentId: string, attempt: Omit<TestAttempt, 'id'>) => {
    const reviewData = getReviewData(studentId);
    const now = new Date();
    attempt.questions.forEach((q, i) => {
      const wasCorrect = attempt.answers[i] === q.correctAnswer;
      const prev = reviewData[q.id];
      let interval = prev?.interval || 1;
      if (wasCorrect) {
        interval = Math.min(interval * 2, 30); // double interval up to 30 (now minutes)
      } else {
        interval = 1; // reset interval on wrong answer
      }
      const nextReview = new Date(now.getTime() + interval * 5 * 60 * 1000); // 5 minutes per interval
      reviewData[q.id] = {
        lastReviewed: now.toISOString(),
        nextReview: nextReview.toISOString(),
        interval
      };
    });
    setReviewData(studentId, reviewData);
  };

  const addTestAttempt = (attempt: Omit<TestAttempt, 'id'>) => {
    const newAttempt: TestAttempt = {
      ...attempt,
      id: Date.now().toString(),
      testType: attempt.testType || 'normal'
    };
    const updatedAttempts = [...testAttempts, newAttempt];
    setTestAttempts(updatedAttempts);
    localStorage.setItem('testAttempts', JSON.stringify(updatedAttempts));
    // Update student progress
    updateProgressAfterTest(attempt.studentId, attempt);
    // Update review schedule
    updateReviewAfterTest(attempt.studentId, attempt);
  };

  const updateProgressAfterTest = (studentId: string, attempt: Omit<TestAttempt, 'id'>) => {
    const currentProgress = getStudentProgress(studentId);
    const correctAnswers = attempt.answers.filter((answer, index) => 
      answer === attempt.questions[index].correctAnswer
    ).length;

    const arraysQuestions = attempt.questions.filter(q => q.topic === 'arrays');
    const linkedListsQuestions = attempt.questions.filter(q => q.topic === 'linkedlists');
    
    const arraysCorrect = arraysQuestions.filter((q, index) => {
      const originalIndex = attempt.questions.findIndex(aq => aq.id === q.id);
      return attempt.answers[originalIndex] === q.correctAnswer;
    }).length;

    const linkedListsCorrect = linkedListsQuestions.filter((q, index) => {
      const originalIndex = attempt.questions.findIndex(aq => aq.id === q.id);
      return attempt.answers[originalIndex] === q.correctAnswer;
    }).length;

    const updatedProgress: StudentProgress = {
      ...currentProgress,
      arraysProgress: {
        ...currentProgress.arraysProgress,
        questionsAnswered: currentProgress.arraysProgress.questionsAnswered + arraysQuestions.length,
        correctAnswers: currentProgress.arraysProgress.correctAnswers + arraysCorrect,
        mastery: Math.min(100, currentProgress.arraysProgress.mastery + (arraysCorrect / Math.max(arraysQuestions.length, 1)) * 10),
        averageTime: attempt.timeSpent / attempt.questions.length,
        streak: arraysCorrect === arraysQuestions.length ? currentProgress.arraysProgress.streak + 1 : 0
      },
      linkedListsProgress: {
        ...currentProgress.linkedListsProgress,
        questionsAnswered: currentProgress.linkedListsProgress.questionsAnswered + linkedListsQuestions.length,
        correctAnswers: currentProgress.linkedListsProgress.correctAnswers + linkedListsCorrect,
        mastery: Math.min(100, currentProgress.linkedListsProgress.mastery + (linkedListsCorrect / Math.max(linkedListsQuestions.length, 1)) * 10),
        averageTime: attempt.timeSpent / attempt.questions.length,
        streak: linkedListsCorrect === linkedListsQuestions.length ? currentProgress.linkedListsProgress.streak + 1 : 0
      },
      totalTests: currentProgress.totalTests + 1,
      lastActivity: new Date(),
      achievements: [
        ...currentProgress.achievements,
        ...(correctAnswers === attempt.questions.length ? ['Perfect Score'] : []),
        ...(currentProgress.totalTests + 1 === 5 ? ['5 Tests Completed'] : []),
        ...(currentProgress.totalTests + 1 === 10 ? ['10 Tests Completed'] : [])
      ].filter((v, i, a) => a.indexOf(v) === i)
    };

    updateStudentProgress(studentId, updatedProgress);
  };

  const updateStudentProgress = (studentId: string, progress: Partial<StudentProgress>) => {
    const updatedProgress = {
      ...studentProgress,
      [studentId]: {
        ...getStudentProgress(studentId),
        ...progress
      }
    };
    setStudentProgress(updatedProgress);
    localStorage.setItem('studentProgress', JSON.stringify(updatedProgress));
  };

  const getStudentProgress = (studentId: string): StudentProgress => {
    return studentProgress[studentId] || {
      studentId,
      arraysProgress: {
        mastery: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        averageTime: 0,
        streak: 0
      },
      linkedListsProgress: {
        mastery: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        averageTime: 0,
        streak: 0
      },
      totalTests: 0,
      lastActivity: new Date(),
      achievements: []
    };
  };

  const getQuestionsDueForReview = (studentId: string, allQuestions: Question[]): Question[] => {
    const reviewData = getReviewData(studentId);
    const now = new Date();
    return allQuestions.filter(q => {
      const data = reviewData[q.id];
      return data && new Date(data.nextReview) <= now;
    });
  };

  return (
    <DataContext.Provider
      value={{
        questions,
        testAttempts,
        studentProgress,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addTestAttempt,
        updateStudentProgress,
        getStudentProgress,
        getQuestionsDueForReview,
        getReviewData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};