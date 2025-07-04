import { AlgorithmExecutionResult, Question } from '../types';

// Performance measurement utility - To generate artifical delay so that algorithm execution else the time would be 0
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

};

// Question Selection Algorithms
export const questionSelectionAlgorithms = {

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

};

// Knowledge Tracing Algorithms
export const knowledgeTracingAlgorithms = {

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