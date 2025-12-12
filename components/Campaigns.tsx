
import React, { useState } from 'react';
import { Campaign } from '../types';
import { mockUsers } from '../services/mockData';
import { Play, Pause, PieChart, Users, PhoneOutgoing, Target, X, CheckCircle, Clock, Upload, FileSpreadsheet, Download, Eye, Calendar, DollarSign, Smartphone, UserPlus, CheckSquare, Square } from 'lucide-react';

interface CampaignsProps {
  campaigns: Campaign[];
  onStartDialing?: () => void;
}

// Detailed Lead Interface (Restored)
interface DetailedLead {
  id: string; // S.No 5 Lead ID
  title: string; // S.No 1
  firstName: string; // S.No 2
  lastName: string; // S.No 3
  email: string; // S.No 4
  mobile: string; // S.No 6
  pinCode: string; // S.No 7
  source: string; // S.No 8
  stage: number; // S.No 9
  leadDateTime: string; // S.No 10
  customerType: string; // S.No 11
  disposition: string; // S.No 12
  subDisposition: string; // S.No 13
  remarks: string; // S.No 14
  callBack: boolean; // S.No 15
  preferredDate?: string; // S.No 16
  preferredTime?: string; // S.No 17
  manualDialling?: boolean; // S.No 18
  manualDialNumber?: string; // S.No 19
  offerSMS?: boolean; // S.No 24
  smsTrigger?: string; // S.No 25
  interactionSummary?: string; // S.No 26
  investmentAmount?: string; // S.No 27
  investmentLink?: string; // S.No 28
  followUpPush?: boolean; // S.No 29
  customerRelationship?: boolean; // S.No 30 (ETB/NTB)
  customerPulse?: string; // S.No 31
  urnNumber?: string; // S.No 32
  transactionID?: string; // S.No 33
  subStage?: string; // S.No 34
  existingFDValue?: string; // S.No 34
  conferenceCall?: string; // S.No 35
  redial?: string; // S.No 36
  journeyVersion?: string; // S.No 37
}

// Mock Leads Data (Restored)
const mockDetailedLeads: DetailedLead[] = [
    { 
      id: 'LD-2023-889', title: 'Mr', firstName: 'Amit', lastName: 'Sharma', email: 'amit.s@example.com',
      mobile: '9876543210', pinCode: '400053', source: 'Google Ads', stage: 2, 
      leadDateTime: '2023-10-25 14:30:00', customerType: 'Retail', 
      disposition: 'Customer Busy', subDisposition: 'Asked to call back', remarks: 'Busy in meeting, call after 5 PM',
      callBack: true, preferredDate: '2023-10-26', preferredTime: '17:00',
      investmentAmount: '5,00,000', customerRelationship: true, existingFDValue: '1,20,000',
      interactionSummary: 'Customer showed interest in FD rates during previous web session.',
      journeyVersion: 'v2.1'
    },
    { 
      id: 'LD-2023-992', title: 'Mrs', firstName: 'Sneha', lastName: 'Gupta', email: 'sneha.g@example.com',
      mobile: '9988776655', pinCode: '110001', source: 'Facebook', stage: 1, 
      leadDateTime: '2023-10-26 09:15:00', customerType: 'HNI', 
      disposition: 'Connected', subDisposition: 'Not Interested', remarks: 'Looking for short term only',
      callBack: false, 
      investmentAmount: '25,00,000', customerRelationship: false, existingFDValue: '0',
      interactionSummary: 'First time interaction.',
      journeyVersion: 'v2.1'
    },
    { 
      id: 'LD-2023-105', title: 'Dr', firstName: 'Rohan', lastName: 'Mehta', email: 'dr.rohan@example.com',
      mobile: '8877665544', pinCode: '560001', source: 'Website Organic', stage: 3, 
      leadDateTime: '2023-10-24 18:45:00', customerType: 'Retail', 
      disposition: 'Promise to Pay', subDisposition: 'Online Transfer', remarks: 'Will transfer by evening',
      callBack: true, preferredDate: '2023-10-27', preferredTime: '10:00',
      investmentAmount: '10,00,000', customerRelationship: true, existingFDValue: '5,00,000',
      interactionSummary: 'Long time customer, high trust score.',
      journeyVersion: 'v2.0'
    },
];

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, onStartDialing }) => {
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<DetailedLead | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Filter only Agents from the system users
  const availableAgents = mockUsers.filter(u => u.role === 'Agent');

  const getProgressColor = (percent: number) => {
    if (percent < 30) return 'bg-red-500';
    if (percent < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleViewLeads = (campaign: Campaign) => {
      setSelectedCampaign(campaign);
      setShowLeadsModal(true);
  };

  const handleOpenAssign = (campaign: Campaign) => {
      setSelectedCampaign(campaign);
      setSelectedAgents([]); // Reset selection
      setShowAssignModal(true);
  };

  const toggleAgentSelection = (agentId: string) => {
      if (selectedAgents.includes(agentId)) {
          setSelectedAgents(selectedAgents.filter(id => id !== agentId));
      } else {
          setSelectedAgents([...selectedAgents, agentId]);
      }
  };

  const handleLaunchCampaign = () => {
      if (selectedAgents.length === 0) {
          alert("Please select at least one executive to assign.");
          return;
      }
      alert(`Campaign "${selectedCampaign?.name}" successfully assigned to ${selectedAgents.length} executives. Status set to Running.`);
      setShowAssignModal(false);
      // In a real app, this would update the backend state
  };

  // Helper to display safe values
  const displayValue = (val: any) => val ? val.toString() : '--';

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto custom-scroll p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
            <p className="text-sm text-gray-500 mt-1">Upload data, assign executives, and monitor campaign performance.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-white border border-nbfc-600 text-nbfc-600 hover:bg-nbfc-50 px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-bold flex items-center gap-2"
            >
                <Upload size={16} /> Upload Leads
            </button>
            <button className="bg-nbfc-600 hover:bg-nbfc-800 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium flex items-center gap-2">
                <Download size={16} /> Templates
            </button>
        </div>
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
                            View Data
                        </button>
                        <button 
                            onClick={() => handleOpenAssign(campaign)}
                            className="flex-1 py-2 bg-nbfc-600 text-white rounded text-sm font-medium hover:bg-nbfc-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <UserPlus size={16} /> Assign & Launch
                        </button>
                    </div>
                </div>
            );
        })}
      </div>

      {/* ASSIGNMENT MODAL */}
      {showAssignModal && selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                  <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="font-bold text-gray-900 text-lg">Assign Executives</h2>
                          <p className="text-sm text-gray-500">Select agents for <strong>{selectedCampaign.name}</strong></p>
                      </div>
                      <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full border border-gray-200">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-0 max-h-[60vh] overflow-y-auto custom-scroll">
                      {availableAgents.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                              {availableAgents.map(agent => (
                                  <div 
                                    key={agent.id} 
                                    onClick={() => toggleAgentSelection(agent.id)}
                                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedAgents.includes(agent.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedAgents.includes(agent.id) ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                                              {agent.name.charAt(0)}
                                          </div>
                                          <div>
                                              <p className={`text-sm font-semibold ${selectedAgents.includes(agent.id) ? 'text-blue-900' : 'text-gray-900'}`}>{agent.name}</p>
                                              <p className="text-xs text-gray-500">{agent.id} • <span className={agent.status === 'Active' ? 'text-green-600' : 'text-gray-400'}>{agent.status}</span></p>
                                          </div>
                                      </div>
                                      <div className="text-nbfc-600">
                                          {selectedAgents.includes(agent.id) ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-300"/>}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="p-8 text-center text-gray-500">
                              <p>No agents found in the system.</p>
                          </div>
                      )}
                  </div>

                  <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                          <strong>{selectedAgents.length}</strong> executives selected
                      </div>
                      <div className="flex gap-3">
                          <button 
                            onClick={() => setShowAssignModal(false)}
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                          >
                              Cancel
                          </button>
                          <button 
                            onClick={handleLaunchCampaign}
                            disabled={selectedAgents.length === 0}
                            className={`px-6 py-2 rounded-lg shadow-sm text-sm font-bold flex items-center gap-2 ${selectedAgents.length === 0 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-nbfc-600 text-white hover:bg-nbfc-700'}`}
                          >
                              <Play size={16} fill="currentColor"/> Start Campaign
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Upload size={20} className="text-nbfc-600"/> Upload Campaign Data</h2>
                          <p className="text-sm text-gray-500">Supported formats: CSV, XLSX</p>
                      </div>
                      <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full border border-gray-200">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-8">
                       <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer group">
                           <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                               <FileSpreadsheet size={32} className="text-nbfc-500" />
                           </div>
                           <p className="text-gray-900 font-medium mb-1">Click to upload or drag and drop</p>
                           <p className="text-xs text-gray-500">Maximum file size 50MB</p>
                       </div>

                       <div className="mt-6">
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Required Fields Schema</h4>
                           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-40 overflow-y-auto custom-scroll grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Title</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>First Name</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Last Name</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Email ID</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Lead ID</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Mobile No</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Source</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Stage</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Disposition</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Sub Disposition</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Call back</div>
                               <div className="flex items-center gap-1.5"><div className="w-1 h-1 bg-gray-400 rounded-full"></div>Investment Amt</div>
                               {/* ... and 25 more fields */}
                               <div className="col-span-2 text-gray-400 italic">+ 25 more columns matching specification</div>
                           </div>
                       </div>
                  </div>

                  <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                      <button 
                        onClick={() => setShowUploadModal(false)}
                        className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={() => { alert('Upload simulated successfully!'); setShowUploadModal(false); }}
                        className="px-6 py-2 bg-nbfc-600 text-white rounded-lg shadow-sm hover:bg-nbfc-700 text-sm font-bold"
                      >
                          Process File
                      </button>
                  </div>
               </div>
          </div>
      )}

      {/* VIEW LEADS MODAL */}
      {showLeadsModal && selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="font-bold text-gray-900 text-lg">Campaign Data: {selectedCampaign.name}</h2>
                          <div className="flex gap-4 mt-1 text-sm text-gray-500">
                             <span>Total: <strong>{mockDetailedLeads.length}</strong></span>
                             <span>Pending: <strong>1</strong></span>
                             <span>Contacted: <strong>2</strong></span>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-nbfc-600 text-sm font-bold hover:underline">Export Data</button>
                        <button onClick={() => setShowLeadsModal(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-white border border-gray-200 rounded-full">
                            <X size={20} />
                        </button>
                      </div>
                  </div>
                  
                  {/* Table Container with Horizontal Scroll */}
                  <div className="flex-1 overflow-auto custom-scroll">
                      <table className="w-full text-left border-collapse min-w-[1200px]">
                          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase sticky top-0 z-10 shadow-sm">
                              <tr>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Lead ID</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Customer Name</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Mobile</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Stage</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Source</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Disposition</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Next Action</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50">Investment</th>
                                  <th className="px-4 py-3 border-b border-gray-200 whitespace-nowrap bg-gray-50 text-center">Relationship</th>
                                  <th className="px-4 py-3 border-b border-gray-200 text-right bg-gray-50 sticky right-0 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.1)]">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {mockDetailedLeads.map((lead) => (
                                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-4 py-3 font-mono text-gray-600 text-xs">{lead.id}</td>
                                      <td className="px-4 py-3 font-bold text-gray-900">
                                          {lead.title} {lead.firstName} {lead.lastName}
                                          <div className="text-xs text-gray-400 font-normal">{lead.customerType}</div>
                                      </td>
                                      <td className="px-4 py-3 text-gray-600 font-mono">{lead.mobile}</td>
                                      <td className="px-4 py-3">
                                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold border border-gray-200">
                                              Stage {lead.stage}
                                          </span>
                                      </td>
                                      <td className="px-4 py-3 text-gray-600">{lead.source}</td>
                                      <td className="px-4 py-3">
                                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                              lead.disposition.includes('Busy') ? 'bg-red-50 text-red-700' :
                                              lead.disposition.includes('Pay') ? 'bg-green-50 text-green-700' : 
                                              'bg-blue-50 text-blue-700'
                                          }`}>
                                              {lead.disposition}
                                          </span>
                                          <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[120px]" title={lead.subDisposition}>{lead.subDisposition}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                          {lead.callBack ? (
                                              <div className="flex items-center gap-1 text-orange-600 text-xs font-medium">
                                                  <Calendar size={12}/> {lead.preferredDate}
                                                  <Clock size={12} className="ml-1"/> {lead.preferredTime}
                                              </div>
                                          ) : <span className="text-gray-400 text-xs">No Callback</span>}
                                      </td>
                                      <td className="px-4 py-3 font-mono">
                                          {lead.investmentAmount ? `₹${lead.investmentAmount}` : '--'}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                          {lead.customerRelationship ? 
                                            <span className="text-green-600 text-xs font-bold bg-green-50 px-1 rounded">ETB</span> : 
                                            <span className="text-purple-600 text-xs font-bold bg-purple-50 px-1 rounded">NTB</span>
                                          }
                                      </td>
                                      <td className="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-gray-50 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.1)]">
                                          <div className="flex justify-end gap-2">
                                              <button 
                                                onClick={() => setShowDetailModal(lead)}
                                                className="text-gray-500 hover:text-nbfc-600 hover:bg-nbfc-50 p-1.5 rounded transition-colors" 
                                                title="View Full Details"
                                              >
                                                  <Eye size={16} />
                                              </button>
                                              <button 
                                                className="text-gray-400 cursor-not-allowed bg-gray-100 p-1.5 rounded shadow-sm" 
                                                title="Manager cannot call directly"
                                                disabled
                                              >
                                                  <PhoneOutgoing size={16} />
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 text-right flex justify-between items-center">
                      <span className="text-xs text-gray-500">Showing 1-3 of 3 records</span>
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

      {/* LEAD DETAIL DRAWER (For full 37 fields view) */}
      {showDetailModal && (
          <div className="fixed inset-0 z-[60] flex justify-end bg-black/20 backdrop-blur-[1px]">
              <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="p-5 border-b border-gray-200 bg-nbfc-50 flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-gray-900">Lead Details</h3>
                          <p className="text-xs text-gray-500">{showDetailModal.id}</p>
                      </div>
                      <button onClick={() => setShowDetailModal(null)} className="text-gray-500 hover:text-gray-800 bg-white rounded-full p-1 border border-gray-200">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">
                      
                      {/* Section 1: Identity */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Users size={14}/> Identity & Contact
                          </h4>
                          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                              <div><span className="block text-xs text-gray-500">Full Name</span> <span className="font-medium">{showDetailModal.title} {showDetailModal.firstName} {showDetailModal.lastName}</span></div>
                              <div><span className="block text-xs text-gray-500">Mobile</span> <span className="font-medium">{showDetailModal.mobile}</span></div>
                              <div><span className="block text-xs text-gray-500">Email</span> <span className="break-all">{showDetailModal.email}</span></div>
                              <div><span className="block text-xs text-gray-500">PIN Code</span> {showDetailModal.pinCode}</div>
                              <div><span className="block text-xs text-gray-500">Source</span> {showDetailModal.source}</div>
                              <div><span className="block text-xs text-gray-500">Type</span> {showDetailModal.customerType}</div>
                          </div>
                      </div>

                      {/* Section 2: Status & Disposition */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Target size={14}/> Current Status
                          </h4>
                          <div className="space-y-3 text-sm">
                               <div className="flex justify-between">
                                   <span className="text-gray-500">Stage</span>
                                   <span className="font-bold">Level {showDetailModal.stage}</span>
                               </div>
                               <div className="flex justify-between">
                                   <span className="text-gray-500">Disposition</span>
                                   <span className="font-bold text-nbfc-700">{showDetailModal.disposition}</span>
                               </div>
                               <div className="flex justify-between">
                                   <span className="text-gray-500">Sub Disposition</span>
                                   <span className="font-medium">{showDetailModal.subDisposition}</span>
                               </div>
                               <div className="pt-2 border-t border-gray-200">
                                   <span className="block text-xs text-gray-500 mb-1">Remarks</span>
                                   <p className="text-gray-800 italic bg-white p-2 rounded border border-gray-100">{showDetailModal.remarks}</p>
                               </div>
                          </div>
                      </div>

                      {/* Section 3: Financials & Interactions */}
                      <div>
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <DollarSign size={14}/> Financials & Insights
                          </h4>
                          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                              <div><span className="block text-xs text-gray-500">Inv. Amount</span> ₹{displayValue(showDetailModal.investmentAmount)}</div>
                              <div><span className="block text-xs text-gray-500">Existing FD</span> ₹{displayValue(showDetailModal.existingFDValue)}</div>
                              <div><span className="block text-xs text-gray-500">Journey Ver.</span> {displayValue(showDetailModal.journeyVersion)}</div>
                              <div><span className="block text-xs text-gray-500">Pulse</span> {displayValue(showDetailModal.customerPulse)}</div>
                          </div>
                          
                          <div className="mt-4">
                               <span className="block text-xs text-gray-500 mb-1">Interaction Summary</span>
                               <p className="text-xs text-gray-700 leading-relaxed bg-blue-50 p-3 rounded border border-blue-100">
                                   {displayValue(showDetailModal.interactionSummary)}
                               </p>
                          </div>
                      </div>
                      
                      {/* Section 4: System Fields */}
                      <div className="opacity-70">
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System Metadata</h4>
                           <div className="text-xs text-gray-500 font-mono space-y-1">
                               <p>Lead Date: {showDetailModal.leadDateTime}</p>
                               <p>URN: {displayValue(showDetailModal.urnNumber)}</p>
                               <p>Trans ID: {displayValue(showDetailModal.transactionID)}</p>
                           </div>
                      </div>

                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                       <button 
                        className="flex-1 py-2 bg-gray-300 text-gray-500 rounded font-bold shadow-sm cursor-not-allowed" 
                        disabled
                       >
                           Dialing Disabled (Admin)
                       </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Campaigns;
