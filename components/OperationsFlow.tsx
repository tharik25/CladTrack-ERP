
import React, { useState } from 'react';
import { Project, LineItem, TPIStatus } from '../types';
import { STATIONS } from '../constants';
import { 
  Lock, 
  Unlock, 
  UserCheck, 
  Calendar, 
  MoreHorizontal,
  ArrowRight,
  CheckCircle,
  FileBadge,
  // Added ShieldCheck to fix the "Cannot find name" error
  ShieldCheck
} from 'lucide-react';

interface Props {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const OperationsFlow: React.FC<Props> = ({ projects, setProjects }) => {
  const [selectedSpool, setSelectedSpool] = useState<{ projectId: string, poId: string, spool: LineItem } | null>(null);

  const handleSignOff = (projectId: string, poId: string, lineItemId: string, stationId: string, type: 'internal' | 'tpi') => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        pos: p.pos.map(po => {
          if (po.id !== poId) return po;
          return {
            ...po,
            lineItems: po.lineItems.map(li => {
              if (li.id !== lineItemId) return li;
              const qc = li.qcProgress[stationId] || { 
                stationId, 
                internalSignOff: false, 
                tpiSignOff: false, 
                tpiBookingStatus: TPIStatus.NOT_REQUIRED 
              };
              
              const updatedQC = {
                ...qc,
                internalSignOff: type === 'internal' ? true : qc.internalSignOff,
                tpiSignOff: type === 'tpi' ? true : qc.tpiSignOff,
                completedAt: (type === 'internal' && !qc.tpiSignOff) || (type === 'tpi' && qc.internalSignOff) 
                  ? new Date().toISOString() 
                  : qc.completedAt
              };

              // Advance to next station logic
              const currentStationIndex = STATIONS.findIndex(s => s.id === li.currentStationId);
              const currentStation = STATIONS[currentStationIndex];
              const isReadyToAdvance = 
                (!currentStation.requiresSignOff && updatedQC.internalSignOff) ||
                (currentStation.requiresSignOff === '*' && updatedQC.internalSignOff && updatedQC.tpiSignOff) ||
                (currentStation.requiresSignOff === '**' && updatedQC.internalSignOff && updatedQC.tpiSignOff);

              let nextStationId = li.currentStationId;
              if (isReadyToAdvance && currentStationIndex < STATIONS.length - 1) {
                nextStationId = STATIONS[currentStationIndex + 1].id;
              }

              return {
                ...li,
                currentStationId: nextStationId,
                qcProgress: { ...li.qcProgress, [stationId]: updatedQC }
              };
            })
          };
        })
      };
    }));
  };

  const getStationStatus = (li: LineItem, stationId: string) => {
    const progress = li.qcProgress[stationId];
    if (!progress) return 'locked';
    if (progress.completedAt) return 'completed';
    return 'active';
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* List Panel */}
      <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
           <h3 className="font-bold text-slate-800">Shop Floor Spools</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {projects.flatMap(p => p.pos.flatMap(po => po.lineItems.map(li => (
            <button 
              key={li.id}
              onClick={() => setSelectedSpool({ projectId: p.id, poId: po.id, spool: li })}
              className={`w-full text-left p-4 hover:bg-blue-50 transition-colors group ${selectedSpool?.spool.id === li.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{li.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{p.name} / {po.poNumber}</p>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                  {STATIONS.find(s => s.id === li.currentStationId)?.name}
                </div>
              </div>
            </button>
          ))))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 flex flex-col min-h-[600px]">
        {selectedSpool ? (
          <>
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedSpool.spool.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{selectedSpool.spool.spec}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">QC</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">TPI</div>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
                    Generate NOI
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {STATIONS.map((station, idx) => {
                const status = getStationStatus(selectedSpool.spool, station.id);
                const isActive = selectedSpool.spool.currentStationId === station.id;
                const qc = selectedSpool.spool.qcProgress[station.id];

                return (
                  <div 
                    key={station.id} 
                    className={`relative p-4 border rounded-xl transition-all duration-300 ${
                      isActive ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-lg scale-[1.02]' : 
                      status === 'completed' ? 'border-emerald-200 bg-emerald-50 opacity-75' : 
                      'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          status === 'completed' ? 'bg-emerald-500 text-white' : 
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <h4 className={`font-bold ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                            {station.name}
                            {station.requiresSignOff && <span className="ml-2 text-red-500 font-black">{station.requiresSignOff}</span>}
                          </h4>
                          {isActive && (
                            <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-0.5">
                              <ArrowRight className="w-3 h-3" /> CURRENT WORKSTATION
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-4">
                        {isActive && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSignOff(selectedSpool.projectId, selectedSpool.poId, selectedSpool.spool.id, station.id, 'internal')}
                              disabled={qc?.internalSignOff}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                qc?.internalSignOff 
                                  ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-sm'
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              QC SIGN-OFF
                            </button>

                            {station.requiresSignOff && (
                              <button 
                                onClick={() => handleSignOff(selectedSpool.projectId, selectedSpool.poId, selectedSpool.spool.id, station.id, 'tpi')}
                                disabled={qc?.tpiSignOff || !qc?.internalSignOff}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  qc?.tpiSignOff 
                                    ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                                    : qc?.internalSignOff 
                                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                }`}
                              >
                                <FileBadge className="w-3.5 h-3.5" />
                                TPI SIGN-OFF
                              </button>
                            )}
                          </div>
                        )}
                        {status === 'completed' && <div className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> RELEASED</div>}
                        {!isActive && status !== 'completed' && <Lock className="w-4 h-4 text-slate-300" />}
                      </div>
                    </div>

                    {/* Meta info for active */}
                    {isActive && station.requiresSignOff && (
                      <div className="mt-4 pt-3 border-t border-blue-100 flex items-center gap-4 text-[10px] font-semibold text-blue-800 uppercase tracking-wider">
                         <div className="flex items-center gap-1">
                           <Calendar className="w-3 h-3" /> TPI NOTICE: {station.minTpiNoticeDays} DAYS REQUIRED
                         </div>
                         <div className="flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3" /> SIGN-OFF LEVEL: {station.requiresSignOff === '**' ? 'CRITICAL (QC+TPI)' : 'STANDARD (QC)'}
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
              <ClipboardListIcon className="w-12 h-12" />
            </div>
            <p className="text-lg font-medium">Select a spool to manage QC gates</p>
            <p className="text-sm mt-1 opacity-75">Spools only appear here if their production has been scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ClipboardListIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
);

export default OperationsFlow;
