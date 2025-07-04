import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlgorithmSelection } from '../types';
import { Brain, Target, Gift, BarChart, ArrowRight, Info, Zap, RefreshCw, Cpu, TrendingUp, Zap as Lightning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TestSetup = () => {
  const navigate = useNavigate();
  const [algorithms, setAlgorithms] = useState<AlgorithmSelection>({
    reviewScheduling: 'SM2',
    questionSelection: 'QLearning',
    rewardSystem: 'VariableRatio',
    knowledgeTracing: 'DKT'
  });

  const algorithmOptions = {
    reviewScheduling: [
      { value: 'SM2', label: 'SM2 Spaced Repetition', description: 'Classic spaced repetition algorithm', icon: RefreshCw, color: 'bg-emerald-500', darkColor: 'dark:bg-emerald-400' },
      { value: 'MinHeap', label: 'Min-Heap Priority', description: 'Priority-based scheduling', icon: TrendingUp, color: 'bg-blue-500', darkColor: 'dark:bg-blue-400' }
    ],
    questionSelection: [
      { value: 'QLearning', label: 'Q-Learning', description: 'Reinforcement learning approach', icon: Brain, color: 'bg-purple-500', darkColor: 'dark:bg-purple-400' },
      { value: 'Knapsack', label: 'Knapsack Optimization', description: 'Dynamic programming selection', icon: Target, color: 'bg-orange-500', darkColor: 'dark:bg-orange-400' }
    ],
    rewardSystem: [
      { value: 'VariableRatio', label: 'Variable Ratio', description: 'Psychological reinforcement', icon: Gift, color: 'bg-yellow-500', darkColor: 'dark:bg-yellow-400' },
      { value: 'FenwickTree', label: 'Fenwick Tree', description: 'Binary indexed tree for rewards', icon: BarChart, color: 'bg-indigo-500', darkColor: 'dark:bg-indigo-400' }
    ],
    knowledgeTracing: [
      { value: 'DKT', label: 'Deep Knowledge Tracing', description: 'Neural network approach', icon: Cpu, color: 'bg-cyan-500', darkColor: 'dark:bg-cyan-400' },
      { value: 'DP', label: 'Dynamic Programming', description: 'Optimal substructure tracking', icon: Lightning, color: 'bg-green-500', darkColor: 'dark:bg-green-400' }
    ]
  };

  const handleAlgorithmChange = (category: keyof AlgorithmSelection, value: string) => {
    setAlgorithms(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const startTest = () => {
    // Ensure all four categories are always selected
    const safeAlgorithms = {
      reviewScheduling: algorithms.reviewScheduling || 'SM2',
      questionSelection: algorithms.questionSelection || 'QLearning',
      rewardSystem: algorithms.rewardSystem || 'VariableRatio',
      knowledgeTracing: algorithms.knowledgeTracing || 'DKT',
    };
    navigate('/test', { state: { algorithms: safeAlgorithms } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 relative overflow-hidden transition-all duration-500">
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Take the Test
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Select the algorithms you want to use for test generation, review scheduling, rewards, and knowledge tracking.Your test will be generated using the algorithms you choose, helping you learn better through a more tailored and interactive experience.
          </motion.p>
        </motion.div>

        {/* Algorithm Selection */}
        <div className="space-y-8">
          {/* Review Scheduling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-emerald-500 dark:bg-emerald-400 rounded-xl flex items-center justify-center mr-4 shadow-lg"
              >
                <RefreshCw className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review Scheduling</h2>
                <p className="text-slate-600 dark:text-slate-300">When should you review previously learned concepts?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithmOptions.reviewScheduling.map((option, index) => {
                const Icon = option.icon;
                const isSelected = algorithms.reviewScheduling === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAlgorithmChange('reviewScheduling', option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/20 backdrop-blur-sm shadow-lg'
                        : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-600/80 hover:shadow-md'
                    }`}
                  >
                    {/* Selection indicator animation */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center"
                        >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-2 h-2 bg-white rounded-full" 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center mb-3">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm ${
                          isSelected 
                            ? option.color
                            : 'bg-slate-100 dark:bg-slate-600 group-hover:bg-slate-200 dark:group-hover:bg-slate-500'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${
                          isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                        }`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-emerald-800 dark:text-emerald-200' : 'text-slate-900 dark:text-white'
                        }`}>
                          {option.label}
                        </h3>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {option.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Question Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-purple-500 dark:bg-purple-400 rounded-xl flex items-center justify-center mr-4 shadow-lg"
              >
                <Brain className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Question Selection</h2>
                <p className="text-slate-600 dark:text-slate-300">How should questions be chosen for optimal learning?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithmOptions.questionSelection.map((option, index) => {
                const Icon = option.icon;
                const isSelected = algorithms.questionSelection === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAlgorithmChange('questionSelection', option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                      isSelected
                        ? 'border-purple-500 dark:border-purple-400 bg-purple-50/80 dark:bg-purple-900/20 backdrop-blur-sm shadow-lg'
                        : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-600/80 hover:shadow-md'
                    }`}
                  >
                    {/* Selection indicator animation */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-purple-500 dark:bg-purple-400 rounded-full flex items-center justify-center"
                        >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-2 h-2 bg-white rounded-full" 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center mb-3">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm ${
                          isSelected 
                            ? option.color
                            : 'bg-slate-100 dark:bg-slate-600 group-hover:bg-slate-200 dark:group-hover:bg-slate-500'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${
                          isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                        }`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-purple-800 dark:text-purple-200' : 'text-slate-900 dark:text-white'
                        }`}>
                          {option.label}
                        </h3>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {option.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Reward System */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-yellow-500 dark:bg-yellow-400 rounded-xl flex items-center justify-center mr-4 shadow-lg"
              >
                <Gift className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reward System</h2>
                <p className="text-slate-600 dark:text-slate-300">How should your progress be rewarded and reinforced?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithmOptions.rewardSystem.map((option, index) => {
                const Icon = option.icon;
                const isSelected = algorithms.rewardSystem === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(234, 179, 8, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAlgorithmChange('rewardSystem', option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                      isSelected
                        ? 'border-yellow-500 dark:border-yellow-400 bg-yellow-50/80 dark:bg-yellow-900/20 backdrop-blur-sm shadow-lg'
                        : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-600/80 hover:shadow-md'
                    }`}
                  >
                    {/* Selection indicator animation */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center"
                        >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-2 h-2 bg-white rounded-full" 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center mb-3">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm ${
                          isSelected 
                            ? option.color
                            : 'bg-slate-100 dark:bg-slate-600 group-hover:bg-slate-200 dark:group-hover:bg-slate-500'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${
                          isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                        }`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-yellow-800 dark:text-yellow-200' : 'text-slate-900 dark:text-white'
                        }`}>
                          {option.label}
                        </h3>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      isSelected ? 'text-yellow-700 dark:text-yellow-300' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {option.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Knowledge Tracing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-cyan-500 dark:bg-cyan-400 rounded-xl flex items-center justify-center mr-4 shadow-lg"
              >
                <Cpu className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Tracing</h2>
                <p className="text-slate-600 dark:text-slate-300">How should your knowledge mastery be tracked and modeled?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algorithmOptions.knowledgeTracing.map((option, index) => {
                const Icon = option.icon;
                const isSelected = algorithms.knowledgeTracing === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAlgorithmChange('knowledgeTracing', option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/80 dark:bg-cyan-900/20 backdrop-blur-sm shadow-lg'
                        : 'border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-600/80 hover:shadow-md'
                    }`}
                  >
                    {/* Selection indicator animation */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-2 right-2 w-6 h-6 bg-cyan-500 dark:bg-cyan-400 rounded-full flex items-center justify-center"
                        >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-2 h-2 bg-white rounded-full" 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center mb-3">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm ${
                          isSelected 
                            ? option.color
                            : 'bg-slate-100 dark:bg-slate-600 group-hover:bg-slate-200 dark:group-hover:bg-slate-500'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${
                          isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                        }`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-cyan-800 dark:text-cyan-200' : 'text-slate-900 dark:text-white'
                        }`}>
                          {option.label}
                        </h3>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      isSelected ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {option.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Start Test Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={startTest}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            
            <span className="relative z-10 flex items-center">
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Start Your Test
              </motion.span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="ml-2"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </span>
          </motion.button>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-slate-600 dark:text-slate-400 mt-4 text-sm"
          >
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default TestSetup;