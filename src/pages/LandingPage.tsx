import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Target, Trophy, Users, Zap, ArrowRight, CheckCircle, RefreshCw, Cpu, TrendingUp } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import DarkModeToggle from '../components/DarkModeToggle';

// Custom color classes
const customBlue = 'bg-[#4F8CFF]';
const customPurple = 'bg-[#7C3AED]';
const customNavy = 'text-[#232946] dark:text-white';
const customPurpleText = 'text-[#7C3AED] dark:text-[#A78BFA]';
const customBlueText = 'text-[#4F8CFF] dark:text-[#60A5FA]';
const customLavender = 'bg-[#A78BFA]';
const customLavenderText = 'text-[#A78BFA]';

const featureColors = [
  { icon: customBlue, heading: customBlueText },
  { icon: customPurple, heading: customPurpleText },
  { icon: customLavender, heading: customLavenderText },
  { icon: customBlue, heading: customBlueText },
  { icon: customPurple, heading: customPurpleText },
  { icon: customLavender, heading: customLavenderText },
];

const sparkles = (
  <svg className="absolute top-2 right-2 w-8 h-8 pointer-events-none" viewBox="0 0 32 32" fill="none">
    <g>
      <circle cx="16" cy="16" r="2" fill="#A78BFA" />
      <circle cx="8" cy="8" r="1.2" fill="#4F8CFF" />
      <circle cx="24" cy="10" r="1.5" fill="#7C3AED" />
      <circle cx="10" cy="24" r="1" fill="#7C3AED" />
      <circle cx="26" cy="22" r="0.8" fill="#4F8CFF" />
    </g>
  </svg>
);

