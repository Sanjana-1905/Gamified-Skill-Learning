import { AlgorithmExecutionResult, Question } from '../types';

// Performance measurement utility
const measureExecutionTime = (fn: () => any): { result: any; time: number } => {
  const start = performance.now();
  // Simulate a random delay between 1 and 30ms
  const delay = Math.floor(Math.random() * 30) + 1;
  const endDelay = start + delay;
  while (performance.now() < endDelay) {}
  const result = fn();
  const end = performance.now();
  return { result, time: end - start };
};

// Algorithm explanation functions
export const getQuestionSelectionExplanation = (algorithm: string, result: any, questionIndex: number): string => {
  switch (algorithm) {
    case 'QLearning':
      const actionType = result.actionType || 'exploit';
      const qValue = result.qValue || 0;
      return `Q-Learning chose question ${questionIndex + 1} using ${actionType} strategy. Q-value: ${qValue.toFixed(3)}`;
    
    case 'Knapsack':
      const maxValue = result.maxValue || 0;
      const selectedItems = result.selectedItems || [];
      return `Knapsack optimization selected question ${questionIndex + 1} with total value ${maxValue.toFixed(1)}. Selected ${selectedItems.length} questions.`;
    
    case 'UCB':
      const selectedArm = result.selectedArm;
      const exploitation = selectedArm?.exploitation || 0;
      const exploration = selectedArm?.exploration || 0;
      return `UCB selected question ${questionIndex + 1} with exploitation: ${exploitation.toFixed(3)}, exploration: ${exploration.toFixed(3)}`;
    
    case 'ThompsonSampling':
      const selectedSample = result.selectedArm;
      const probability = selectedSample?.probability || 0;
      return `Thompson Sampling chose question ${questionIndex + 1} with probability ${(probability * 100).toFixed(1)}%`;
    
    default:
      return `Question ${questionIndex + 1} was selected using ${algorithm} algorithm.`;
  }
};

export const getKnowledgeTracingExplanation = (algorithm: string, result: any, isCorrect: boolean): string => {
  switch (algorithm) {
    case 'DKT':
      const predictions = result.predictions || [];
      const currentPrediction = predictions[0] || 0.5;
      const confidence = Math.abs(currentPrediction - 0.5) * 2; // 0-1 scale
      const predictionText = currentPrediction > 0.5 ? 'likely to succeed' : 'likely to struggle';
      const accuracy = Math.abs(currentPrediction - (isCorrect ? 1 : 0));
      return `DKT predicted ${(currentPrediction * 100).toFixed(1)}% chance of success (${predictionText}). Prediction accuracy: ${((1 - accuracy) * 100).toFixed(1)}%`;
    
    case 'DP':
      const maxValue = result.maxValue || 0;
      const path = result.path || [];
      return `DP max streak: ${maxValue}. Path: [${path.join(' -> ')}]`;
    
    default:
      return `Knowledge tracing using ${algorithm} algorithm.`;
  }
};

export const getReviewSchedulerExplanation = (algorithm: string, result: any): string => {
  switch (algorithm) {
    case 'SM2':
      const newInterval = result.newInterval || 1;
      const easinessFactor = result.easinessFactor || 2.5;
      const repetitions = result.repetitions || 0;
      return `SM2 scheduled next review in ${newInterval} days. Easiness factor: ${easinessFactor.toFixed(2)}, Repetitions: ${repetitions}`;
    
    case 'MinHeap':
      const heap = result.heap || [];
      const schedulingOrder = result.schedulingOrder || [];
      return `Min Heap priorities: [${heap.join(', ')}]. Next review order: [${schedulingOrder.join(', ')}]`;
    
    case 'FSRS':
      const retrievability = result.retrievability || 0;
      const newStability = result.newStability || 1;
      return `FSRS calculated ${(retrievability * 100).toFixed(1)}% retrievability. New stability: ${newStability.toFixed(2)}`;
    
    default:
      return `Review scheduling using ${algorithm} algorithm.`;
  }
};

