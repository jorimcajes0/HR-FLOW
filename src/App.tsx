/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle,
  ClipboardCheck,
  LayoutDashboard, 
  FileText, 
  UserSearch, 
  MessageSquare, 
  ChevronRight, 
  Send, 
  Plus, 
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Sparkles,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { generateJobDescription, screenResume, hrAssistantChat, generateInterviewQuestions, generateOnboardingChecklist } from './services/geminiService';

type View = 'dashboard' | 'jd-generator' | 'resume-screener' | 'interview-questions' | 'onboarding-checklist' | 'ai-assistant';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-[#f5f5f5]/80 backdrop-blur-md px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-2xl font-semibold tracking-tight capitalize">
              {activeView.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-medium">
              JD
            </div>
          </div>
        </header>

        <div className="px-8 pb-12">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && <Dashboard key="dashboard" setActiveView={setActiveView} />}
            {activeView === 'jd-generator' && <JDGenerator key="jd" />}
            {activeView === 'resume-screener' && <ResumeScreener key="resume" />}
            {activeView === 'interview-questions' && <InterviewGenerator key="interview" />}
            {activeView === 'onboarding-checklist' && <OnboardingGenerator key="onboarding" />}
            {activeView === 'ai-assistant' && <AIAssistant key="ai" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ activeView, setActiveView, isOpen, setIsOpen }: { 
  activeView: View, 
  setActiveView: (view: View) => void,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jd-generator', label: 'JD Generator', icon: FileText },
    { id: 'resume-screener', label: 'Resume Screener', icon: UserSearch },
    { id: 'interview-questions', label: 'Interview Qs', icon: HelpCircle },
    { id: 'onboarding-checklist', label: 'Onboarding', icon: ClipboardCheck },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
      className={cn(
        "bg-white border-r border-slate-100 flex flex-col h-full overflow-hidden",
        !isOpen && "border-none"
      )}
    >
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">HR Flow</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-50 rounded-lg">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
              activeView === item.id 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeView === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-900"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeView === item.id && (
              <motion.div layoutId="active-pill" className="ml-auto">
                <ChevronRight className="w-4 h-4 opacity-50" />
              </motion.div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-top border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pro Plan</p>
          <p className="text-sm text-slate-600 mb-3">Unlock advanced AI features and unlimited screenings.</p>
          <button className="w-full bg-white border border-slate-200 text-slate-900 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

function Dashboard({ setActiveView }: { setActiveView: (view: View) => void }) {
  const stats = [
    { label: 'Open Roles', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Applicants', value: '48', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Interviews Today', value: '6', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Offers Sent', value: '3', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const recentTasks = [
    { title: 'Draft Senior React JD', type: 'JD Generator', time: '2h ago', status: 'In Progress' },
    { title: 'Screen Resume: Alex Chen', type: 'Resume Screener', time: '4h ago', status: 'Completed' },
    { title: 'Policy Query: Remote Work', type: 'AI Assistant', time: 'Yesterday', status: 'Completed' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveView('jd-generator')}
              className="card p-6 text-left hover:border-slate-300 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Create JD</h3>
              <p className="text-sm text-slate-500">Generate a professional JD in seconds.</p>
            </button>
            <button 
              onClick={() => setActiveView('resume-screener')}
              className="card p-6 text-left hover:border-slate-300 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserSearch className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Screen Resume</h3>
              <p className="text-sm text-slate-500">Analyze candidate fit against requirements.</p>
            </button>
            <button 
              onClick={() => setActiveView('interview-questions')}
              className="card p-6 text-left hover:border-slate-300 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Interview Qs</h3>
              <p className="text-sm text-slate-500">Generate tailored interview questions.</p>
            </button>
            <button 
              onClick={() => setActiveView('onboarding-checklist')}
              className="card p-6 text-left hover:border-slate-300 transition-all group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Onboarding</h3>
              <p className="text-sm text-slate-500">Create 30-60-90 day checklists.</p>
            </button>
          </div>

          <div className="card">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-semibold">Recent Activity</h2>
              <button className="text-sm text-slate-500 hover:text-slate-900">View all</button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentTasks.map((task, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-slate-400">{task.type} • {task.time}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                    task.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
          <div className="card p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-400 text-sm mb-2">Ask anything</p>
              <h3 className="text-lg font-semibold mb-4">"How should I handle a performance improvement plan?"</h3>
              <button 
                onClick={() => setActiveView('ai-assistant')}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors"
              >
                Chat with Assistant
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Upcoming Interviews</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Candidate Name</p>
                    <p className="text-xs text-slate-400">Product Designer • 2:00 PM</p>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function JDGenerator() {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('Senior');
  const [requirements, setRequirements] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role || !requirements) return;
    setIsLoading(true);
    try {
      const jd = await generateJobDescription(role, level, requirements);
      setResult(jd || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Job Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Engineer" 
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Experience Level</label>
                <select 
                  className="input-field"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option>Junior</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Lead</option>
                  <option>Manager</option>
                  <option>Director</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Key Requirements & Skills</label>
                <textarea 
                  placeholder="List key skills, years of experience, and specific tools..." 
                  className="input-field min-h-[150px] resize-none"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !role || !requirements}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate Description
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cn(
            "card p-8 min-h-[500px] flex flex-col",
            !result && "items-center justify-center text-center bg-slate-50/50 border-dashed"
          )}>
            {result ? (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">No Description Yet</h3>
                <p className="text-sm text-slate-500">Fill in the details on the left to generate a professional job description.</p>
              </div>
            )}
          </div>
          {result && (
            <div className="flex gap-4">
              <button className="btn-secondary flex-1">Copy to Clipboard</button>
              <button className="btn-primary flex-1">Save Draft</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ResumeScreener() {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScreen = async () => {
    if (!jd || !resume) return;
    setIsLoading(true);
    try {
      const analysis = await screenResume(jd, resume);
      setResult(analysis || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold">Screening Input</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Job Description / Requirements</label>
                <textarea 
                  placeholder="Paste the job description here..." 
                  className="input-field min-h-[150px] resize-none"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Resume Content</label>
                <textarea 
                  placeholder="Paste the candidate's resume text here..." 
                  className="input-field min-h-[200px] resize-none"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleScreen}
              disabled={isLoading || !jd || !resume}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserSearch className="w-5 h-5" />}
              Analyze Resume
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cn(
            "card p-8 min-h-[500px] flex flex-col",
            !result && "items-center justify-center text-center bg-slate-50/50 border-dashed"
          )}>
            {result ? (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserSearch className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Ready to Analyze</h3>
                <p className="text-sm text-slate-500">Paste the JD and Resume to get an AI-powered fit analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InterviewGenerator() {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('Senior');
  const [focus, setFocus] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role || !focus) return;
    setIsLoading(true);
    try {
      const qs = await generateInterviewQuestions(role, level, focus);
      setResult(qs || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold">Interview Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Developer" 
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Experience Level</label>
                <select 
                  className="input-field"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option>Junior</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Lead</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Interview Focus</label>
                <textarea 
                  placeholder="e.g. React performance, team leadership, problem solving..." 
                  className="input-field min-h-[150px] resize-none"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !role || !focus}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <HelpCircle className="w-5 h-5" />}
              Generate Questions
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cn(
            "card p-8 min-h-[500px] flex flex-col",
            !result && "items-center justify-center text-center bg-slate-50/50 border-dashed"
          )}>
            {result ? (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">No Questions Yet</h3>
                <p className="text-sm text-slate-500">Fill in the details to generate tailored interview questions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OnboardingGenerator() {
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role || !department) return;
    setIsLoading(true);
    try {
      const checklist = await generateOnboardingChecklist(role, department);
      setResult(checklist || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-8 space-y-6">
            <h2 className="text-xl font-semibold">Onboarding Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Marketing Manager" 
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Growth & Marketing" 
                  className="input-field"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !role || !department}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardCheck className="w-5 h-5" />}
              Generate Checklist
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className={cn(
            "card p-8 min-h-[500px] flex flex-col",
            !result && "items-center justify-center text-center bg-slate-50/50 border-dashed"
          )}>
            {result ? (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">No Checklist Yet</h3>
                <p className="text-sm text-slate-500">Fill in the details to generate a 30-60-90 day onboarding plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: "Hello! I'm your HR Assistant. I can help with policy questions, employee relations advice, or drafting internal communications. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await hrAssistantChat(userMsg, messages);
      setMessages(prev => [...prev, { role: 'assistant', text: response || '' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto h-[calc(100vh-180px)] flex flex-col"
    >
      <div className="card flex-1 flex flex-col overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-4",
              msg.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
              )}>
                {msg.role === 'user' ? 'U' : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-2xl text-sm",
                msg.role === 'user' 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-900 rounded-tl-none"
              )}>
                <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-slate-900" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="input-field pr-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">
            AI can make mistakes. Verify important legal or policy information.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
