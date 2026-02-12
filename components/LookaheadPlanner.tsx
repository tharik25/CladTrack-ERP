
import React from 'react';
import { Project, Material, MaterialStatus } from '../types';
import { 
  Package, 
  Truck, 
  Factory, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  // Added Clock to fix the "Cannot find name" error
  Clock
} from 'lucide-react';

interface Props {
  projects: Project[];
  materials: Material[];
}

const LookaheadPlanner: React.FC<Props> = ({ projects, materials }) => {
  const getMaterialStatusIcon = (status: MaterialStatus) => {
    switch (status) {
      case MaterialStatus.IN_STOCK: return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case MaterialStatus.IN_TRANSIT: return <Truck className="w-4 h-4 text-amber-500" />;
      case MaterialStatus.UNDER_PRODUCTION: return <Factory className="w-4 h-4 text-blue-500" />;
    }
  };

  const allLineItems = projects.flatMap(p => p.pos.flatMap(po => po.lineItems));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Production Lookahead</h2>
          <p className="text-slate-500">Material-driven production readiness plan</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             Stock Available
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
             <div className="w-2 h-2 rounded-full bg-amber-500" />
             Arrival Needed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {allLineItems.map(item => {
          const itemMaterials = materials.filter(m => item.materials.includes(m.id));
          const allReady = itemMaterials.every(m => m.status === MaterialStatus.IN_STOCK);

          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
               <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                       <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900">{item.name}</h4>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.spec}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${allReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {allReady ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {allReady ? 'READY FOR NEXT STEP' : 'WAITING FOR MATERIALS'}
                  </div>
               </div>
               
               <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Material Status Column */}
                 <div className="space-y-4">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Component Matrix</h5>
                    <div className="space-y-3">
                      {itemMaterials.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 border border-slate-100">
                           <div className="flex items-center gap-2">
                             {getMaterialStatusIcon(m.status)}
                             <span className="text-sm font-medium text-slate-700">{m.name}</span>
                           </div>
                           <span className="text-[10px] font-bold text-slate-500">{m.quantity}{m.unit}</span>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Arrival Countdown */}
                 <div className="space-y-4">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Logistics Gate</h5>
                    <div className="space-y-3">
                      {itemMaterials.map(m => (
                        <div key={m.id} className="flex flex-col gap-1">
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">ETA Progress</span>
                              <span className="text-slate-900 font-bold">{m.status === MaterialStatus.IN_STOCK ? '100%' : m.etaDate || 'Pending'}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 rounded-full ${m.status === MaterialStatus.IN_STOCK ? 'w-full bg-emerald-500' : 'w-1/2 bg-amber-500 animate-pulse'}`}
                              />
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Production Slot */}
                 <div className="bg-slate-900 rounded-xl p-4 flex flex-col justify-between text-white">
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Start Window</p>
                       <h4 className="text-lg font-bold">22 May - 25 May</h4>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                       <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <AlertCircle className="w-4 h-4 text-orange-400" />
                          Requires TPI NOI
                       </div>
                       <button className="text-xs font-bold text-blue-400 hover:text-blue-300">DETAILS</button>
                    </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LookaheadPlanner;