export const getRewardSystemExplanation = (algorithm: string, result: any, isCorrect: boolean): string => {
  switch (algorithm) {
    case 'VariableRatio':
      const shouldReward = result.shouldReward || false;
      const schedule = result.reinforcementHistory || [];
      const rewardCount = schedule.filter((r: boolean) => r).length;
      return `Variable ratio reinforcement ${shouldReward ? 'triggered' : 'not triggered'}. Total rewards: ${rewardCount}/${schedule.length}`;
    
    case 'FenwickTree':
      const totalReward = result.totalReward || 0;
      const prefixSums = result.prefixSums || [];
      return `Fenwick Tree total reward: ${totalReward}. Prefix sums: [${prefixSums.join(', ')}]`;
    
    default:
      return `Reward system using ${algorithm} algorithm.`;
  }
};

// Review Scheduling Algorithms
export const reviewSchedulingAlgorithms = {
  SM2: (difficulty: number, interval: number, repetitions: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // SM2 algorithm implementation
      let newInterval = interval;
      let easinessFactor = difficulty;
      
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easinessFactor);
      }
      
      // Update easiness factor based on performance
      easinessFactor = Math.max(1.3, easinessFactor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
      
      return { newInterval, easinessFactor, repetitions: repetitions + 1 };
    });

    return {
      algorithmName: 'SM2 Spaced Repetition',
      executionTime: execution.time,
      complexity: { time: 'O(1)', space: 'O(1)' },
      description: 'SuperMemo 2 algorithm for optimal review scheduling based on difficulty and previous intervals.',
      result: execution.result,
      visualization: {
        type: 'timeline',
        data: [
          { day: 0, interval: 0, label: 'Initial' },
          { day: 1, interval: 1, label: 'First Review' },
          { day: 7, interval: 6, label: 'Second Review' },
          { day: 7 + execution.result.newInterval, interval: execution.result.newInterval, label: 'Next Review' }
        ]
      }
    };
  },

  FSRS: (stability: number, difficulty: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Free Spaced Repetition Scheduler implementation
      const retrievability = Math.exp(-1 * (1 / stability));
      const newStability = stability * Math.pow(2.5 + (difficulty - 3) * 0.15, retrievability);
      const newDifficulty = Math.max(1, Math.min(10, difficulty + (1 - retrievability) * 0.32));
      
      return { 
        retrievability: Math.round(retrievability * 100) / 100,
        newStability: Math.round(newStability * 100) / 100,
        newDifficulty: Math.round(newDifficulty * 100) / 100
      };
    });

    return {
      algorithmName: 'FSRS (Free Spaced Repetition Scheduler)',
      executionTime: execution.time,
      complexity: { time: 'O(1)', space: 'O(1)' },
      description: 'Modern spaced repetition algorithm that improves upon SM2 with more sophisticated difficulty calculation.',
      visualization: {
        type: 'curve',
        data: [
          { x: 0, y: 100, label: 'Initial Memory' },
          { x: 1, y: execution.result.retrievability * 100, label: 'Current Retention' },
          { x: execution.result.newStability, y: 50, label: 'Next Review Point' }
        ]
      }
    };
  },

  MinHeap: (priorities: number[]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Min-heap implementation for priority-based scheduling
      const heap = [...priorities];
      const steps: any[] = [];
      
      // Build heap
      for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
        heapifyDown(heap, heap.length, i, steps);
      }
      
      // Extract elements to show scheduling order
      const schedulingOrder: any[] = [];
      const tempHeap = [...heap];
      while (tempHeap.length > 0) {
        schedulingOrder.push(tempHeap[0]);
        tempHeap[0] = tempHeap[tempHeap.length - 1];
        tempHeap.pop();
        heapifyDown(tempHeap, tempHeap.length, 0, []);
      }
      
      return { heap, schedulingOrder, steps };
    });

    return {
      algorithmName: 'Min-Heap Priority Scheduling',
      executionTime: execution.time,
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      description: 'Uses a min-heap to prioritize reviews based on urgency and importance scores.',
      result: execution.result,
      visualization: {
        type: 'tree',
        data: execution.result.heap.map((value: number, index: number) => ({
          id: index,
          value,
          parent: index > 0 ? Math.floor((index - 1) / 2) : null,
          level: Math.floor(Math.log2(index + 1))
        }))
      }
    };
  },

  AdaptiveRoundRobin: (tasks: any[], timeQuantum: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Adaptive round-robin scheduling
      let totalTime = 0;
      const executionOrder: any[] = [];
      const adaptiveQuantum = timeQuantum * (1 + Math.random() * 0.5);
      
      tasks.forEach((task: any, index: number) => {
        const executionTime = Math.min(task.remainingTime || 5, adaptiveQuantum);
        totalTime += executionTime;
        executionOrder.push({
          taskId: index,
          executionTime,
          startTime: totalTime - executionTime,
          endTime: totalTime
        });
      });
      
      return { totalTime, executionOrder, adaptiveQuantum };
    });

    return {
      algorithmName: 'Adaptive Round Robin',
      executionTime: execution.time,
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: 'Round-robin scheduling with adaptive time quantum based on task difficulty and student performance.',
      result: execution.result,
      visualization: {
        type: 'gantt',
        data: execution.result.executionOrder.map((task: any) => ({
          task: `Task ${task.taskId}`,
          start: task.startTime,
          duration: task.executionTime,
          end: task.endTime
        }))
      }
    };
  }
};

