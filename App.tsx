
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  ShieldCheck, 
  Calendar, 
  PlusCircle, 
  FileText,
  BarChart3,
  Search,
  AlertTriangle,
  Menu,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Project, Material, WorkstationCapacity } from './types';
import { INITIAL_MATERIALS, MOCK_PROJECTS, STATIONS } from './constants';
import Dashboard from './components/Dashboard';
import ProjectManager from './components/ProjectManager';
import OperationsFlow from './components/OperationsFlow';
import LookaheadPlanner from './components/LookaheadPlanner';
import CapacityPlanner from './components/CapacityPlanner';
import QuoteSimulator from './components/QuoteSimulator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence (Simulated)
  useEffect(() => {
    const saved = localStorage.getItem('cladtrack_projects');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cladtrack_projects', JSON.stringify(projects));
  }, [projects]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard projects={projects} materials={materials} />;
      case 'projects':
        return <ProjectManager projects={projects} setProjects={setProjects} />;
      case 'operations':
        return <OperationsFlow projects={projects} setProjects={setProjects} />;
      case 'lookahead':
        return <LookaheadPlanner projects={projects} materials={materials} />;
      case 'capacity':
        return <CapacityPlanner projects={projects} />;
      case 'simulator':
        return <QuoteSimulator projects={projects} />;
      default:
        return <Dashboard projects={projects} materials={materials} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & POs', icon: FolderIcon },
    { id: 'operations', label: 'Ops & QC Gates', icon: ShieldCheck },
    { id: 'lookahead', label: 'Lookahead Plan', icon: ClipboardList },
    { id: 'capacity', label: 'Capacity Planner', icon: BarChart3 },
    { id: 'simulator', label: 'Quote Impact Tool', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {isSidebarOpen && <h1 className="font-bold text-xl tracking-tight">CLADTRACK</h1>}
        </div>

        <nav className="flex-1 mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white border-r-4 border-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-full flex items-center justify-center p-2 hover:bg-slate-800 rounded-md transition-colors"
           >
             <Menu className="w-5 h-5 text-slate-400" />
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 text-slate-500">
             <span className="text-sm font-medium uppercase tracking-wider">System Status: </span>
             <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Production Online
             </span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
               <Search className="w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search POs, Spools..." 
                 className="bg-transparent text-sm outline-none w-48 text-slate-600"
               />
             </div>
             <button className="p-2 hover:bg-slate-100 rounded-full relative">
               <AlertTriangle className="w-5 h-5 text-orange-500" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
               <span className="text-blue-700 font-bold text-xs">JD</span>
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-hide">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Helper Icon components
const FolderIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
);

export default App;
