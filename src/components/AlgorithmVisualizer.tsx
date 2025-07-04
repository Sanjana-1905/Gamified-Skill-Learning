import React from 'react';
import { AlgorithmExecutionResult } from '../types';
import { Info, Clock, TrendingUp } from 'lucide-react';

interface AlgorithmVisualizerProps {
  result: AlgorithmExecutionResult;
}

const ALGO_EXPLANATIONS: Record<string, { summary: string; details: string }> = {
  'SM2': {
    summary: 'Spaced Repetition (SM2) is used to schedule reviews at optimal intervals to boost memory retention.',
    details: 'SM2 is an algorithm that determines when you should review a question again based on how well you remembered it last time. If you answer correctly, the interval increases; if not, it decreases. This helps you remember information for longer periods with less effort.'
  },
  'MinHeap': {
    summary: 'MinHeap is used to always access the most urgent or smallest item first.',
    details: 'A MinHeap is a special tree-based data structure where the smallest element is always at the top. It is used in scheduling and prioritization tasks, ensuring the most important or urgent item is handled first.'
  },
  'QLearning': {
    summary: 'Q-Learning is a reinforcement learning algorithm for making optimal decisions through trial and error.',
    details: 'Q-Learning helps the system learn the best actions to take in different situations by trying things out and learning from the results. Over time, it figures out which choices lead to the best outcomes, even if it has to explore and make mistakes along the way.'
  },
  'Knapsack': {
    summary: 'The Knapsack algorithm helps select the best combination of items within a limited capacity.',
    details: 'This algorithm is used to maximize value without exceeding a weight or space limit. It tries different combinations and picks the one that gives the most value while staying within the allowed limit.'
  },
  'VariableRatio': {
    summary: 'Variable Ratio rewards keep users motivated by giving rewards at unpredictable intervals.',
    details: 'Instead of rewarding every correct answer, rewards are given randomly. This unpredictability keeps users engaged and motivated to continue.'
  },
  'FenwickTree': {
    summary: 'Fenwick Tree (Binary Indexed Tree) is used for efficient cumulative frequency and sum queries.',
    details: 'This data structure allows quick updates and queries of cumulative data, such as scores or progress, making it efficient for tracking and updating user stats.'
  },
  'DKT': {
    summary: 'Deep Knowledge Tracing (DKT) models a student\'s knowledge over time.',
    details: 'DKT uses neural networks to predict how likely a student is to answer correctly in the future, based on their past answers. It helps personalize learning by focusing on areas where the student needs more practice.'
  },
  'DP': {
    summary: 'Dynamic Programming (DP) solves complex problems by breaking them into simpler subproblems.',
    details: 'DP is used to solve problems efficiently by storing solutions to smaller subproblems and building up to the final answer. It avoids redundant calculations and is used in many optimization problems.'
  },
};

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({ result }) => {
  const explanation = ALGO_EXPLANATIONS[result.algorithmName] || {
    summary: result.description,
    details: 'This algorithm is used to optimize your learning experience.'
  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 max-w-xl mx-auto transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <Info className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight">{result.algorithmName}</h2>
      </div>
      <div className="flex flex-wrap gap-2 my-4">
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 text-blue-800 text-sm font-medium">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Execution: {result.executionTime.toFixed(2)} ms</span>
      </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200 text-green-800 text-sm font-medium">
          <span>Time: {result.complexity.time}</span>
          </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 text-yellow-800 text-sm font-medium">
          <TrendingUp className="w-4 h-4 text-yellow-400" />
          <span>Space: {result.complexity.space}</span>
        </div>
        {/* SM2 Easiness Factor */}
        {result.algorithmName && result.algorithmName.toLowerCase().includes('sm2') && result.result?.easinessFactor !== undefined && (
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 text-purple-800 text-sm font-medium">
            <span>Easiness Factor: {result.result.easinessFactor.toFixed(2)}</span>
          </div>
        )}
      </div>
      {/* Q-Learning Q-table visualization (moved up) */}
      {result.algorithmName === 'Q-Learning' && result.visualization?.type === 'heatmap' && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Q-Table</h3>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-blue-200">
              <thead>
                <tr>
                  <th className="border border-blue-200 px-2 py-1 bg-blue-50">State</th>
                  {(Array.from(new Set(result.visualization.data.map((cell: any) => cell.action))) as number[]).map((action) => (
                    <th key={action} className="border border-blue-200 px-2 py-1 bg-blue-50">A{action + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Array.from(new Set(result.visualization.data.map((cell: any) => cell.state))) as number[]).map((state) => (
                  <tr key={state}>
                    <td className="border border-blue-200 px-2 py-1 font-semibold bg-blue-50">S{state + 1}</td>
                    {result.visualization.data.filter((cell: any) => cell.state === state).map((cell: any, idx: number) => (
                      <td
                        key={idx}
                        className={`border border-blue-200 px-2 py-1 text-center ${cell.selected ? 'bg-yellow-200 font-bold' : ''}`}
                      >
                        {cell.value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <hr className="my-4 border-blue-100" />
      <div className="text-gray-700 leading-relaxed text-base">{explanation.details}</div>
    </div>
  );
};

export default AlgorithmVisualizer;