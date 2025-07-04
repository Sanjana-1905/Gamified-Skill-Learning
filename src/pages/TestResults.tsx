import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Clock, Target, Brain, Zap, RefreshCw, Sparkles, Star, Award, TrendingUp, Trophy, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer';

// Particle component for enhanced visual effects
const Particle = ({ x, y, delay, duration, color }: { x: number; y: number; delay: number; duration: number; color: string }) => (
  <motion.div
    className={`absolute w-2 h-2 ${color} rounded-full pointer-events-none`}
    style={{ left: x, top: y }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      y: [0, -50, -100],
      x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
    }}
    transition={{ 
      delay,
      duration,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    testQuestions, 
    answers, 
    correctAnswers, 
    timeSpent, 
    algorithms, 
    executionResults,
    testType = 'normal'
  } = location.state || {};

  // Generate particles for enhanced visual effects
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['bg-blue-400 dark:bg-blue-300', 'bg-purple-400 dark:bg-purple-300', 'bg-emerald-400 dark:bg-emerald-300', 'bg-yellow-400 dark:bg-yellow-300'][Math.floor(Math.random() * 4)]
  }));

  if (!testQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden transition-all duration-500">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-72 h-72 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl"
          />
        </div>

        {/* Floating Particles */}
        {particles.map((particle, index) => (
          <Particle key={index} {...particle} />
        ))}
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No test results found</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student')}
            className="bg-blue-500 dark:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200"
          >
            Go Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const score = Math.round((correctAnswers / testQuestions.length) * 100);
  const isSpacedRepetition = testType === 'spaced_repetition';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 relative overflow-hidden transition-all duration-500">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-72 h-72 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/3 dark:bg-purple-400/8 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}

      {/* Floating Sparkles */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-32 text-purple-400 dark:text-purple-300"
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student')}
            className="flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </motion.button>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 shadow-lg ${
                    isSpacedRepetition 
                      ? 'bg-emerald-500 dark:bg-emerald-400' 
                      : 'bg-blue-500 dark:bg-blue-400'
                  }`}
                >
                  {isSpacedRepetition ? (
                    <RefreshCw className="h-8 w-8 text-white" />
                  ) : (
                    <Zap className="h-8 w-8 text-white" />
                  )}
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {isSpacedRepetition ? 'Spaced Repetition Review' : 'Test Results'}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    {isSpacedRepetition 
                      ? 'Review completed - reinforcing your knowledge' 
                      : 'Test completed - great job!'
                    }
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className={`text-4xl font-bold ${
                    score >= 80 ? 'text-green-600 dark:text-green-400' : score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {score}%
                </motion.div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {correctAnswers} / {testQuestions.length} correct
                </div>
              </div>
            </div>

            {/* Test Type Badge */}
            <div className="flex items-center justify-center mb-6">
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
                    Spaced Repetition Review
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    New Test
                  </>
                )}
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Clock className="h-6 w-6 text-slate-600 dark:text-slate-400 mr-3" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Time Spent</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{Math.round(timeSpent / 1000)}s</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <Target className="h-6 w-6 text-slate-600 dark:text-slate-400 mr-3" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Questions</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{testQuestions.length}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <Brain className="h-6 w-6 text-slate-600 dark:text-slate-400 mr-3" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Algorithms Used</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">4</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Question Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            </motion.div>
            Question Review
          </h2>
          
          <div className="space-y-6">
            {testQuestions.map((question: any, index: number) => {
              const isCorrect = answers[index] === question.correctAnswer;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            question.topic === 'arrays' 
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' 
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                          }`}
                        >
                          {question.topic === 'arrays' ? 'Arrays' : 'Linked Lists'}
                        </motion.span>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            question.difficulty === 'easy' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : question.difficulty === 'medium'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}
                        >
                          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </motion.span>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: isCorrect ? [0, 10, -10, 0] : [0, -5, 5, 0]
                          }}
                          transition={{ duration: 0.6 }}
                          className={`flex items-center ${
                            isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 mr-1" />
                          ) : (
                            <XCircle className="h-5 w-5 mr-1" />
                          )}
                          <span className="text-sm font-medium">
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </motion.div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {question.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 mb-4">
                        {question.description}
                      </p>
                      
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${
                              optionIndex === question.correctAnswer
                                ? 'border-green-500 dark:border-green-400 bg-green-50/50 dark:bg-green-900/20'
                                : optionIndex === answers[index] && !isCorrect
                                ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/20'
                                : 'border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-600/50'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-semibold ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-500 dark:bg-green-400 text-white'
                                  : optionIndex === answers[index] && !isCorrect
                                  ? 'bg-red-500 dark:bg-red-400 text-white'
                                  : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                              }`}>
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span className={`${
                                optionIndex === question.correctAnswer
                                  ? 'text-green-800 dark:text-green-200 font-medium'
                                  : optionIndex === answers[index] && !isCorrect
                                  ? 'text-red-800 dark:text-red-200 font-medium'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {option}
                              </span>
                              {optionIndex === question.correctAnswer && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="ml-auto"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {!isCorrect && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700"
                        >
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Algorithm Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
            </motion.div>
            Algorithm Performance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              // Map selection keys to canonical algorithmName
              const algoNameMap: Record<string, string> = {
                QLearning: 'Q-Learning',
                Knapsack: 'Knapsack Optimization',
                UCB: 'Upper Confidence Bound (UCB)',
                ThompsonSampling: 'Thompson Sampling',
                MinHeap: 'Min-Heap Priority Scheduling',
                SM2: 'SM2 Spaced Repetition',
                FSRS: 'FSRS (Free Spaced Repetition Scheduler)',
                FenwickTree: 'Fenwick Tree (Binary Indexed Tree)',
                VariableRatio: 'Variable Ratio Reinforcement',
                Greedy: 'Greedy Reward Maximization',
                DP: 'Dynamic Programming Knowledge Tracking',
                DKT: 'Deep Knowledge Tracing (DKT)',
                BKT: 'Bayesian Knowledge Tracing (BKT)'
              };
              const selectedNames = [
                algoNameMap[algorithms?.questionSelection],
                algoNameMap[algorithms?.reviewScheduling],
                algoNameMap[algorithms?.rewardSystem],
                algoNameMap[algorithms?.knowledgeTracing]
              ].filter(Boolean);
              return (
                executionResults?.filter((result: any) =>
                  selectedNames.includes(result.algorithmName)
                ).map((result: any, index: number) => (
                  <motion.div
                    key={result.algorithmName}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 transition-all duration-300"
                  >
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {result.algorithmName}
                    </h4>
                    <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <p>Execution Time: {result.executionTime.toFixed(3)}ms</p>
                      <p>Time Complexity: {result.complexity.time}</p>
                      <p>Space Complexity: {result.complexity.space}</p>
                      {result.topic && <p>Topic: {result.topic}</p>}
                      {/* Final Data Structure Value Display */}
                      {result.result && (
                        <div className="mt-2">
                          {/* Q-Learning Q-table visualization */}
                          {result.algorithmName === 'Q-Learning' && result.visualization?.type === 'heatmap' && (
                            <div>
                              <span className="font-semibold">Q-Table:</span>
                              <div className="overflow-x-auto mt-2">
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
                          {/* DKT Visualization (Network Layers) */}
                          {result.algorithmName === 'Deep Knowledge Tracing (DKT)' && result.visualization && result.visualization.type === 'network' && (
                            <div className="mt-2">
                              <span className="font-semibold">DKT Network Layers:</span>
                              <div style={{ fontFamily: 'monospace', marginTop: 4 }}>
                                {result.visualization.data.layers.map((layer: any, idx: number) => (
                                  <div key={idx}>
                                    <span>{layer.name}: </span>
                                    <span>[{layer.values.map((v: any) => v.toFixed(2)).join(', ')}]</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* SM2 Easiness Factor */}
                          {result.algorithmName && result.algorithmName.toLowerCase().includes('sm2') && result.result?.easinessFactor !== undefined && (
                            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 text-purple-800 text-sm font-medium mt-2 inline-block">
                              <span>Easiness Factor: {result.result.easinessFactor.toFixed(2)}</span>
                            </div>
                          )}
                          {/* 1D Array display (Heap, Prefix Sums, Tree) */}
                          {Array.isArray(result.result.heap) && (
                            <div>
                              <span className="font-semibold">Heap (Tree View):</span>
                              <div style={{ fontFamily: 'monospace', marginTop: 4 }}>
                                {(() => {
                                  // Render heap as tree levels
                                  const heap = result.result.heap;
                                  const levels = [];
                                  let i = 0, level = 0;
                                  while (i < heap.length) {
                                    const count = Math.pow(2, level);
                                    const row = heap.slice(i, i + count);
                                    levels.push(row);
                                    i += count;
                                    level++;
                                  }
                                  return (
                                    <div>
                                      {levels.map((row, idx) => (
                                        <div key={idx} style={{ textAlign: 'center', marginBottom: 2 }}>
                                          {row.map((v: any, j: number) => (
                                            <span key={j} style={{ display: 'inline-block', minWidth: 24 }}>{v}</span>
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                          {Array.isArray(result.result.prefixSums) && (
                            <div>
                              <span className="font-semibold">Prefix Sums:</span>
                              <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>
                                [ {result.result.prefixSums.join(', ')} ]
                              </span>
                            </div>
                          )}
                          {Array.isArray(result.result.tree) && (
                            <div>
                              <span className="font-semibold">Fenwick Tree (Array):</span>
                              <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>
                                [ {result.result.tree.join(', ')} ]
                              </span>
                            </div>
                          )}
                          {/* 2D Array (Matrix) display */}
                          {Array.isArray(result.result.dp) && Array.isArray(result.result.dp[0]) && (
                            <div>
                              <span className="font-semibold">DP Table (Matrix):</span>
                              <div style={{ display: 'inline-block', marginTop: 4, border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden', background: 'var(--tw-prose-bg, #f8fafc)' }}>
                                <table style={{ borderCollapse: 'collapse' }}>
                                  <tbody>
                                    {result.result.dp.map((row: any[], i: number) => (
                                      <tr key={i}>
                                        {row.map((cell, j) => (
                                          <td key={j} style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'center', minWidth: 24 }}>{cell}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          {/* 1D Array display (Selected Items) */}
                          {Array.isArray(result.result.selectedItems) && (
                            <div>
                              <span className="font-semibold">Selected Items:</span>
                              <span style={{ fontFamily: 'monospace', marginLeft: 4 }}>
                                [ {result.result.selectedItems.join(', ')} ]
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              );
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestResults;