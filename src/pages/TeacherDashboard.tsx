import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Question, TestAttempt } from '../types';
import { Users, BookOpen, Plus, Edit, Trash2, BarChart3, TrendingUp, Target, Brain, Award, Clock, CheckCircle, Zap, RefreshCw, Eye, Star, Sparkles, X, Calendar, Timer, Target as TargetIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getStudentName = (studentId: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.id === studentId);
  return user ? user.name : 'Unknown Student';
};

const TeacherDashboard = () => {
  const { questions, testAttempts, studentProgress, addQuestion, updateQuestion, deleteQuestion } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'questions'>('overview');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    topic: 'arrays' as 'arrays' | 'linkedlists',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    title: '',
    description: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  // Stats and helpers
  const students = Object.keys(studentProgress);
  const totalAttempts = testAttempts.length;
  const averageScore = testAttempts.length > 0 
    ? Math.round(testAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.questions.length * 100), 0) / testAttempts.length)
    : 0;
  const spacedRepetitionTests = testAttempts.filter(attempt => attempt.testType === 'spaced_repetition').length;
  const normalTests = testAttempts.filter(attempt => attempt.testType === 'normal').length;
  const totalQuestions = questions.length;
  const arraysQuestions = questions.filter(q => q.topic === 'arrays').length;
  const linkedListsQuestions = questions.filter(q => q.topic === 'linkedlists').length;

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Questions', value: totalQuestions, icon: BookOpen, color: 'bg-purple-500' },
    { label: 'Test Attempts', value: totalAttempts, icon: BarChart3, color: 'bg-emerald-500' },
    { label: 'Average Score', value: `${averageScore}%`, icon: TrendingUp, color: 'bg-orange-500' }
  ];

  // --- Render Functions ---
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add more overview content if needed */}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
          Student Performance Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Student</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Arrays Mastery</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Linked Lists Mastery</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Total Tests</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Last Activity</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((studentId, index) => {
                const progress = studentProgress[studentId];
                return (
                  <tr
                    key={studentId}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100">
                      {getStudentName(studentId)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{Math.round(progress.arraysProgress.mastery)}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold">{Math.round(progress.linkedListsProgress.mastery)}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{progress.totalTests}</span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-slate-600 dark:text-slate-400">
                      {new Date(progress.lastActivity).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => { setSelectedStudent(studentId); setShowStudentModal(true); }}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-6">
      <div
        className="flex justify-between items-center"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
          Question Bank
        </h3>
        <button
          onClick={() => setIsAddingQuestion(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  question.topic === 'arrays'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                }`}>
                  {question.topic === 'arrays' ? 'Arrays' : 'Linked Lists'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  question.difficulty === 'easy'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : question.difficulty === 'medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{question.title}</h4>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{question.description}</p>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    optionIndex === question.correctAnswer
                      ? 'bg-green-500 border-2 border-green-500'
                      : 'bg-slate-200 dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500'
                  }`} />
                  <span className={`text-sm ${
                    optionIndex === question.correctAnswer
                      ? 'text-green-700 dark:text-green-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {option}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  setEditingQuestion(question);
                  setNewQuestion({
                    topic: question.topic,
                    difficulty: question.difficulty,
                    title: question.title,
                    description: question.description,
                    options: [...question.options],
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation
                  });
                }}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this question?')) {
                    deleteQuestion(question.id);
                  }
                }}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {question.explanation && (
              <div className="mt-4 p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Explanation:</span> {question.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Student Performance Modal
  const renderStudentModal = () => {
    if (!selectedStudent) return null;

    const studentName = getStudentName(selectedStudent);
    const progress = studentProgress[selectedStudent];
    const studentAttempts = testAttempts.filter(attempt => attempt.studentId === selectedStudent);

    return (
      <AnimatePresence>
        {showStudentModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStudentModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{studentName}</h2>
                  <p className="text-slate-600 dark:text-slate-400">Performance Overview</p>
                </div>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Performance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Tests</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{progress.totalTests}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div
                    className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">Arrays Mastery</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{Math.round(progress.arraysProgress.mastery)}%</p>
                      </div>
                      <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div
                    className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Linked Lists Mastery</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{Math.round(progress.linkedListsProgress.mastery)}%</p>
                      </div>
                      <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div
                    className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Last Activity</p>
                        <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                          {new Date(progress.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* Test History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Test History
                  </h3>

                  {studentAttempts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No test attempts yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {studentAttempts.map((attempt, index) => {
                        const score = Math.round((attempt.score / attempt.questions.length) * 100);
                        const correctAnswers = attempt.answers.filter((answer, i) =>
                          answer === attempt.questions[i].correctAnswer
                        ).length;

                        return (
                          <div
                            key={attempt.id}
                            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  Test #{studentAttempts.length - index}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {new Date(attempt.completedAt).toLocaleDateString()} at {new Date(attempt.completedAt).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-lg font-bold ${
                                  score >= 80 ? 'text-green-600 dark:text-green-400' :
                                  score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {score}%
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {correctAnswers}/{attempt.questions.length} correct
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center">
                                <Timer className="h-4 w-4 mr-2 text-slate-500" />
                                <span>{Math.round(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s</span>
                              </div>
                              <div className="flex items-center">
                                <TargetIcon className="h-4 w-4 mr-2 text-slate-500" />
                                <span>{attempt.testType === 'spaced_repetition' ? 'Spaced Repetition' : 'Normal Test'}</span>
                              </div>
                              <div className="flex items-center">
                                <Brain className="h-4 w-4 mr-2 text-slate-500" />
                                <span>{attempt.questions.filter(q => q.topic === 'arrays').length} Arrays</span>
                              </div>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-2 text-slate-500" />
                                <span>{attempt.questions.filter(q => q.topic === 'linkedlists').length} Linked Lists</span>
                              </div>
                            </div>

                            {/* Question Details */}
                            <div className="mt-4 space-y-2">
                              <h5 className="font-medium text-slate-900 dark:text-white">Questions:</h5>
                              {attempt.questions.map((question, qIndex) => {
                                const isCorrect = attempt.answers[qIndex] === question.correctAnswer;
                                return (
                                  <div key={qIndex} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <div className={`w-3 h-3 rounded-full ${
                                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                                      }`} />
                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {question.title}
                                      </span>
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        question.topic === 'arrays'
                                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                      }`}>
                                        {question.topic}
                                      </span>
                                    </div>
                                    <span className={`text-sm font-medium ${
                                      isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                      {isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 relative overflow-hidden transition-all duration-500">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/3 dark:bg-purple-400/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div
          className="mb-8"
        >
          <h1
            className="text-4xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Teacher's Dashboard
          </h1>
          <p
            className="text-slate-600 dark:text-slate-300 text-lg"
          >
            Monitor student progress and manage your question bank
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/30 dark:border-slate-700/30 mb-8"
        >
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'questions', label: 'Questions', icon: BookOpen }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <div
            key={activeTab}
            className="space-y-8"
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'students' && renderStudents()}
            {activeTab === 'questions' && renderQuestions()}
          </div>
        </AnimatePresence>
      </div>

      {renderStudentModal()}

      {/* Add Question Modal */}
      {isAddingQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsAddingQuestion(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Add New Question</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                addQuestion({ ...newQuestion, createdBy: 'teacher' });
                setIsAddingQuestion(false);
                setNewQuestion({
                  topic: 'arrays',
                  difficulty: 'easy',
                  title: '',
                  description: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0,
                  explanation: ''
                });
              }}
              className="space-y-4"
            >
              <input className="w-full p-2 border rounded" placeholder="Title" value={newQuestion.title} onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })} required />
              <textarea className="w-full p-2 border rounded" placeholder="Description" value={newQuestion.description} onChange={e => setNewQuestion({ ...newQuestion, description: e.target.value })} required />
              <div className="flex space-x-2">
                <select className="p-2 border rounded" value={newQuestion.topic} onChange={e => setNewQuestion({ ...newQuestion, topic: e.target.value as 'arrays' | 'linkedlists' })}>
                  <option value="arrays">Arrays</option>
                  <option value="linkedlists">Linked Lists</option>
                </select>
                <select className="p-2 border rounded" value={newQuestion.difficulty} onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Options</label>
                {newQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      className="flex-1 p-2 border rounded mr-2"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => {
                        const opts = [...newQuestion.options];
                        opts[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: opts });
                      }}
                      required
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswer === idx}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })}
                    />
                    <span className="ml-1 text-xs">Correct</span>
                  </div>
                ))}
              </div>
              <textarea className="w-full p-2 border rounded" placeholder="Explanation (optional)" value={newQuestion.explanation} onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })} />
              <div className="flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={() => setIsAddingQuestion(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard; 