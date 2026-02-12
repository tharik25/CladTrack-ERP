
import React, { useState } from 'react';
import { Project } from '../types';
import { simulateQuoteImpact } from '../services/gemini';
import { 
  Sparkles, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Loader2,
  TrendingDown
} from 'lucide-react';

interface Props {
  projects: Project[];
}

const QuoteSimulator: React.FC<Props> = ({ projects }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // Mock workstation capacity for sim
    const capacities = [
      { id: 'w1', name: 'Weld Overlay Station 1', dailyCapacityHours: 16, utilization: {} },
      { id: 'w2', name: 'Machining Center A', dailyCapacityHours: 20, utilization: {} },
    ];
    
    const impact = await simulateQuoteImpact(input, projects, capacities);
    setResult(impact);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
           <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Quotation Impact Simulator</h2>
           <p className="text-slate-500">Analyze how new projects impact your shop floor load</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-slate-700">Project Parameters</label>
          <textarea 
            className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-600 transition-all font-mono text-sm leading-relaxed"
            placeholder="Describe the new project scope... e.g., '12 spools, 24-inch diameter, Weld Overlay requirement, delivery expected by Aug 2025...'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={handleSimulate}
            disabled={loading || !input.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            RUN IMPACT ANALYSIS
          </button>
        </div>

        {/* Result Area */}
        <div className="flex flex-col">
          {result ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                     result.riskLevel === 'High' ? 'bg-red-100 text-red-600' : 
                     result.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                   }`}>
                     {result.riskLevel} Risk Project
                   </span>
                   <h3 className="text-xl font-bold text-slate-900 mt-2">Simulation Results</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Confidence Score</p>
                   <p className="text-2xl font-black text-indigo-600">{(result.confidenceScore * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{result.impactSummary}"
                  </p>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                     <AlertTriangle className="w-4 h-4 text-orange-500" />
                     Forecasted Bottlenecks
                   </h4>
                   <div className="flex flex-wrap gap-2">
                     {result.bottlenecks.map((b: string, i: number) => (
                       <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
                         {b}
                       </span>
                     ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-50 rounded-lg">
                       <Clock className="w-5 h-5 text-emerald-600" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Earliest Start Slot</p>
                        <p className="text-lg font-bold text-slate-900">{result.suggestedStartDate}</p>
                     </div>
                   </div>
                   <button className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">
                     Export Analysis <TrendingDown className="w-4 h-4 rotate-180" />
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                <BarChart3Icon className="w-8 h-8 opacity-20" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Analysis Pending</h4>
              <p className="text-sm mt-2 max-w-xs">Enter a project description and hit simulate to see the predicted impact on your current schedule.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BarChart3Icon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

export default QuoteSimulator;
