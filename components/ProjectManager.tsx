
import React, { useState } from 'react';
import { Project, ProjectStatus, TPIStatus } from '../types';
import { 
  FolderPlus, 
  MoreVertical, 
  ExternalLink, 
  Search,
  PlusCircle,
  FileText,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectManager: React.FC<Props> = ({ projects, setProjects }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects & Customer POs</h2>
          <p className="text-slate-500">Manage the project hierarchy and purchase orders</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
             <FileText className="w-4 h-4" /> Import CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-100">
             <PlusCircle className="w-4 h-4" /> New Project
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by client, project name, or PO..." 
              className="bg-transparent text-sm outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
               <Filter className="w-4 h-4" /> Status: All
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
               Sort: Date Modified
            </button>
         </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <FolderPlus className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                   <p className="text-sm text-slate-500 font-medium">{project.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                  project.status === ProjectStatus.IN_PROGRESS ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {project.status}
                </span>
                <button className="p-1 hover:bg-slate-200 rounded text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1">
               <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span>Purchase Orders</span>
                  <span>{project.pos.length} Found</span>
               </div>
               <div className="space-y-3">
                 {project.pos.map(po => (
                   <div key={po.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all flex justify-between items-center group/po cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center group-hover/po:bg-blue-50">
                           <FileText className="w-4 h-4 text-slate-400 group-hover/po:text-blue-500" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-700">{po.poNumber}</p>
                           <p className="text-[10px] text-slate-400">{po.lineItems.length} Spools Linked</p>
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-300 group-hover/po:text-blue-500 group-hover/po:translate-x-1 transition-all" />
                   </div>
                 ))}
               </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
               <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {project.pos.reduce((acc, po) => acc + po.lineItems.length, 0)} TOTAL ITEMS</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> 1 DELAY RISK</span>
               </div>
               <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                 PROJECT VIEW <ExternalLink className="w-3 h-3" />
               </button>
            </div>
          </div>
        ))}

        {/* Empty State / Add New Placeholder */}
        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-500 transition-all">
           <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-100">
              <PlusCircle className="w-8 h-8" />
           </div>
           <h4 className="text-lg font-bold">Register New Project</h4>
           <p className="text-sm mt-1">Start by creating a new project container.</p>
        </button>
      </div>
    </div>
  );
};

export default ProjectManager;