const LandingPage = () => {
  // Animation controls for underline
  const underlineControls = useAnimation();

  React.useEffect(() => {
    underlineControls.start({ width: '6rem', opacity: 1, transition: { duration: 0.7, delay: 0.7 } });
  }, [underlineControls]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow sticky top-0 z-20 border-b border-[#E0E7EF] dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${customBlue} rounded-xl flex items-center justify-center hover:scale-105 transition-transform`}>
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${customNavy} tracking-tight`}>
                Gamified Skill Learning
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <DarkModeToggle />
              <a href="#features" className="text-[#232946] dark:text-slate-200 hover:text-[#4F8CFF] dark:hover:text-[#60A5FA] font-medium transition-colors">Features</a>
              <a href="#about" className="text-[#232946] dark:text-slate-200 hover:text-[#4F8CFF] dark:hover:text-[#60A5FA] font-medium transition-colors">About</a>
              <Link to="/login" className="px-6 py-2 rounded-xl bg-[#7C3AED] text-white font-semibold shadow hover:bg-[#5B21B6] transition-all transform hover:scale-105">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }} 
        className="max-w-6xl mx-auto py-24 px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.3 }}
            className={`w-20 h-20 ${customBlue} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}
          >
            <Brain className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className={`text-5xl font-extrabold ${customNavy} mb-3 leading-tight`}
          >
            Gamified Skill Learning for DAA
          </motion.h1>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={underlineControls}
            className="h-1 mx-auto rounded bg-[#4F8CFF] mb-6"
            style={{ width: '6rem', opacity: 1 }}
          />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7, duration: 0.7 }} 
          className="text-xl text-[#232946] dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          In this project, we improve the learning experience by using DAA (Design and Analysis of Algorithms) to power key features like question selection, review scheduling, rewards, and progress tracking. Students can take interactive tests, get spaced reviews, earn points, and track their improvement—all guided by well-known algorithms like Q-Learning, Knapsack, SM2, and more.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            to="/login"
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-extrabold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 border-0"
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <a 
            href="#features"
            className="px-12 py-4 rounded-full border-2 border-blue-400 dark:border-blue-300 bg-white/80 dark:bg-slate-900/60 text-blue-600 dark:text-blue-200 font-bold text-lg shadow hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-700 dark:hover:text-blue-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
          >
            Learn More
          </a>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold ${customBlueText} mb-4`}>
             Features
          </h2>
          <p className="text-xl text-[#232946] dark:text-slate-300 max-w-2xl mx-auto">
          Make learning fun and effective with smart algorithms that guide what you study, when you review, how you’re rewarded, and how your progress is tracked. Everything is designed to match your pace and help you learn better—step by step.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1: Question Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06 }}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow border flex flex-col items-center text-center cursor-pointer transition-all duration-200 border-[#E0E7EF] dark:border-slate-700 p-4 md:p-5 max-w-xs mx-auto feature-glow feature-glow-blue"
          >
            <Target className="h-8 w-8 mb-2 text-blue-500" />
            <h3 className="text-lg font-bold mb-1 text-blue-500">Question Selection</h3>
            <ul className="mb-1 text-left text-sm text-slate-700 dark:text-slate-300">
              <li><b>Q-Learning:</b> A reinforcement learning algorithm that adapts to a student's performance over time by balancing exploration and exploitation.</li>
              <li><b>Knapsack Algorithm:</b> A dynamic programming technique that selects the most valuable set of questions based on difficulty, time constraints, and learning potential.</li>
            </ul>
            <p className="text-xs text-slate-500 mb-0.5"><b>Purpose:</b> To generate personalized question sets that maximize learning efficiency.</p>
          </motion.div>
          {/* Feature 2: Review Scheduling */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06 }}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow border flex flex-col items-center text-center cursor-pointer transition-all duration-200 border-[#E0E7EF] dark:border-slate-700 p-4 md:p-5 max-w-xs mx-auto feature-glow feature-glow-purple"
          >
            <RefreshCw className="h-8 w-8 mb-2 text-purple-500" />
            <h3 className="text-lg font-bold mb-1 text-purple-500">Review Scheduling</h3>
            <ul className="mb-1 text-left text-sm text-slate-700 dark:text-slate-300">
              <li><b>SM2 Algorithm:</b> Based on the SuperMemo method, it uses spaced repetition to schedule reviews just before forgetting occurs.</li>
              <li><b>MinHeap Priority Scheduling:</b> Uses a heap data structure to prioritize topics that need immediate review, ensuring high-urgency concepts are revised first.</li>
            </ul>
            <p className="text-xs text-slate-500 mb-0.5"><b>Purpose:</b> To improve long-term retention and efficient content revision.</p>
          </motion.div>
          {/* Feature 3: Reward System */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06 }}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow border flex flex-col items-center text-center cursor-pointer transition-all duration-200 border-[#E0E7EF] dark:border-slate-700 p-4 md:p-5 max-w-xs mx-auto feature-glow feature-glow-yellow"
          >
            <Trophy className="h-8 w-8 mb-2 text-yellow-500" />
            <h3 className="text-lg font-bold mb-1 text-yellow-500">Reward System</h3>
            <ul className="mb-1 text-left text-sm text-slate-700 dark:text-slate-300">
              <li><b>Variable Ratio Reinforcement:</b> A probabilistic reward system inspired by behavioral psychology that keeps learners engaged by delivering unpredictable rewards.</li>
              <li><b>Fenwick Tree (Binary Indexed Tree):</b> Tracks cumulative rewards and performance in real time with efficient updates and queries.</li>
            </ul>
            <p className="text-xs text-slate-500 mb-0.5"><b>Purpose:</b> To maintain learner motivation and provide real-time feedback on progress.</p>
          </motion.div>
          {/* Feature 4: Knowledge Tracing */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06 }}
            className="group bg-white dark:bg-slate-800 rounded-xl shadow border flex flex-col items-center text-center cursor-pointer transition-all duration-200 border-[#E0E7EF] dark:border-slate-700 p-4 md:p-5 max-w-xs mx-auto feature-glow feature-glow-green"
          >
            <Brain className="h-8 w-8 mb-2 text-green-500" />
            <h3 className="text-lg font-bold mb-1 text-green-500">Knowledge Tracing</h3>
            <ul className="mb-1 text-left text-sm text-slate-700 dark:text-slate-300">
              <li><b>Deep Knowledge Tracing (DKT):</b> A neural network–based approach that predicts a learner's knowledge state over time.</li>
              <li><b>Dynamic Programming:</b> Determines the optimal learning path through a concept map, ensuring efficient progression through content.</li>
            </ul>
            <p className="text-xs text-slate-500 mb-0.5"><b>Purpose:</b> To monitor, predict, and adapt to individual learning patterns.</p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-4xl mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-[#E0E7EF] dark:border-slate-700 p-10 flex flex-col md:flex-row items-center gap-8 transition-colors duration-300"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className={`flex-shrink-0 w-32 h-32 ${customBlue} rounded-full flex items-center justify-center`}
          >
            <Users className="h-16 w-16 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h3 className={`text-2xl font-bold ${customNavy} mb-2`}>About Gamified Skill Learning</h3>
            <p className="text-[#232946] dark:text-slate-300 text-lg mb-2">Gamified Skill Learning is an interactive platform designed to improve the way students practice and retain concepts through personalized tests, spaced reviews, and engaging reward systems. It uses well-known Design and Analysis of Algorithms (DAA) to power core features like question selection, review scheduling, performance tracking, and knowledge tracing—making the learning process more structured, adaptive, and effective.</p>
          </motion.div>
        </motion.div>
      </section>
      {/* Typewriter keyframes */}
      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink {
          0%, 100% { border-color: transparent }
          50% { border-color: #4F8CFF }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;