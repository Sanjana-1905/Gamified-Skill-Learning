import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { AlgorithmSelection, Question, AlgorithmExecutionResult, AlgorithmInsights } from '../types';
import { reviewSchedulingAlgorithms, questionSelectionAlgorithms, rewardSystemAlgorithms, knowledgeTracingAlgorithms, getQuestionSelectionExplanation, getKnowledgeTracingExplanation, getReviewSchedulerExplanation, getRewardSystemExplanation } from '../algorithms';
import { Clock, CheckCircle, ArrowRight, Cpu, Zap, RefreshCw, Brain, Target, Star, Zap as Lightning, Timer, Award, BookOpen, Gift, Eye, EyeOff } from 'lucide-react';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

const TestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, addTestAttempt } = useData();
  
  const reviewMode = location.state?.reviewMode;
  const reviewQuestions = location.state?.reviewQuestions;
  
  const algorithms = location.state?.algorithms as AlgorithmSelection;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [executionResults, setExecutionResults] = useState<AlgorithmExecutionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlgorithmDetails, setShowAlgorithmDetails] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<null | 'correct' | 'incorrect'>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [algorithmResults, setAlgorithmResults] = useState<any>(null);
  const [algorithmFeedback, setAlgorithmFeedback] = useState<string>('');
  const [algorithmInsights, setAlgorithmInsights] = useState<AlgorithmInsights | null>(null);
  const [showAlgorithmInsights, setShowAlgorithmInsights] = useState(false);
  const [qTable, setQTable] = useState<number[][] | null>(null);
  const [dktHistory, setDktHistory] = useState<{inputs: number[], targets: number[]}>({inputs: [], targets: []});
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [minHeapPriorities, setMinHeapPriorities] = useState<number[]>([]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Clear algorithm feedback after 3 seconds
  useEffect(() => {
    if (algorithmFeedback) {
      const timer = setTimeout(() => {
        setAlgorithmFeedback('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [algorithmFeedback]);

  useEffect(() => {
    if (reviewMode && reviewQuestions && reviewQuestions.length > 0) {
      setTestQuestions(reviewQuestions);
      // Provide a default algorithms object for review mode if missing
      if (!location.state.algorithms) {
        location.state.algorithms = {
          reviewScheduling: 'MinHeap',
          questionSelection: 'QLearning',
          rewardSystem: 'FenwickTree',
          knowledgeTracing: 'DP',
        };
      }
      setIsLoading(false);
      return;
    }
    if (!algorithms || !user) {
      navigate('/student');
      return;
    }
    generateTest();
  }, [algorithms, user, questions, reviewMode, reviewQuestions]);

  // Helper for Q-Learning update
  function updateQTable(qTable: number[][], state: number, action: number, reward: number, nextState: number, alpha=0.1, gamma=0.9) {
    const newQTable = qTable.map(row => [...row]);
    const maxNextQ = Math.max(...newQTable[nextState]);
    newQTable[state][action] = newQTable[state][action] + alpha * (reward + gamma * maxNextQ - newQTable[state][action]);
    return newQTable;
  }

  // Helper for DKT (simulate: just use running average for now)
  function runDKT(inputs: number[], targets: number[]) {
    let avg = targets.length ? targets.reduce((a, b) => a + b, 0) / targets.length : 0.5;
    avg = Math.max(0, Math.min(1, avg)); // Clamp between 0 and 1
    return { predictions: [avg], hiddenStates: [] };
  }

  const generateTest = () => {
    setIsLoading(true);
    const arrayQuestions = questions.filter(q => q.topic === 'arrays');
    const linkedListQuestions = questions.filter(q => q.topic === 'linkedlists');
    let selectedQuestions: Question[] = [];
    let results: AlgorithmExecutionResult[] = [];

    // Q-Learning: initialize Q-table if not present
    let initialQTable = qTable;
    if (!initialQTable) {
      const N = arrayQuestions.length + linkedListQuestions.length;
      initialQTable = [Array(N).fill(0)];
      setQTable(initialQTable);
    }

    // Select questions using Q-Learning or fallback
    let indices: number[] = [];
    // --- Question Selection ---
    if (algorithms.questionSelection === 'QLearning' && initialQTable) {
      const epsilon = 0.2;
      const qValues = initialQTable[0];
      const usedIndices = new Set<number>();
      for (let i = 0; i < 5; i++) {
        let action;
        let tries = 0;
        do {
          if (Math.random() < epsilon) {
            action = Math.floor(Math.random() * qValues.length);
          } else {
            action = qValues.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
          }
          tries++;
        } while (usedIndices.has(action) && tries < 10 * qValues.length);
        usedIndices.add(action);
        indices.push(action);
      }
      selectedQuestions = Array.from(usedIndices).map(idx => [...arrayQuestions, ...linkedListQuestions][idx]).slice(0, 5);
      results.push(questionSelectionAlgorithms.QLearning(initialQTable, 0, epsilon));
    } else if (algorithms.questionSelection === 'Knapsack') {
      const pool = [...arrayQuestions, ...linkedListQuestions];
      const weights = pool.map(q => q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3);
      const values = pool.map((q, i) => answers[i] === q.correctAnswer ? 1 : 0);
      const capacity = 8;
      const knapsackResult = questionSelectionAlgorithms.Knapsack(weights, values, capacity);
      const selectedKnapsackIndices = knapsackResult.result?.selectedItems || [];
      let selectedQuestionsKnapsack = selectedKnapsackIndices.map((idx: number) => pool[idx]);
      // Ensure uniqueness
      const alreadySelected = new Set(selectedKnapsackIndices);
      const fillQuestions = pool.filter((_, i) => !alreadySelected.has(i)).slice(0, 5 - selectedQuestionsKnapsack.length);
      selectedQuestionsKnapsack = [...selectedQuestionsKnapsack, ...fillQuestions];
      // Remove duplicates just in case
      const seen = new Set();
      selectedQuestions = selectedQuestionsKnapsack.filter((q: any) => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      }).slice(0, 5);
      results.push(knapsackResult);
    } else if (algorithms.questionSelection && algorithms.questionSelection.toLowerCase() === 'ucb') {
      const pool = [...arrayQuestions, ...linkedListQuestions];
      const rewards = pool.map((q, i) => answers[i] === q.correctAnswer ? 1 : 0);
      const counts = pool.map((_, i) => answers[i] !== undefined ? 1 : 0);
      const totalCount = counts.reduce((a: number, b: number) => a + b, 0) || 1;
      const ucbResult = questionSelectionAlgorithms.UCB(rewards, counts, totalCount);
      selectedQuestions = pool.slice(0, 5);
      results.push(ucbResult);
    } else if (algorithms.questionSelection && algorithms.questionSelection.toLowerCase() === 'thompsonsampling') {
      const pool = [...arrayQuestions, ...linkedListQuestions];
      const alphas = pool.map((q, i) => answers[i] === q.correctAnswer ? 2 : 1);
      const betas = pool.map((q, i) => answers[i] === q.correctAnswer ? 1 : 2);
      const tsResult = questionSelectionAlgorithms.ThompsonSampling(alphas, betas);
      selectedQuestions = pool.slice(0, 5);
      results.push(tsResult);
    } else {
      // Ensure no repeats in fallback
      const allQs = [...arrayQuestions, ...linkedListQuestions];
      const seen = new Set();
      selectedQuestions = allQs.filter((q: any) => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      }).slice(0, 5);
      results.push({algorithmName: 'Random', executionTime: 0, complexity: {time: 'O(1)', space: 'O(1)'}, description: 'Random selection', result: {}});
    }
    setSelectedIndices(indices);

    // Map answers to selectedQuestions, always length 5, treat missing as 0
    const selectedAnswers = selectedQuestions.map(q => {
      const idx = testQuestions.findIndex(qq => qq.id === q.id);
      return idx !== -1 && answers[idx] !== undefined ? answers[idx] : -9999; // -9999 means unanswered
    });

    // --- Review Scheduling ---
    if (algorithms.reviewScheduling === 'MinHeap') {
      let priorities = minHeapPriorities.length === selectedQuestions.length
        ? minHeapPriorities.slice()
        : Array(selectedQuestions.length).fill(5);
      results.push(reviewSchedulingAlgorithms.MinHeap(priorities));
    } else if (algorithms.reviewScheduling === 'SM2') {
      const difficulty = 3;
      const interval = 1;
      const repetitions = 1;
      results.push(reviewSchedulingAlgorithms.SM2(difficulty, interval, repetitions));
    } else if (algorithms.reviewScheduling === 'FSRS') {
      const stability = 2;
      const difficulty = 3;
      results.push(reviewSchedulingAlgorithms.FSRS(stability, difficulty));
    }

    // --- Reward System ---
    if (algorithms.rewardSystem === 'FenwickTree') {
      const fenwickArr = selectedQuestions.map((q, i) => selectedAnswers[i] === q.correctAnswer ? 1 : 0);
      results.push(rewardSystemAlgorithms.FenwickTree(fenwickArr, 0, fenwickArr.length - 1));
    } else if (algorithms.rewardSystem === 'VariableRatio') {
      const responses = selectedAnswers.filter(a => a !== -9999).length;
      const schedule = [2, 3, 4, 5];
      results.push(rewardSystemAlgorithms.VariableRatio(responses, schedule));
    } else if (algorithms.rewardSystem === 'Greedy') {
      const activities = selectedQuestions.map((q, i) => ({ reward: selectedAnswers[i] === q.correctAnswer ? 1 : 0, time: 1 }));
      results.push(rewardSystemAlgorithms.Greedy(activities));
    }

    // --- Knowledge Tracing ---
    if (algorithms.knowledgeTracing === 'DP') {
      // Build a 2D DP matrix: rows = possible correct answers (states), columns = questions
      const n = selectedQuestions.length;
      const dpMatrix = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
      dpMatrix[0][0] = 1; // 0 correct at 0 questions is possible
      for (let q = 1; q <= n; q++) {
        for (let s = 0; s <= q; s++) {
          // If previous state was s and this question is incorrect
          if (dpMatrix[s][q - 1]) dpMatrix[s][q] = 1;
          // If previous state was s-1 and this question is correct
          if (
            s > 0 &&
            dpMatrix[s - 1][q - 1] &&
            selectedAnswers[q - 1] === selectedQuestions[q - 1].correctAnswer
          ) {
            dpMatrix[s][q] = 1;
          }
        }
      }
      results.push(knowledgeTracingAlgorithms.DP(dpMatrix));
    } else if (algorithms.knowledgeTracing === 'DKT') {
      const dktResult = knowledgeTracingAlgorithms.DKT(dktHistory.inputs, dktHistory.targets);
      results.push(dktResult);
    } else if (algorithms.knowledgeTracing === 'BKT') {
      const pKnow = 0.5, pLearn = 0.1, pGuess = 0.2, pSlip = 0.1;
      const correct = selectedAnswers[0] === selectedQuestions[0]?.correctAnswer;
      results.push(knowledgeTracingAlgorithms.BKT(pKnow, pLearn, pGuess, pSlip, correct));
    }

    setTestQuestions(selectedQuestions);
    setExecutionResults(results);
    setIsLoading(false);
  };

  // --- Add this function to recalculate all algorithm insights in real time ---
  function updateAlgorithmInsights(currentQIdx: number, answersArr: number[], prioritiesArr: number[], selectedQs: Question[]) {
    const pool = questions;
    const insights: any = {};

    // --- Question Selection ---
    if (algorithms.questionSelection === 'Knapsack') {
      const weights = selectedQs.map(q => q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3);
      const values = selectedQs.map((q, i) => answersArr[i] === q.correctAnswer ? 1 : 0);
      const capacity = 8;
      const knapsackResult = questionSelectionAlgorithms.Knapsack(weights, values, capacity);
      insights.questionSelection = getQuestionSelectionExplanation('Knapsack', knapsackResult.result, currentQIdx);
    } else if (algorithms.questionSelection === 'QLearning' && qTable) {
      const epsilon = 0.2;
      const qResult = questionSelectionAlgorithms.QLearning(qTable, 0, epsilon);
      insights.questionSelection = getQuestionSelectionExplanation('QLearning', qResult.result, currentQIdx);
    } else if (algorithms.questionSelection && algorithms.questionSelection.toLowerCase() === 'ucb') {
      // Example UCB usage
      const rewards = selectedQs.map((q, i) => answersArr[i] === q.correctAnswer ? 1 : 0);
      const counts = selectedQs.map((_, i) => answersArr[i] !== -9999 ? 1 : 0);
      const totalCount = counts.reduce((a: number, b: number) => a + b, 0) || 1;
      const ucbResult = questionSelectionAlgorithms.UCB(rewards, counts, totalCount);
      insights.questionSelection = getQuestionSelectionExplanation('UCB', ucbResult.result, currentQIdx);
    } else if (algorithms.questionSelection && algorithms.questionSelection.toLowerCase() === 'thompsonsampling') {
      // Example Thompson Sampling usage
      const alphas = selectedQs.map((q, i) => answersArr[i] === q.correctAnswer ? 2 : 1);
      const betas = selectedQs.map((q, i) => answersArr[i] === q.correctAnswer ? 1 : 2);
      const tsResult = questionSelectionAlgorithms.ThompsonSampling(alphas, betas);
      insights.questionSelection = getQuestionSelectionExplanation('ThompsonSampling', tsResult.result, currentQIdx);
    }

    // --- Review Scheduler ---
    if (algorithms.reviewScheduling === 'MinHeap') {
      const minHeapResult = reviewSchedulingAlgorithms.MinHeap(prioritiesArr.length === selectedQs.length ? prioritiesArr : Array(selectedQs.length).fill(5));
      insights.reviewScheduler = getReviewSchedulerExplanation('MinHeap', minHeapResult.result);
    } else if (algorithms.reviewScheduling === 'SM2') {
      // Example SM2 usage
      const difficulty = 3;
      const interval = 1;
      const repetitions = 1;
      const sm2Result = reviewSchedulingAlgorithms.SM2(difficulty, interval, repetitions);
      insights.reviewScheduler = getReviewSchedulerExplanation('SM2', sm2Result.result);
    } else if (algorithms.reviewScheduling === 'FSRS') {
      // Example FSRS usage
      const stability = 2;
      const difficulty = 3;
      const fsrsResult = reviewSchedulingAlgorithms.FSRS(stability, difficulty);
      insights.reviewScheduler = getReviewSchedulerExplanation('FSRS', fsrsResult.result);
    }

    // --- Reward System ---
    if (algorithms.rewardSystem === 'FenwickTree') {
      const fenwickArr = selectedQs.map((q, i) => answersArr[i] === q.correctAnswer ? 1 : 0);
      const fenwickResult = rewardSystemAlgorithms.FenwickTree(fenwickArr, 0, fenwickArr.length - 1);
      insights.rewardSystem = getRewardSystemExplanation('FenwickTree', fenwickResult.result, answersArr[currentQIdx] === selectedQs[currentQIdx]?.correctAnswer);
    } else if (algorithms.rewardSystem === 'VariableRatio') {
      // Example Variable Ratio usage
      const responses = answersArr.filter(a => a !== -9999).length;
      const schedule = [2, 3, 4, 5];
      const vrResult = rewardSystemAlgorithms.VariableRatio(responses, schedule);
      insights.rewardSystem = getRewardSystemExplanation('VariableRatio', vrResult.result, answersArr[currentQIdx] === selectedQs[currentQIdx]?.correctAnswer);
    } else if (algorithms.rewardSystem === 'Greedy') {
      // Example Greedy usage
      const activities = selectedQs.map((q, i) => ({ reward: answersArr[i] === q.correctAnswer ? 1 : 0, time: 1 }));
      const greedyResult = rewardSystemAlgorithms.Greedy(activities);
      insights.rewardSystem = getRewardSystemExplanation('Greedy', greedyResult.result, answersArr[currentQIdx] === selectedQs[currentQIdx]?.correctAnswer);
    }

    // --- Knowledge Tracing ---
    if (algorithms.knowledgeTracing === 'DP') {
      // Build a 2D DP matrix: rows = possible correct answers (states), columns = questions
      const n = selectedQs.length;
      const dpMatrix = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
      dpMatrix[0][0] = 1; // 0 correct at 0 questions is possible
      for (let q = 1; q <= n; q++) {
        for (let s = 0; s <= q; s++) {
          // If previous state was s and this question is incorrect
          if (dpMatrix[s][q - 1]) dpMatrix[s][q] = 1;
          // If previous state was s-1 and this question is correct
          if (
            s > 0 &&
            dpMatrix[s - 1][q - 1] &&
            answersArr[q - 1] === selectedQs[q - 1].correctAnswer
          ) {
            dpMatrix[s][q] = 1;
          }
        }
      }
      const dpResult = knowledgeTracingAlgorithms.DP(dpMatrix);
      let dpPath = dpResult.result.path || [];
      let dpPathStr = dpPath.map((step: any) => `(${step.row},${step.col}:${step.value})`).join(' -> ');
      insights.knowledgeTracing = `DP max streak: ${dpResult.result.maxValue}. Path: ${dpPathStr}`;
    } else if (algorithms.knowledgeTracing === 'DKT') {
      // Example DKT usage
      let dktResult = runDKT(dktHistory.inputs, dktHistory.targets);
      insights.knowledgeTracing = `DKT prediction for this question: ${(dktResult.predictions[0] * 100).toFixed(1)}%`;
    } else if (algorithms.knowledgeTracing === 'BKT') {
      // Example BKT usage
      const pKnow = 0.5, pLearn = 0.1, pGuess = 0.2, pSlip = 0.1;
      const correct = answersArr[currentQIdx] === selectedQs[currentQIdx]?.correctAnswer;
      const bktResult = knowledgeTracingAlgorithms.BKT(pKnow, pLearn, pGuess, pSlip, correct);
      insights.knowledgeTracing = getKnowledgeTracingExplanation('BKT', bktResult.result, correct);
    }

    setAlgorithmInsights(insights);
    setShowAlgorithmInsights(true);
  }

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === testQuestions[currentQuestion].correctAnswer;
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect');

    // Update Q-table if Q-Learning
    if (algorithms.questionSelection === 'QLearning' && qTable && selectedIndices.length > 0) {
      const state = 0;
      const action = selectedIndices[currentQuestion];
      const reward = isCorrect ? 1 : -1;
      const nextState = 0;
      const newQ = updateQTable(qTable, state, action, reward, nextState);
      setQTable(newQ);
    }

    // Update DKT history
    setDktHistory(prev => ({
      inputs: [...prev.inputs, currentQuestion],
      targets: [...prev.targets, isCorrect ? 1 : 0]
    }));

    // --- Update Min Heap priorities ---
    setMinHeapPriorities(prev => {
      let newPriorities = prev.length === testQuestions.length ? prev.slice() : Array(testQuestions.length).fill(5);
        if (isCorrect) {
        newPriorities[currentQuestion] = (newPriorities[currentQuestion] || 1) + 1;
      } else {
        newPriorities[currentQuestion] = 1;
      }
      return newPriorities;
    });

    // Update answers
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = index;
      // Use setTimeout to ensure state is updated before calculating insights
      setTimeout(() => {
        updateAlgorithmInsights(currentQuestion, newAnswers, minHeapPriorities, testQuestions);
      }, 0);
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    // Always update answers array at the current index
    let newAnswers = answers.slice();
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
    setAlgorithmInsights(null);
    setShowAlgorithmInsights(false);

    // Debug: log current question and total
    console.log('currentQuestion:', currentQuestion, 'of', testQuestions.length);
    
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log('COMPLETE TEST CALLED');
      completeTest(newAnswers);
    }
  };

  // Reset selectedAnswer on question change
  useEffect(() => {
    setSelectedAnswer(null);
    setAlgorithmInsights(null);
    setShowAlgorithmInsights(false);
    // Do NOT show insights on question change until an answer is selected
  }, [currentQuestion]);

  // Compute final execution results for the selected algorithms
  function computeFinalExecutionResults(finalAnswers: number[]) {
    const arrayQuestions = questions.filter(q => q.topic === 'arrays');
    const linkedListQuestions = questions.filter(q => q.topic === 'linkedlists');
    let selectedQuestions: Question[] = [];
    let results: AlgorithmExecutionResult[] = [];
    let initialQTable = qTable;
    if (!initialQTable) {
      const N = arrayQuestions.length + linkedListQuestions.length;
      initialQTable = [Array(N).fill(0)];
    }
    let indices: number[] = [];
    if (algorithms.questionSelection === 'QLearning' && initialQTable) {
      const epsilon = 0.2;
      const qValues = initialQTable[0];
      const usedIndices = new Set<number>();
      for (let i = 0; i < 5; i++) {
        let action;
        let tries = 0;
        do {
          if (Math.random() < epsilon) {
            action = Math.floor(Math.random() * qValues.length);
          } else {
            action = qValues.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
          }
          tries++;
        } while (usedIndices.has(action) && tries < 10 * qValues.length);
        usedIndices.add(action);
        indices.push(action);
      }
      selectedQuestions = Array.from(usedIndices).map(idx => [...arrayQuestions, ...linkedListQuestions][idx]).slice(0, 5);
      results.push(questionSelectionAlgorithms.QLearning(initialQTable, 0, epsilon));
    } else if (algorithms.questionSelection === 'Knapsack') {
      const pool = [...arrayQuestions, ...linkedListQuestions];
      const weights = pool.map(q => q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3);
      const values = pool.map((q, i) => finalAnswers[i] === q.correctAnswer ? 1 : 0);
      const capacity = 8;
      const knapsackResult = questionSelectionAlgorithms.Knapsack(weights, values, capacity);
      const selectedKnapsackIndices = knapsackResult.result?.selectedItems || [];
      let selectedQuestionsKnapsack = selectedKnapsackIndices.map((idx: number) => pool[idx]);
      const alreadySelected = new Set(selectedKnapsackIndices);
      const fillQuestions = pool.filter((_, i) => !alreadySelected.has(i)).slice(0, 5 - selectedQuestionsKnapsack.length);
      selectedQuestionsKnapsack = [...selectedQuestionsKnapsack, ...fillQuestions];
      const seen = new Set();
      selectedQuestions = selectedQuestionsKnapsack.filter((q: any) => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      }).slice(0, 5);
      results.push(knapsackResult);
    } else if (algorithms.questionSelection && algorithms.questionSelection.toLowerCase() === 'ucb') {
      const pool = [...arrayQuestions, ...linkedListQuestions];
      const rewards = pool.map((q, i) => finalAnswers[i] === q.correctAnswer ? 1 : 0);
      const counts = pool.map((_, i) => finalAnswers[i] !== undefined ? 1 : 0);
      const totalCount = counts.reduce((a: number, b: number) => a + b, 0) || 1;
      const ucbResult = questionSelectionAlgorithms.UCB(rewards, counts, totalCount);
      selectedQuestions = pool.slice(0, 5);
      results.push(ucbResult);
    } else if (algorithms.questionSelection && algorithms.questionSelection.toLowerCase() === 'thompsonsampling') {
      const pool = [...arrayQuestions, ...linkedListQuestions];
      const alphas = pool.map((q, i) => finalAnswers[i] === q.correctAnswer ? 2 : 1);
      const betas = pool.map((q, i) => finalAnswers[i] === q.correctAnswer ? 1 : 2);
      const tsResult = questionSelectionAlgorithms.ThompsonSampling(alphas, betas);
      selectedQuestions = pool.slice(0, 5);
      results.push(tsResult);
    } else {
      const allQs = [...arrayQuestions, ...linkedListQuestions];
      const seen = new Set();
      selectedQuestions = allQs.filter((q: any) => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      }).slice(0, 5);
      results.push({algorithmName: 'Random', executionTime: 0, complexity: {time: 'O(1)', space: 'O(1)'}, description: 'Random selection', result: {}});
    }
    const selectedAnswers = selectedQuestions.map(q => {
      const idx = testQuestions.findIndex(qq => qq.id === q.id);
      return idx !== -1 && finalAnswers[idx] !== undefined ? finalAnswers[idx] : -9999;
    });
    if (algorithms.reviewScheduling === 'MinHeap') {
      let priorities = minHeapPriorities.length === selectedQuestions.length
        ? minHeapPriorities.slice()
        : Array(selectedQuestions.length).fill(5);
      results.push(reviewSchedulingAlgorithms.MinHeap(priorities));
    } else if (algorithms.reviewScheduling === 'SM2') {
      const difficulty = 3;
      const interval = 1;
      const repetitions = 1;
      results.push(reviewSchedulingAlgorithms.SM2(difficulty, interval, repetitions));
    } else if (algorithms.reviewScheduling === 'FSRS') {
      const stability = 2;
      const difficulty = 3;
      results.push(reviewSchedulingAlgorithms.FSRS(stability, difficulty));
    }
    if (algorithms.rewardSystem === 'FenwickTree') {
      const fenwickArr = selectedQuestions.map((q, i) => selectedAnswers[i] === q.correctAnswer ? 1 : 0);
      results.push(rewardSystemAlgorithms.FenwickTree(fenwickArr, 0, fenwickArr.length - 1));
    } else if (algorithms.rewardSystem === 'VariableRatio') {
      const responses = selectedAnswers.filter(a => a !== -9999).length;
      const schedule = [2, 3, 4, 5];
      results.push(rewardSystemAlgorithms.VariableRatio(responses, schedule));
    } else if (algorithms.rewardSystem === 'Greedy') {
      const activities = selectedQuestions.map((q, i) => ({ reward: selectedAnswers[i] === q.correctAnswer ? 1 : 0, time: 1 }));
      results.push(rewardSystemAlgorithms.Greedy(activities));
    }
    if (algorithms.knowledgeTracing === 'DP') {
      // Build a 2D DP matrix: rows = possible correct answers (states), columns = questions
      const n = selectedQuestions.length;
      const dpMatrix = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
      dpMatrix[0][0] = 1; // 0 correct at 0 questions is possible
      for (let q = 1; q <= n; q++) {
        for (let s = 0; s <= q; s++) {
          // If previous state was s and this question is incorrect
          if (dpMatrix[s][q - 1]) dpMatrix[s][q] = 1;
          // If previous state was s-1 and this question is correct
          if (
            s > 0 &&
            dpMatrix[s - 1][q - 1] &&
            selectedAnswers[q - 1] === selectedQuestions[q - 1].correctAnswer
          ) {
            dpMatrix[s][q] = 1;
          }
        }
      }
      results.push(knowledgeTracingAlgorithms.DP(dpMatrix));
    } else if (algorithms.knowledgeTracing === 'DKT') {
      const dktResult = knowledgeTracingAlgorithms.DKT(dktHistory.inputs, dktHistory.targets);
      results.push(dktResult);
    } else if (algorithms.knowledgeTracing === 'BKT') {
      const pKnow = 0.5, pLearn = 0.1, pGuess = 0.2, pSlip = 0.1;
      const correct = selectedAnswers[0] === selectedQuestions[0]?.correctAnswer;
      results.push(knowledgeTracingAlgorithms.BKT(pKnow, pLearn, pGuess, pSlip, correct));
    }
    return results;
  }

  const completeTest = (finalAnswers: number[]) => {
    if (!user) return;
    console.log('NAVIGATE TO RESULTS');
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === testQuestions[index].correctAnswer
    ).length;
    const finalExecutionResults = computeFinalExecutionResults(finalAnswers);
    const executionTimes = finalExecutionResults.reduce((acc, result) => ({
      ...acc,
      [result.algorithmName]: result.executionTime
    }), {});
    addTestAttempt({
      studentId: user.id,
      questions: testQuestions,
      answers: finalAnswers,
      score: correctAnswers,
      timeSpent,
      algorithmsUsed: algorithms,
      executionTimes,
      completedAt: new Date(),
      testType: reviewMode ? 'spaced_repetition' : 'normal'
    });
    navigate('/test-results', { 
      state: { 
        testQuestions,
        answers: finalAnswers,
        correctAnswers,
        timeSpent,
        algorithms,
        executionResults: finalExecutionResults,
        testType: reviewMode ? 'spaced_repetition' : 'normal'
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden transition-all duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Generating Your Test
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-600 dark:text-slate-300"
          >
            Algorithms are working to create the perfect questions for you...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!testQuestions || testQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600 font-bold">No questions available for this test. Please check your algorithm selection or question pool.</div>
      </div>
    );
  }
  const currentQ = testQuestions[currentQuestion];
  const isSpacedRepetition = reviewMode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 relative overflow-hidden transition-all duration-500">
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg ${
                  isSpacedRepetition 
                    ? 'bg-emerald-500 dark:bg-emerald-400' 
                    : 'bg-blue-500 dark:bg-blue-400'
                }`}
              >
                {isSpacedRepetition ? (
                  <RefreshCw className="h-6 w-6 text-white" />
                ) : (
                  <Zap className="h-6 w-6 text-white" />
                )}
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isSpacedRepetition ? 'Spaced Repetition Review' : 'Personalized Test'}
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  {isSpacedRepetition 
                    ? 'Reinforcing your knowledge with spaced repetition' 
                    : 'Challenge yourself with adaptive questions'
                  }
                </p>
              </div>
            </div>
            
            {/* Test Type Badge */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                isSpacedRepetition
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
              }`}
            >
              {isSpacedRepetition ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Spaced Repetition
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  New Test
                </>
              )}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Question {currentQuestion + 1} of {testQuestions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / testQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div 
                className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Active Algorithms Indicator */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {algorithms.reviewScheduling}
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700"
              >
                <Brain className="h-3 w-3 mr-1" />
                {algorithms.questionSelection}
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700"
              >
                <Gift className="h-3 w-3 mr-1" />
                {algorithms.rewardSystem}
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700"
              >
                <Cpu className="h-3 w-3 mr-1" />
                {algorithms.knowledgeTracing}
              </motion.div>
            </div>
          </div>

          {/* Timer */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center justify-center"
          >
            <Timer className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Time: {Math.round(timeElapsed / 1000)}s
            </span>
          </motion.div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-all duration-300"
          >
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQ?.topic === 'arrays' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' 
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                  }`}
                >
                  {currentQ?.topic === 'arrays' ? 'Arrays' : 'Linked Lists'}
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQ?.difficulty === 'easy' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : currentQ?.difficulty === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}
                >
                  {currentQ?.difficulty?.charAt(0).toUpperCase() + currentQ?.difficulty?.slice(1)}
                </motion.span>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{currentQ?.title}</h2>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{currentQ?.description}</p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ?.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    scale: selectedAnswer === null ? 1.02 : 1,
                    boxShadow: selectedAnswer === null ? "0 10px 25px rgba(59, 130, 246, 0.15)" : "none"
                  }}
                  whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? answerFeedback === 'correct'
                        ? 'border-green-500 dark:border-green-400 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm text-green-800 dark:text-green-200'
                        : 'border-red-500 dark:border-red-400 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm text-red-800 dark:text-red-200'
                      : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-600/80'
                  } ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: selectedAnswer === null ? 1.1 : 1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-semibold ${
                        selectedAnswer === index
                          ? answerFeedback === 'correct'
                            ? 'bg-green-500 dark:bg-green-400 text-white'
                            : 'bg-red-500 dark:bg-red-400 text-white'
                          : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </motion.div>
                    <span className="text-lg">{option}</span>
                    {selectedAnswer === index && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-auto"
                      >
                        {answerFeedback === 'correct' ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <div className="h-6 w-6 text-red-600 dark:text-red-400">✗</div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {answerFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className={`mt-6 p-4 rounded-xl ${
                    answerFeedback === 'correct' 
                      ? 'bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-200 dark:border-green-700' 
                      : 'bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center">
                    {answerFeedback === 'correct' ? (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 5, 0]
                        }}
                        transition={{ duration: 0.6 }}
                        className="h-6 w-6 text-red-600 dark:text-red-400 mr-3"
                      >
                        ✗
                      </motion.div>
                    )}
                    <div>
                      <h3 className={`font-semibold ${
                        answerFeedback === 'correct' 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {answerFeedback === 'correct' ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p className={`text-sm ${
                        answerFeedback === 'correct' 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {answerFeedback === 'correct' 
                          ? 'Great job! You understand this concept well.' 
                          : currentQ?.explanation
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Algorithm Feedback */}
            <AnimatePresence>
              {algorithmFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="mt-4 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700"
                >
                  <div className="flex items-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                        Algorithm Applied
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {algorithmFeedback}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Algorithm Insights */}
            <AnimatePresence>
              {showAlgorithmInsights && algorithmInsights && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="mt-4 p-6 rounded-xl bg-gradient-to-br from-indigo-50/90 via-purple-50/90 to-blue-50/90 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm border border-indigo-200 dark:border-indigo-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                      </motion.div>
                      <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 text-lg">
                        Algorithm Insights
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAlgorithmInsights(!showAlgorithmInsights)}
                      className="flex items-center px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-all duration-200"
                    >
                      {showAlgorithmInsights ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Show Details
                        </>
                      )}
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {showAlgorithmInsights && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-indigo-200 dark:border-indigo-600"
                          >
                            <div className="flex items-center mb-2">
                              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                              <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Question Selection</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{algorithmInsights.questionSelection}</p>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-purple-200 dark:border-purple-600"
                          >
                            <div className="flex items-center mb-2">
                              <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                              <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Knowledge Tracing</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{algorithmInsights.knowledgeTracing}</p>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-emerald-200 dark:border-emerald-600"
                          >
                            <div className="flex items-center mb-2">
                              <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                              <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Review Scheduler</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{algorithmInsights.reviewScheduler}</p>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="p-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-yellow-200 dark:border-yellow-600"
                          >
                            <div className="flex items-center mb-2">
                              <Gift className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                              <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">Reward System</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{algorithmInsights.rewardSystem}</p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAlgorithmDetails(!showAlgorithmDetails)}
            className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
          >
            <Cpu className="h-5 w-5 mr-2" />
            {showAlgorithmDetails ? 'Hide' : 'Show'} Algorithm Details
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: selectedAnswer !== null ? "0 20px 40px rgba(16, 185, 129, 0.3)" : "none"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedAnswer !== null
                ? 'bg-emerald-500 dark:bg-emerald-400 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-lg'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion < testQuestions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : (
              <>
                Complete Test
                <Award className="h-5 w-5 ml-2" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Algorithm Details */}
        <AnimatePresence>
          {showAlgorithmDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Algorithm Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {executionResults.map((result, index) => (
                  <motion.div
                    key={result.algorithmName}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {result.algorithmName}
                    </h4>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <p>Execution Time: {result.executionTime.toFixed(3)}ms</p>
                      <p>Time Complexity: {result.complexity.time}</p>
                      <p>Space Complexity: {result.complexity.space}</p>
                      {result.topic && <p>Topic: {result.topic}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestPage;