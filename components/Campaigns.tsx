
import React, { useState } from 'react';
import { Campaign } from '../types';
import { Play, Pause, PieChart, Users, PhoneOutgoing, Target, X, CheckCircle, Clock } from 'lucide-react';
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CampaignsProps {
  campaigns: Campaign[];
  onStartDialing?: () => void;
}

// Mock Leads Data for the View Leads Modal
const mockLeads = [
    { id: 'LD-1001', name: 'Amit Sharma', mobile: '98****1234', status: 'Pending', score: 'High' },
    { id: 'LD-1002', name: 'Sneha Gupta', mobile: '99****5678', status: 'Called', score: 'Medium' },
    { id: 'LD-1003', name: 'Rohan Mehta', mobile: '88****9012', status: 'Converted', score: 'High' },
    { id: 'LD-1004', name: 'Priya Singh', mobile: '77****3456', status: 'Pending', score: 'Low' },
    { id: 'LD-1005', name: 'Vikram Raj', mobile: '91****7890', status: 'Callback', score: 'Medium' },
];

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, onStartDialing }) => {
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getProgressColor = (percent: number) => {
    if (percent < 30) return 'bg-red-500';
    if (percent < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleViewLeads = (campaign: Campaign) => {
      setSelectedCampaign(campaign);
      setShowLeadsModal(true);
  };

  const handleDial = () => {
    setShowLeadsModal(false);
    if (onStartDialing) onStartDialing();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto custom-scroll p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor active outbound dialing campaigns and lead performance.</p>
        </div>
        <button className="bg-nbfc-600 hover:bg-nbfc-800 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium">
          Import Leads
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => {
            const progress = Math.round((campaign.contacted / campaign.totalLeads) * 100);
            const conversionRate = Math.round((campaign.converted / campaign.contacted) * 100) || 0;

            return (
                <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                        <div>
                            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded mb-2 ${campaign.type === 'Sales' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {campaign.type}
                            </span>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{campaign.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">ID: {campaign.id}</p>
                        </div>
                        <div className={`p-2 rounded-full ${campaign.status === 'Running' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                             {campaign.status === 'Running' ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                        </div>
                    </div>

                    <div className="p-5 flex-1">
                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium text-gray-900">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progress)}`} 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">{campaign.contacted} / {campaign.totalLeads} Leads</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target size={14} className="text-gray-400"/>
                                    <span className="text-xs text-gray-500 font-medium">Conversion</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{conversionRate}%</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <Users size={14} className="text-gray-400"/>
                                    <span className="text-xs text-gray-500 font-medium">Conversions</span>
                                </div>
                                <p className="text-xl font-bold text-gray-900">{campaign.converted}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                        <button 
                            onClick={() => handleViewLeads(campaign)}
                            className="flex-1 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            View Leads
                        </button>
                        <button 
                            onClick={handleDial}
                            className="flex-1 py-2 bg-nbfc-600 text-white rounded text-sm font-medium hover:bg-nbfc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <PhoneOutgoing size={14} /> Start Dialing
                        </button>
                    </div>
                </div>
            );
        })}
      </div>

      {/* View Leads Modal */}
      {showLeadsModal && selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="font-bold text-gray-900">Leads List</h2>
                          <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
                      </div>
                      <button onClick={() => setShowLeadsModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-0 max-h-96 overflow-y-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                              <tr>
                                  <th className="px-6 py-3">Lead Name</th>
                                  <th className="px-6 py-3">Mobile</th>
                                  <th className="px-6 py-3">Score</th>
                                  <th className="px-6 py-3">Status</th>
                                  <th className="px-6 py-3 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {mockLeads.map((lead) => (
                                  <tr key={lead.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-3 font-medium text-gray-900">{lead.name}</td>
                                      <td className="px-6 py-3 text-gray-500">{lead.mobile}</td>
                                      <td className="px-6 py-3">
                                          <span className={`px-2 py-0.5 rounded text-xs ${lead.score === 'High' ? 'bg-green-100 text-green-700' : lead.score === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                              {lead.score}
                                          </span>
                                      </td>
                                      <td className="px-6 py-3">
                                          {lead.status === 'Converted' ? (
                                              <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle size={12}/> Converted</span>
                                          ) : lead.status === 'Pending' ? (
                                              <span className="flex items-center gap-1 text-gray-500 text-xs"><Clock size={12}/> Pending</span>
                                          ) : (
                                            <span className="text-blue-600 text-xs">{lead.status}</span>
                                          )}
                                      </td>
                                      <td className="px-6 py-3 text-right">
                                          <button 
                                            onClick={handleDial}
                                            className="text-nbfc-600 hover:bg-nbfc-50 p-1.5 rounded-full" 
                                            title="Call"
                                          >
                                              <PhoneOutgoing size={16} />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 text-right">
                      <button 
                        onClick={() => setShowLeadsModal(false)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Campaigns;
