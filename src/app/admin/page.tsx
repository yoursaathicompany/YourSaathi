'use client';

import { Activity, Users, BookOpen, BrainCircuit, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-400" />
            Teacher Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Monitor AI generations, review quizzes, and check student analytics.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all">
          Generate New Exam
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Students', value: '1,429', change: '+12%', icon: Users, color: 'text-blue-400' },
          { label: 'Active Quizzes', value: '142', change: '+3', icon: BookOpen, color: 'text-green-400' },
          { label: 'AI Generations', value: '8,432', change: '+842', icon: BrainCircuit, color: 'text-purple-400' },
          { label: 'Avg Score', value: '76%', change: '+5%', icon: LineChart, color: 'text-rose-400' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={\`w-6 h-6 \${stat.color}\`} />
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-panel border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Recent AI Generations</h3>
          <div className="space-y-4">
            {[
              { topic: 'Advanced Calculus Integration', by: 'Teacher Admin', time: '10 mins ago', status: 'Success' },
              { topic: 'Data Structures Trees', by: 'Auto-Gen', time: '1 hr ago', status: 'Success' },
              { topic: 'French Revolution Causes', by: 'History Dept', time: '3 hrs ago', status: 'Failed' },
              { topic: 'React Server Components', by: 'Student AI', time: '5 hrs ago', status: 'Success' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <div>
                  <p className="font-medium text-white mb-0.5">{activity.topic}</p>
                  <p className="text-xs text-gray-500">Requested by {activity.by} • {activity.time}</p>
                </div>
                <span className={\`text-xs font-semibold px-2.5 py-1 rounded-full \${activity.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}\`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Review Queue */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Needs Manual Grading</h3>
          <div className="space-y-4">
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 border-l-4 border-l-orange-500">
               <span className="text-xs text-orange-400 font-bold mb-1 block">Short Answer</span>
               <p className="text-sm text-gray-300 line-clamp-2 mb-2">"Explain the concept of quantum superposition..."</p>
               <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-white/5">
                 <span>Student #429</span>
                 <button className="text-indigo-400 hover:text-indigo-300 font-medium whitespace-nowrap">Grade Now</button>
               </div>
             </div>
             <div className="p-4 bg-black/40 rounded-xl border border-white/5 border-l-4 border-l-orange-500">
               <span className="text-xs text-orange-400 font-bold mb-1 block">Code Execution</span>
               <p className="text-sm text-gray-300 line-clamp-2 mb-2">"Write a Python script to reverse a binary tree..."</p>
               <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-white/5">
                 <span>Student #112</span>
                 <button className="text-indigo-400 hover:text-indigo-300 font-medium whitespace-nowrap">Grade Now</button>
               </div>
             </div>
             
             <button className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors mt-4">
               View All 12 Items
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
