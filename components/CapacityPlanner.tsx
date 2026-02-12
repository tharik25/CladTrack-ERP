
import React from 'react';
import { Project } from '../types';
import { STATIONS } from '../constants';
import { 
  BarChart3, 
  Maximize2, 
  Calendar as CalendarIcon,
  Users
} from 'lucide-react';

interface Props {
  projects: Project[];
}

const CapacityPlanner: React.FC<Props> = ({ projects }) => {
  // Generate mock heatmap data for 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  });

  const getHeatColor = (load: number) => {
    if (load === 0) return 'bg-slate-50 hover:bg-slate-100';
    if (load < 30) return 'bg-emerald-100 hover:bg-emerald-200';
    if (load < 70) return 'bg-blue-100 hover:bg-blue-200';
    if (load < 90) return 'bg-orange-100 hover:bg-orange-200';
    return 'bg-red-100 hover:bg-red-200';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Capacity Heat Map</h2>
          <p className="text-slate-500">14-day workstation utilization forecast</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-100 rounded" /> Light</div>
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-100 rounded" /> Medium</div>
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-orange-100 rounded" /> High</div>
             <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-100 rounded" /> Critical</div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
             <CalendarIcon className="w-4 h-4" /> Export Gantt
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10 w-64 border-b border-r border-slate-200">Workstation</th>
                {days.map(day => (
                  <th key={day} className="p-4 text-center text-[10px] font-bold text-slate-500 border-b border-slate-200 min-w-[80px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STATIONS.map(station => (
                <tr key={station.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-sm text-slate-700 border-r border-b border-slate-200 sticky left-0 bg-white group-hover:bg-slate-50 z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {station.name}
                    </div>
                  </td>
                  {days.map(day => {
                    // Random load for simulation
                    const load = Math.floor(Math.random() * 100);
                    return (
                      <td key={day} className={`p-4 border-b border-slate-200 transition-colors cursor-pointer ${getHeatColor(load)}`}>
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[10px] font-black text-slate-600">{load}%</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capacity Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
             <h4 className="font-bold text-slate-800">Manpower Efficiency</h4>
           </div>
           <p className="text-3xl font-black text-slate-900">92.4%</p>
           <p className="text-sm text-slate-500 mt-1">Direct labor hours utilization</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-orange-50 rounded-lg"><BarChart3 className="w-5 h-5 text-orange-600" /></div>
             <h4 className="font-bold text-slate-800">Critical Path Bottleneck</h4>
           </div>
           <p className="text-3xl font-black text-orange-600">Weld Overlay</p>
           <p className="text-sm text-slate-500 mt-1">Estimated delay: 4.5 days</p>
        </div>
        <div className="p-6 bg-slate-900 rounded-xl shadow-sm text-white">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-slate-800 rounded-lg"><Maximize2 className="w-5 h-5 text-blue-400" /></div>
             <h4 className="font-bold text-white">Capacity Slack</h4>
           </div>
           <p className="text-3xl font-black text-white">128 hrs</p>
           <p className="text-sm text-slate-400 mt-1">Available for next 2 weeks</p>
        </div>
      </div>
    </div>
  );
};

export default CapacityPlanner;
