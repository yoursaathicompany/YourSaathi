'use client';

import { Settings, Bell, Palette, KeyRound, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk-gemini-********************');
  const [speed, setSpeed] = useState('medium');
  const [theme, setTheme] = useState('dark');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-400" />
          Account Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your preferences, API keys, and notification settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium flex items-center gap-3">
            <Settings className="w-4 h-4 text-purple-400" /> General
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl flex items-center gap-3 transition-colors">
            <Palette className="w-4 h-4" /> Appearance
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl flex items-center gap-3 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl flex items-center gap-3 transition-colors">
            <KeyRound className="w-4 h-4" /> API Keys
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-gray-400" />
              API Key Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Gemini API Key</label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                />
                <p className="text-xs text-gray-500 mt-2">
                  Stored securely. Required to generate custom quiz content using Google's generative models.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Quiz Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Default Generation Speed</label>
                <select 
                  value={speed}
                  onChange={e => setSpeed(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                >
                  <option value="fast">Fast (Lower Quality / Less Tokens)</option>
                  <option value="medium">Balanced (Recommended)</option>
                  <option value="slow">Comprehensive (Deep Analysis)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Theme</label>
                <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setTheme('light')}
                    className={\`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors \${theme === 'light' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}\`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={\`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors \${theme === 'dark' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}\`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