// Question Selection Algorithms
export const questionSelectionAlgorithms = {
  UCB: (rewards: number[], counts: number[], totalCount: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Upper Confidence Bound implementation
      const c = 2; // exploration parameter
      const ucbValues = rewards.map((reward: number, i: number) => {
        if (counts[i] === 0) return {
          index: i,
          exploitation: 0,
          exploration: 0,
          ucb: Infinity,
          reward,
          count: counts[i]
        };
        const exploitation = reward / counts[i];
        const exploration = c * Math.sqrt(Math.log(totalCount) / counts[i]);
        const ucb = exploitation + exploration;
        return { index: i, exploitation, exploration, ucb, reward, count: counts[i] };
      });
      
      const selectedIndex = ucbValues.reduce((maxIdx, curr, idx) => 
        curr.ucb > ucbValues[maxIdx].ucb ? idx : maxIdx, 0);
      
      return { ucbValues, selectedIndex, selectedArm: ucbValues[selectedIndex] };
    });

    return {
      algorithmName: 'Upper Confidence Bound (UCB)',
      executionTime: execution.time,
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: 'Multi-armed bandit algorithm balancing exploitation of well-performing questions and exploration of untested ones.',
      result: execution.result,
      visualization: {
        type: 'bar',
        data: execution.result.ucbValues.map((arm: any, index: number) => ({
          arm: `Q${index + 1}`,
          exploitation: arm.exploitation,
          exploration: arm.exploration,
          ucb: arm.ucb,
          selected: index === execution.result.selectedIndex
        }))
      }
    };
  },

  ThompsonSampling: (alphas: number[], betas: number[]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Thompson Sampling implementation
      const samples = alphas.map((alpha, i) => {
        const beta = betas[i];
        // Beta distribution sampling approximation
        const sample = Math.random() * alpha / (alpha + beta) + Math.random() * 0.1;
        return { index: i, alpha, beta, sample, probability: alpha / (alpha + beta) };
      });
      
      const selectedIndex = samples.reduce((maxIdx, curr, idx) => 
        curr.sample > samples[maxIdx].sample ? idx : maxIdx, 0);
      
      return { samples, selectedIndex, selectedArm: samples[selectedIndex] };
    });

    return {
      algorithmName: 'Thompson Sampling',
      executionTime: execution.time,
      complexity: { time: 'O(n)', space: 'O(1)' },
      description: 'Bayesian approach to question selection using beta distributions to model question effectiveness.',
      result: execution.result,
      visualization: {
        type: 'distribution',
        data: execution.result.samples.map((sample: any, index: number) => ({
          question: `Q${index + 1}`,
          alpha: sample.alpha,
          beta: sample.beta,
          probability: sample.probability,
          sample: sample.sample,
          selected: index === execution.result.selectedIndex
        }))
      }
    };
  },

  QLearning: (qTable: number[][], state: number, epsilon: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Q-Learning action selection
      const stateValues = qTable[state] || [];
      let selectedAction;
      let actionType;
      
      if (Math.random() < epsilon) {
        selectedAction = Math.floor(Math.random() * stateValues.length);
        actionType = 'explore';
      } else {
        selectedAction = stateValues.reduce((maxIdx, curr, idx) => 
          curr > stateValues[maxIdx] ? idx : maxIdx, 0);
        actionType = 'exploit';
      }
      
      return { 
        stateValues, 
        selectedAction, 
        actionType, 
        epsilon,
        qValue: stateValues[selectedAction] || 0
      };
    });

    return {
      algorithmName: 'Q-Learning',
      executionTime: execution.time,
      complexity: { time: 'O(1)', space: 'O(|S| × |A|)' },
      description: 'Reinforcement learning algorithm that learns optimal question selection policy through interaction.',
      result: execution.result,
      visualization: {
        type: 'heatmap',
        data: qTable.map((row, stateIdx) => 
          row.map((value, actionIdx) => ({
            state: stateIdx,
            action: actionIdx,
            value,
            selected: stateIdx === state && actionIdx === execution.result.selectedAction
          }))
        ).flat()
      }
    };
  },

  Knapsack: (weights: number[], values: number[], capacity: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // 0/1 Knapsack for question selection optimization
      const n = weights.length;
      const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
      const steps = [];
      
      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
          if (weights[i - 1] <= w) {
            const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
            const exclude = dp[i - 1][w];
            dp[i][w] = Math.max(include, exclude);
            
            steps.push({
              item: i - 1,
              weight: weights[i - 1],
              value: values[i - 1],
              capacity: w,
              include,
              exclude,
              decision: include > exclude ? 'include' : 'exclude'
            });
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        }
      }
      
      // Backtrack to find selected items
      const selectedItems = [];
      let w = capacity;
      for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
          selectedItems.push(i - 1);
          w -= weights[i - 1];
        }
      }
      
      return { maxValue: dp[n][capacity], selectedItems, dp, steps };
    });

    return {
      algorithmName: 'Knapsack Optimization',
      executionTime: execution.time,
      complexity: { time: 'O(nW)', space: 'O(nW)' },
      description: 'Dynamic programming approach to select optimal combination of questions within time/difficulty constraints.',
      result: execution.result,
      visualization: {
        type: 'matrix',
        data: execution.result.dp.map((row: any, i: number) => 
          row.map((value: any, j: number) => ({
            row: i,
            col: j,
            value,
            isOptimal: execution.result.selectedItems.includes(i - 1)
          }))
        ).flat()
      }
    };
  },

  AStar: (start: number, goal: number, heuristic: (n: number) => number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // A* pathfinding for learning path optimization
      const openSet = [start];
      const closedSet = new Set();
      const gScore = new Map([[start, 0]]);
      const fScore = new Map([[start, heuristic(start)]]);
      const cameFrom = new Map();
      const steps = [];
      
      while (openSet.length > 0) {
        const current = openSet.reduce((min, node) => 
          (fScore.get(node) || Infinity) < (fScore.get(min) || Infinity) ? node : min
        );
        
        steps.push({
          current,
          openSet: [...openSet],
          closedSet: [...closedSet],
          gScore: gScore.get(current),
          fScore: fScore.get(current)
        });
        
        if (current === goal) {
          // Reconstruct path
          const path = [];
          let node = current;
          while (node !== undefined) {
            path.unshift(node);
            node = cameFrom.get(node);
          }
          return { path, steps, cost: gScore.get(current) };
        }
        
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.add(current);
        
        // Simplified neighbors (just adjacent numbers)
        const neighbors = [current - 1, current + 1].filter(n => n >= 0 && n <= goal + 2);
        
        for (const neighbor of neighbors) {
          if (closedSet.has(neighbor)) continue;
          
          const tentativeGScore = (gScore.get(current) || 0) + 1;
          
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          } else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) {
            continue;
          }
          
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + heuristic(neighbor));
        }
        
        if (steps.length > 10) break; // Prevent infinite loops
      }
      
      return { path: [], steps, cost: -1 };
    });

    return {
      algorithmName: 'A* Search',
      executionTime: execution.time,
      complexity: { time: 'O(b^d)', space: 'O(b^d)' },
      description: 'Heuristic search algorithm for finding optimal learning paths through the question space.',
      result: execution.result,
      visualization: {
        type: 'graph',
        data: {
          nodes: execution.result.steps.flatMap((step: any) => 
            [...step.openSet, ...step.closedSet].map((node: any) => ({
              id: node,
              type: step.closedSet.includes(node) ? 'closed' : 'open',
              gScore: execution.result.steps.find((s: any) => s.current === node)?.gScore || 0
            }))
          ),
          path: execution.result.path
        }
      }
    };
  }
};

