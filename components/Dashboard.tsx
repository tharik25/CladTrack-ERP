
import React from 'react';
import { Project, Material } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface Props {
  projects: Project[];
  materials: Material[];
}

const Dashboard: React.FC<Props> = ({ projects, materials }) => {
  const totalProjects = projects.length;
  const activeItems = projects.reduce((acc, p) => 
    acc + p.pos.reduce((accPo, po) => accPo + po.lineItems.length, 0), 0
  );
  
  const inTransitCount = materials.filter(m => m.status === 'IN_TRANSIT').length;

  const statusData = [
    { name: 'Receiving', value: 4, color: '#94a3b8' },
    { name: 'Welding', value: 8, color: '#3b82f6' },
    { name: 'Machining', value: 3, color: '#8b5cf6' },
    { name: 'Testing', value: 5, color: '#f59e0b' },
    { name: 'Packing', value: 2, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Command Center</h2>
          <p className="text-slate-500 mt-1 text-lg">Real-time fabrication shop overview</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
           <Clock className="w-4 h-4 text-blue-500" />
           <span className="text-sm font-medium text-slate-700">Last update: 2 mins ago</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Projects" 
          value={totalProjects} 
          icon={Activity} 
          trend="+2 this month" 
          color="blue"
        />
        <MetricCard 
          label="Active Line Items" 
          value={activeItems} 
          icon={TrendingUp} 
          trend="85% capacity" 
          color="indigo"
        />
        <MetricCard 
          label="TPI Bookings" 
          value={12} 
          icon={CheckCircle2} 
          trend="3 pending today" 
          color="emerald"
        />
        <MetricCard 
          label="Materials In-Transit" 
          value={inTransitCount} 
          icon={Truck} 
          trend="ETA < 7 days" 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workstation Load */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3Icon className="w-5 h-5 text-blue-500" />
            Workstation Throughput
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-900">
             <AlertCircle className="w-5 h-5 text-orange-500" />
             Critical Action Items
          </h3>
          <div className="space-y-4">
            <AlertItem 
              type="danger" 
              title="Material Delay: m-2 Wire" 
              desc="ETA pushed back 3 days. Affects LI-001." 
            />
            <AlertItem 
              type="warning" 
              title="TPI Handshake Required" 
              desc="Final inspection for Project A needs booking." 
            />
            <AlertItem 
              type="info" 
              title="Production Lookahead" 
              desc="Next 48 hours fully scheduled at Weld Station 1." 
            />
          </div>
          <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-100 transition-colors">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, trend, color }: any) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
  };
  
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">TREND</span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
        <p className={`text-xs mt-2 font-semibold ${color === 'amber' ? 'text-orange-500' : 'text-emerald-500'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
};

const AlertItem = ({ type, title, desc }: any) => {
  const styles: any = {
    danger: 'border-l-red-500 bg-red-50 text-red-700',
    warning: 'border-l-orange-500 bg-orange-50 text-orange-700',
    info: 'border-l-blue-500 bg-blue-50 text-blue-700',
  };
  return (
    <div className={`p-4 rounded-r-lg border-l-4 ${styles[type]} shadow-sm`}>
      <p className="font-bold text-sm">{title}</p>
      <p className="text-xs mt-1 opacity-80">{desc}</p>
    </div>
  );
};

const BarChart3Icon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

export default Dashboard;
