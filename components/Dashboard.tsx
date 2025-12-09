
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DashboardStats } from '../types';
import { ArrowUp, ArrowDown, Clock, PhoneIncoming, Users, CheckCircle, Smartphone, UserCheck, Timer, Briefcase, Star, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const dataCallVolume = [
  { name: '09:00', calls: 40 },
  { name: '10:00', calls: 85 },
  { name: '11:00', calls: 120 },
  { name: '12:00', calls: 90 },
  { name: '13:00', calls: 60 },
  { name: '14:00', calls: 95 },
  { name: '15:00', calls: 110 },
];

const dataAgentPerformance = [
  { name: 'Mon', calls: 45 },
  { name: 'Tue', calls: 52 },
  { name: 'Wed', calls: 48 },
  { name: 'Thu', calls: 61 },
  { name: 'Fri', calls: 55 },
];

const dataDisposition = [
  { name: 'Resolved', value: 450 },
  { name: 'Callback', value: 120 },
  { name: 'Sales', value: 80 },
  { name: 'Complaint', value: 50 },
];

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

interface DashboardProps {
    stats: DashboardStats;
    userRole?: 'Manager' | 'Agent';
}

const StatCard = ({ title, value, subtext, icon: Icon, trend, colorClass = "bg-nbfc-50 text-nbfc-600" }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            {trend === 'up' ? <ArrowUp size={14} className="text-green-500 mr-1"/> : <ArrowDown size={14} className="text-red-500 mr-1"/>}
            <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>{subtext}</span>
            <span className="text-gray-400 ml-1">vs yesterday</span>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, userRole = 'Manager' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };
  
  // -------------------------
  // MANAGER DASHBOARD
  // -------------------------
  if (userRole === 'Manager') {
      return (
        <div className="p-6 overflow-y-auto h-full bg-gray-50 custom-scroll">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>
            
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Calls Today" value={stats.totalCalls} subtext="12%" trend="up" icon={PhoneIncoming} />
                <StatCard title="Avg Handle Time" value={stats.avgHandleTime} subtext="5%" trend="down" icon={Clock} />
                <StatCard title="CSAT Score" value={`${stats.csatScore}/5`} subtext="0.2" trend="up" icon={Users} />
                <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} subtext="1.5%" trend="up" icon={CheckCircle} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Call Volume Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Call Volume (Hourly)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataCallVolume}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="calls" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Disposition Mix */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Call Disposition Mix</h3>
                    <div className="h-64 flex">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataDisposition}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataDisposition.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Team Performance Board */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Team Performance Details</h3>
                        <p className="text-sm text-gray-500">Live view of executive status and daily metrics.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Filter by Group</button>
                        <button className="px-3 py-1.5 text-xs font-medium bg-nbfc-600 text-white rounded hover:bg-nbfc-700">Export Report</button>
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Agent Name</th>
                            <th className="px-6 py-4">Current Status</th>
                            <th className="px-6 py-4">Login Time</th>
                            <th className="px-6 py-4">Calls Answered</th>
                            <th className="px-6 py-4">AHT (mins)</th>
                            <th className="px-6 py-4">CSAT</th>
                            <th className="px-6 py-4">Current Activity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">SJ</div>
                                Sarah Jenkins
                            </td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200 flex w-fit items-center gap-1"><UserCheck size={12}/> Ready</span></td>
                            <td className="px-6 py-4">08:55 AM</td>
                            <td className="px-6 py-4 font-medium text-gray-900">42</td>
                            <td className="px-6 py-4">04:12</td>
                            <td className="px-6 py-4 text-green-600 font-bold">4.8</td>
                            <td className="px-6 py-4 text-gray-400">Idle</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">MR</div>
                                Mike Ross
                            </td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200 flex w-fit items-center gap-1"><Smartphone size={12}/> On Call</span></td>
                            <td className="px-6 py-4">09:00 AM</td>
                            <td className="px-6 py-4 font-medium text-gray-900">38</td>
                            <td className="px-6 py-4">05:45</td>
                            <td className="px-6 py-4 text-yellow-600 font-bold">3.9</td>
                            <td className="px-6 py-4 text-gray-900 font-medium">Collection - PL Overdue</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">PS</div>
                                Priya Sharma
                            </td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200 flex w-fit items-center gap-1"><Timer size={12}/> Wrap Up</span></td>
                            <td className="px-6 py-4">09:15 AM</td>
                            <td className="px-6 py-4 font-medium text-gray-900">45</td>
                            <td className="px-6 py-4">03:55</td>
                            <td className="px-6 py-4 text-green-600 font-bold">4.5</td>
                            <td className="px-6 py-4 text-gray-500">Disposition Pending</td>
                        </tr>
                         <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">RK</div>
                                Rahul Khanna
                            </td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200 flex w-fit items-center gap-1"><Clock size={12}/> Break</span></td>
                            <td className="px-6 py-4">09:00 AM</td>
                            <td className="px-6 py-4 font-medium text-gray-900">22</td>
                            <td className="px-6 py-4">04:30</td>
                            <td className="px-6 py-4 text-green-600 font-bold">4.2</td>
                            <td className="px-6 py-4 text-gray-400">Lunch Break</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      );
  }

  // -------------------------
  // AGENT DASHBOARD
  // -------------------------
  return (
    <div className="p-6 overflow-y-auto h-full bg-gray-50 custom-scroll">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h1>
        
        {/* Agent KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Calls Taken Today" 
                value="42" 
                subtext="Top 10% in team" 
                trend="up" 
                icon={PhoneIncoming} 
                colorClass="bg-blue-50 text-blue-600"
            />
            <StatCard 
                title="Login Hours" 
                value="06:30" 
                subtext="On track" 
                trend="up" 
                icon={Briefcase} 
                colorClass="bg-purple-50 text-purple-600"
            />
            <StatCard 
                title="My Quality Score" 
                value="92%" 
                subtext="Above target" 
                trend="up" 
                icon={Star} 
                colorClass="bg-yellow-50 text-yellow-600"
            />
             <StatCard 
                title="Average Handle Time" 
                value="04:12" 
                subtext="Within SLA" 
                trend="down" 
                icon={Clock} 
                colorClass="bg-green-50 text-green-600"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             {/* Agent Weekly Trend */}
             <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">My Weekly Call Volume</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dataAgentPerformance}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                             <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                             <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                             <Line type="monotone" dataKey="calls" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Agent Alerts / Todo - My Reminders */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">My Reminders</h3>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => changeDate(-1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition-all"><ChevronLeft size={16}/></button>
                        <div className="flex items-center gap-2 px-2">
                            <CalendarIcon size={14} className="text-gray-500"/>
                            <span className="text-sm font-medium text-gray-700 w-24 text-center">{formatDate(currentDate)}</span>
                        </div>
                        <button onClick={() => changeDate(1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition-all"><ChevronRight size={16}/></button>
                    </div>
                </div>
                
                <div className="space-y-4 overflow-y-auto custom-scroll pr-2 flex-1">
                    {currentDate.toDateString() === new Date().toDateString() ? (
                        <>
                             <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="text-xs font-bold text-gray-500 w-10 text-right">14:00</div>
                                    <div className="w-px h-full bg-gray-200 my-1 group-last:bg-transparent relative">
                                        <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="pb-4 w-full">
                                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 w-full hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-red-800">Callback Required</p>
                                            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-red-100 text-red-600 font-medium">High</span>
                                        </div>
                                        <p className="text-xs text-red-700 mt-1 font-medium">Rajesh Verma</p>
                                        <p className="text-xs text-red-500 mt-0.5">Discussed PL Top-up, asked to call back.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="text-xs font-bold text-gray-500 w-10 text-right">16:30</div>
                                    <div className="w-px h-full bg-gray-200 my-1 group-last:bg-transparent relative">
                                        <div className="absolute top-0 -left-[5px] w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="pb-4 w-full">
                                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 w-full hover:shadow-md transition-shadow">
                                        <p className="text-sm font-bold text-blue-800">Training Session</p>
                                        <p className="text-xs text-blue-600 mt-1">Topic: New Loan Products</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <CalendarIcon size={32} className="mb-2 opacity-20"/>
                            <p className="text-sm">No reminders for this date.</p>
                            <button className="mt-2 text-xs text-nbfc-600 font-medium hover:underline">Add Reminder</button>
                        </div>
                    )}
                </div>
             </div>
        </div>

        {/* My Recent Calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">My Recent Call History</h3>
            </div>
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Disposition</th>
                        <th className="px-6 py-4">Outcome</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">10:30 AM</td>
                        <td className="px-6 py-4 font-medium text-gray-900">Rajesh Verma</td>
                        <td className="px-6 py-4">Inbound</td>
                        <td className="px-6 py-4">04:12</td>
                        <td className="px-6 py-4">Resolved</td>
                        <td className="px-6 py-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Success</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">10:15 AM</td>
                        <td className="px-6 py-4 font-medium text-gray-900">Priya Singh</td>
                        <td className="px-6 py-4">Outbound</td>
                        <td className="px-6 py-4">02:45</td>
                        <td className="px-6 py-4">Callback</td>
                        <td className="px-6 py-4"><span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">Pending</span></td>
                    </tr>
                     <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">09:45 AM</td>
                        <td className="px-6 py-4 font-medium text-gray-900">Amit Sharma</td>
                        <td className="px-6 py-4">Inbound</td>
                        <td className="px-6 py-4">06:20</td>
                        <td className="px-6 py-4">Escalated</td>
                        <td className="px-6 py-4"><span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">Ticket Raised</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Dashboard;