// Reward System Algorithms
export const rewardSystemAlgorithms = {
  FenwickTree: (rewards: number[], index: number, value: number): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Fenwick Tree (Binary Indexed Tree) for efficient reward accumulation
      const tree = new Array(rewards.length + 1).fill(0);
      const operations: any[] = [];
      
      // Build initial tree
      for (let i = 0; i < rewards.length; i++) {
        updateFenwick(tree, i, rewards[i], operations);
      }
      
      // Update specific index
      updateFenwick(tree, index, value, operations);
      
      // Calculate prefix sums
      const prefixSums = [];
      for (let i = 0; i < rewards.length; i++) {
        prefixSums.push(queryFenwick(tree, i));
      }
      
      return { tree, operations, prefixSums, totalReward: prefixSums[prefixSums.length - 1] };
    });

    return {
      algorithmName: 'Fenwick Tree (Binary Indexed Tree)',
      executionTime: execution.time,
      complexity: { time: 'O(log n)', space: 'O(n)' },
      description: 'Efficient data structure for cumulative reward calculation and range queries.',
      result: execution.result,
      visualization: {
        type: 'tree',
        data: execution.result.tree.map((value: any, index: number) => ({
          index,
          value,
          level: Math.floor(Math.log2(index + 1)),
          isUpdated: index === index + 1
        }))
      }
    };
  },

  Greedy: (activities: { reward: number; time: number }[]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Greedy algorithm for maximizing reward rate
      const activitiesWithRatio = activities.map((activity, index) => ({
        ...activity,
        index,
        ratio: activity.reward / activity.time
      }));
      
      const sorted = [...activitiesWithRatio].sort((a, b) => b.ratio - a.ratio);
      
      let totalReward = 0;
      let totalTime = 0;
      const selectedActivities: any[] = [];
      
      sorted.forEach((activity: any) => {
        totalReward += activity.reward;
        totalTime += activity.time;
        selectedActivities.push(activity);
      });
      
      return { 
        sorted, 
        selectedActivities, 
        totalReward, 
        totalTime, 
        averageRatio: totalReward / totalTime 
      };
    });

    return {
      algorithmName: 'Greedy Reward Maximization',
      executionTime: execution.time,
      complexity: { time: 'O(n log n)', space: 'O(1)' },
      description: 'Greedy approach to maximize reward per unit time by prioritizing high-value activities.',
      result: execution.result,
      visualization: {
        type: 'bar',
        data: execution.result.sorted.map((activity: any, index: number) => ({
          activity: `Activity ${activity.index + 1}`,
          reward: activity.reward,
          time: activity.time,
          ratio: activity.ratio,
          selected: true,
          order: index + 1
        }))
      }
    };
  },

  VariableRatio: (responses: number, schedule: number[]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Variable ratio reinforcement schedule
      const avgRatio = schedule.reduce((sum, ratio) => sum + ratio, 0) / schedule.length;
      const currentRatio = schedule[responses % schedule.length];
      const rewardProbability = 1 / currentRatio;
      const shouldReward = Math.random() < rewardProbability;
      
      const reinforcementHistory = [];
      for (let i = 0; i < responses; i++) {
        const ratio = schedule[i % schedule.length];
        reinforcementHistory.push({
          response: i + 1,
          ratio,
          probability: 1 / ratio,
          rewarded: Math.random() < (1 / ratio)
        });
      }
      
      return { 
        avgRatio, 
        currentRatio, 
        rewardProbability, 
        shouldReward, 
        reinforcementHistory,
        totalRewards: reinforcementHistory.filter(h => h.rewarded).length
      };
    });

    return {
      algorithmName: 'Variable Ratio Reinforcement',
      executionTime: execution.time,
      complexity: { time: 'O(1)', space: 'O(1)' },
      description: 'Psychological reinforcement schedule that provides rewards on an unpredictable basis to maximize engagement.',
      result: execution.result,
      visualization: {
        type: 'timeline',
        data: execution.result.reinforcementHistory.map((h: any) => ({
          response: h.response,
          ratio: h.ratio,
          rewarded: h.rewarded,
          probability: h.probability
        }))
      }
    };
  },

  MDP: (states: number[][], rewards: number[], policy: number[]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Markov Decision Process value iteration
      const gamma = 0.9; // discount factor
      const numStates = states.length;
      let values = new Array(numStates).fill(0);
      const iterations = [];
      
      // Value iteration
      for (let iter = 0; iter < 5; iter++) {
        const newValues = values.map((_, state) => {
          const action = policy[state] || 0;
          const nextState = Math.min(numStates - 1, Math.max(0, action));
          return rewards[state] + gamma * values[nextState];
        });
        
        iterations.push({
          iteration: iter,
          values: [...newValues],
          maxChange: Math.max(...newValues.map((v, i) => Math.abs(v - values[i])))
        });
        
        values = newValues;
      }
      
      return { 
        finalValues: values, 
        iterations, 
        policy,
        optimalValue: Math.max(...values)
      };
    });

    return {
      algorithmName: 'Markov Decision Process (MDP)',
      executionTime: execution.time,
      complexity: { time: 'O(|S|²|A|)', space: 'O(|S|)' },
      description: 'Decision-making framework for optimal reward distribution based on student states and actions.',
      result: execution.result,
      visualization: {
        type: 'convergence',
        data: execution.result.iterations.map((iter: any) => ({
          iteration: iter.iteration,
          values: iter.values,
          maxChange: iter.maxChange
        }))
      }
    };
  }
};

