import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Brain, Trophy, Target, TrendingUp, BookOpen, Play, Star, Calendar, Clock, Zap, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getStudentProgress, testAttempts, questions, getQuestionsDueForReview, getReviewData } = useData();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const progress = user ? getStudentProgress(user.id) : null;
  const userAttempts = testAttempts.filter(attempt => attempt.studentId === user?.id);

  // Find questions the user got wrong in their last 5 tests
  const recentAttempts = userAttempts.slice(-5);
  const wrongQuestionIds = new Set<string>();
  recentAttempts.forEach(attempt => {
    attempt.questions.forEach((q, i) => {
      if (attempt.answers[i] !== q.correctAnswer) {
        wrongQuestionIds.add(q.id);
      }
    });
  });
  const reviewQuestions = questions.filter(q => wrongQuestionIds.has(q.id));

  // Use spaced repetition: only show questions due for review
  const dueReviewQuestions = user ? getQuestionsDueForReview(user.id, questions) : [];

  // Before rendering the modal, enrich dueReviewQuestions with nextReview if not present
  const reviewData = user ? getReviewData(user.id) : {};
  const dueReviewQuestionsWithNext = dueReviewQuestions.map(q => ({
    ...q,
    nextReview: reviewData[q.id]?.nextReview || null
  }));

  const recentAchievements = progress?.achievements.slice(-3) || [];

  // Prepare chart data
  const topicData = [
    { name: 'Arrays', value: progress?.arraysProgress.mastery || 0, color: '#3B82F6' },
    { name: 'Linked Lists', value: progress?.linkedListsProgress.mastery || 0, color: '#10B981' }
  ];

  const progressData = [
    { name: 'Arrays', mastery: progress?.arraysProgress.mastery || 0, questions: progress?.arraysProgress.questionsAnswered || 0, correct: progress?.arraysProgress.correctAnswers || 0 },
    { name: 'Linked Lists', mastery: progress?.linkedListsProgress.mastery || 0, questions: progress?.linkedListsProgress.questionsAnswered || 0, correct: progress?.linkedListsProgress.correctAnswers || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 relative overflow-hidden transition-all duration-500">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/3 dark:bg-purple-400/8 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-2"
          >
             {user?.name} ! 
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-600 dark:text-slate-300 text-lg"
          >
            This is your Student Dashboard.
You can review scheduled questions, take a new adaptive test, or explore detailed insights from your previous tests — all in one place.
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Tests</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{progress?.totalTests || 0}</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Target className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)"
            }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Arrays Mastery</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.round(progress?.arraysProgress.mastery || 0)}%</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <TrendingUp className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)"
            }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Linked Lists Mastery</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{Math.round(progress?.linkedListsProgress.mastery || 0)}%</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <BookOpen className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(249, 115, 22, 0.15)"
            }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Due for Review</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{dueReviewQuestions.length}</p>
              </div>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <RefreshCw className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Progress Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-all duration-300"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            </motion.div>
            Learning Progress
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Mastery Distribution (Arrays vs Linked Lists)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const topicName = props && props.payload && props.payload.name ? props.payload.name : '';
                      return [`${Math.round(Number(value))}%`, `${topicName} Mastery`];
                    }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {topicData.map((topic, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: topic.color }}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {topic.name === 'Arrays' ? 'Arrays' : 'Linked Lists'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Detailed Stats</h3>
              <div className="space-y-4">
                {progressData.map((topic, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{topic.name}</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{Number(topic.mastery).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 mt-2">
                      <span>{topic.correct}/{topic.questions} correct</span>
                      <span>{topic.questions} questions</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* New Test Card */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/test-setup')}
            className="group relative overflow-hidden bg-blue-500 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
            />
            <div className="relative flex items-center">
              <motion.div 
                className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mr-6 backdrop-blur-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Play className="h-10 w-10 text-white" />
              </motion.div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">Take New Test</h3>
                <p className="mt-2 text-white/90">Click here to start an adaptive test based on your current skill level.</p>
              </div>
            </div>
          </motion.button>

          {/* Review Card */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReviewModal(true)}
            className="group relative overflow-hidden bg-purple-500 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div 
              className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
            />
            <div className="relative flex items-center">
              <motion.div 
                className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mr-6 backdrop-blur-sm"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <RefreshCw className="h-10 w-10 text-white" />
              </motion.div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">Review Questions</h3>
                <p className="mt-2 text-white/90">Click here to Review scheduled questions to reinforce concepts through spaced repetition</p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-all duration-300"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            </motion.div>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {userAttempts.slice(-3).map((attempt, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4"
                  >
                    <Target className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Test #{attempt.id.slice(-4)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {attempt.questions.length} questions • {Math.round((attempt.score / attempt.questions.length) * 100)}% score
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {Math.round(attempt.timeSpent / 1000)}s
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Algorithm Insights Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-all duration-300"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
            </motion.div>
            Recent Algorithm Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userAttempts.slice(-4).map((attempt, index) => (
              <motion.div 
                key={attempt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-blue-50/80 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                    Test #{userAttempts.length - index}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    attempt.testType === 'spaced_repetition'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                  }`}>
                    {attempt.testType === 'spaced_repetition' ? 'Review' : 'New'}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center">
                    <Target className="h-3 w-3 text-blue-500 mr-1" />
                    <span>{attempt.algorithmsUsed.questionSelection}</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="h-3 w-3 text-purple-500 mr-1" />
                    <span>{attempt.algorithmsUsed.knowledgeTracing}</span>
                  </div>
                  <div className="flex items-center">
                    <RefreshCw className="h-3 w-3 text-emerald-500 mr-1" />
                    <span>{attempt.algorithmsUsed.reviewScheduling}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span>{attempt.algorithmsUsed.rewardSystem}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                  {new Date(attempt.completedAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Tests Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
            </motion.div>
            Past Tests & Analysis
          </h2>
          <div className="space-y-4">
            {userAttempts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                </motion.div>
                <p className="text-slate-600 dark:text-slate-400 text-lg">No tests taken yet. Start your learning journey!</p>
              </motion.div>
            ) : (
              userAttempts.slice().reverse().map((attempt, idx) => (
                <motion.div 
                  key={attempt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/80 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-4 ${
                        attempt.testType === 'spaced_repetition' 
                          ? 'bg-emerald-400' 
                          : 'bg-blue-400'
                      }`} />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                          {attempt.testType === 'spaced_repetition' ? (
                            <>
                              <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                              Spaced Repetition Review #{userAttempts.length - idx}
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                              Test #{userAttempts.length - idx}
                            </>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{new Date(attempt.completedAt).toLocaleString()}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          Score: <span className="font-semibold">{attempt.score} / {attempt.questions.length}</span>
                          <span className="mx-2">•</span>
                          <span className="font-semibold">{Math.round((attempt.score / attempt.questions.length) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-200"
                      onClick={() => navigate('/test-results', { state: {
                        testQuestions: attempt.questions,
                        answers: attempt.answers,
                        correctAnswers: attempt.score,
                        timeSpent: attempt.timeSpent,
                        algorithms: attempt.algorithmsUsed,
                        executionResults: [],
                        testType: attempt.testType
                      } })}
                    >
                      View Analysis
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-emerald-200 dark:border-emerald-700 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative mx-4 transition-colors duration-300"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-xl font-bold focus:outline-none transition-colors duration-200"
                onClick={() => setShowReviewModal(false)}
                aria-label="Close"
              >
                ×
              </motion.button>
              <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-7 w-7 text-emerald-500" />
                </motion.div>
                Personalized Review
              </h2>
              {dueReviewQuestionsWithNext.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center py-8"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Star className="h-8 w-8 text-emerald-500" />
                  </motion.div>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">No questions are due for review right now! </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Great job staying on top of your learning!</p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-72 overflow-y-auto">
                  {dueReviewQuestionsWithNext.map((q, index) => (
                    <motion.div 
                      key={q.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-900/20 dark:via-slate-700 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-700 rounded-xl p-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{q.title}</div>
                      <div className="text-slate-600 dark:text-slate-300 text-sm">{q.description}</div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        Next review: <span className="ml-1 font-semibold text-emerald-700 dark:text-emerald-400">{q.nextReview ? new Date(q.nextReview).toLocaleString() : 'Now'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-2xl shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowReviewModal(false);
                  if (dueReviewQuestions.length > 0) {
                    navigate('/test', { state: { reviewQuestions: dueReviewQuestions, reviewMode: true } });
                  }
                }}
                disabled={dueReviewQuestions.length === 0}
              >
                Start Review
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;