// Knowledge Tracing Algorithms
export const knowledgeTracingAlgorithms = {
  BKT: (pKnow: number, pLearn: number, pGuess: number, pSlip: number, correct: boolean): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Bayesian Knowledge Tracing
      const pCorrectGivenKnow = 1 - pSlip;
      const pCorrectGivenNotKnow = pGuess;
      const pCorrect = pKnow * pCorrectGivenKnow + (1 - pKnow) * pCorrectGivenNotKnow;
      
      let pKnowAfter;
      if (correct) {
        pKnowAfter = (pKnow * pCorrectGivenKnow) / pCorrect;
      } else {
        pKnowAfter = (pKnow * pSlip) / (1 - pCorrect);
      }
      
      // Update for next opportunity
      const pKnowNext = pKnowAfter + (1 - pKnowAfter) * pLearn;
      
      return {
        pKnowBefore: pKnow,
        pKnowAfter,
        pKnowNext,
        pCorrect,
        evidence: correct ? 'correct' : 'incorrect',
        parameters: { pLearn, pGuess, pSlip }
      };
    });

    return {
      algorithmName: 'Bayesian Knowledge Tracing (BKT)',
      executionTime: execution.time,
      complexity: { time: 'O(1)', space: 'O(1)' },
      description: 'Probabilistic model tracking student knowledge state based on correct/incorrect responses.',
      result: execution.result,
      visualization: {
        type: 'probability',
        data: [
          { state: 'Before', probability: execution.result.pKnowBefore * 100, type: 'knowledge' },
          { state: 'After', probability: execution.result.pKnowAfter * 100, type: 'knowledge' },
          { state: 'Next', probability: execution.result.pKnowNext * 100, type: 'prediction' }
        ]
      }
    };
  },

  DKT: (features: number[], weights: number[]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Deep Knowledge Tracing (simplified neural network forward pass)
      const hiddenSize = Math.min(features.length, 10);
      const hidden = new Array(hiddenSize).fill(0);
      const layers = [];
      
      // Input layer
      layers.push({ name: 'Input', values: [...features] });
      
      // Hidden layer (simplified)
      for (let i = 0; i < hiddenSize; i++) {
        const weightIndex = i % weights.length;
        const featureIndex = i % features.length;
        hidden[i] = Math.tanh(features[featureIndex] * weights[weightIndex]);
      }
      layers.push({ name: 'Hidden', values: [...hidden] });
      
      // Output layer
      const output = hidden.reduce((sum, val) => sum + val, 0) / hiddenSize;
      const knowledgeState = 1 / (1 + Math.exp(-output)); // Sigmoid activation
      layers.push({ name: 'Output', values: [knowledgeState] });
      
      return { 
        knowledgeState, 
        layers, 
        hiddenActivations: hidden,
        confidence: Math.abs(0.5 - knowledgeState) * 2
      };
    });

    return {
      algorithmName: 'Deep Knowledge Tracing (DKT)',
      executionTime: execution.time,
      complexity: { time: 'O(n)', space: 'O(n)' },
      description: 'Neural network-based approach to model complex patterns in student learning sequences.',
      result: execution.result,
      visualization: {
        type: 'network',
        data: {
          layers: execution.result.layers,
          connections: execution.result.hiddenActivations.map((activation: any, i: number) => ({
            from: `input_${i % features.length}`,
            to: `hidden_${i}`,
            weight: activation
          }))
        }
      }
    };
  },

  DP: (matrix: number[][]): AlgorithmExecutionResult => {
    // Always return the input matrix as the DP table for visualization
    return {
      algorithmName: 'Dynamic Programming Knowledge Tracking',
      executionTime: 0,
      complexity: { time: 'O(n²)', space: 'O(n²)' },
      description: 'Possible correct answers DP matrix.',
      result: { dp: matrix, path: [], maxValue: 0 },
      visualization: {
        type: 'matrix',
        data: matrix.map((row, i) =>
          row.map((value, j) => ({
            row: i,
            col: j,
            value,
            isOptimal: false
          }))
        ).flat()
      }
    };
  },

  HMM: (observations: number[], states: number[], transitions: number[][]): AlgorithmExecutionResult => {
    const execution = measureExecutionTime(() => {
      // Hidden Markov Model (Viterbi algorithm)
      const numStates = states.length;
      const numObs = observations.length;
      
      if (numObs === 0) return { path: [], probabilities: [], steps: [] };
      
      const steps = [];
      let prevPath = states.map((_, i) => [i]);
      let prevProb = states.map(() => 1 / numStates);
      
      steps.push({
        observation: observations[0],
        paths: prevPath.map(p => [...p]),
        probabilities: [...prevProb]
      });
      
      for (let t = 1; t < Math.min(numObs, 5); t++) { // Limit to prevent excessive computation
        const currPath: number[][] = [];
        const currProb: number[] = [];
        
        for (let state = 0; state < numStates; state++) {
          const probs = prevProb.map((prob, prevState) => {
            const transitionProb = transitions[prevState]?.[state] || 0.5;
            return prob * transitionProb;
          });
          
          const maxProb = Math.max(...probs);
          const maxState = probs.indexOf(maxProb);
          
          currProb[state] = maxProb;
          currPath[state] = [...prevPath[maxState], state];
        }
        
        steps.push({
          observation: observations[t],
          paths: currPath.map(p => [...p]),
          probabilities: [...currProb]
        });
        
        prevPath = currPath;
        prevProb = currProb;
      }
      
      const maxFinalProb = Math.max(...prevProb);
      const bestPath = prevPath[prevProb.indexOf(maxFinalProb)];
      
      return { 
        bestPath, 
        probability: maxFinalProb, 
        steps,
        stateSequence: bestPath.map(state => ({ state, name: `Knowledge_${state}` }))
      };
    });

    return {
      algorithmName: 'Hidden Markov Model (HMM)',
      executionTime: execution.time,
      complexity: { time: 'O(T × N²)', space: 'O(T × N)' },
      description: 'Probabilistic model for inferring hidden knowledge states from observable student responses.',
      result: execution.result,
      visualization: {
        type: 'sequence',
        data: {
          observations,
          states: execution.result.stateSequence,
          transitions: transitions,
          bestPath: execution.result.bestPath
        }
      }
    };
  }
};

// Helper functions
function heapifyDown(arr: number[], n: number, i: number, steps: any[]) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] < arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] < arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    steps.push({ swapped: [i, largest], array: [...arr] });
    heapifyDown(arr, n, largest, steps);
  }
}

function updateFenwick(tree: number[], index: number, value: number, operations: any[]) {
  for (let i = index + 1; i < tree.length; i += i & (-i)) {
    tree[i] += value;
    operations.push({ index: i, value: tree[i], operation: 'update' });
  }
}

function queryFenwick(tree: number[], index: number): number {
  let sum = 0;
  for (let i = index + 1; i > 0; i -= i & (-i)) {
    sum += tree[i];
  }
  return sum;
}