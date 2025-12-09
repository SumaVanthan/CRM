
import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, ChevronRight } from 'lucide-react';

const REPORT_TYPES = [
  { id: 'call_logs', label: 'Call Detail Records (CDR)', category: 'Telephony' },
  { id: 'agent_perf', label: 'Agent Performance', category: 'Performance' },
  { id: 'campaign_roi', label: 'Campaign ROI Analysis', category: 'Sales' },
  { id: 'ticket_summary', label: 'Ticket Resolution Summary', category: 'Service' },
  { id: 'audit_trail', label: 'System Audit Logs', category: 'Compliance' },
];

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0]);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
         <div className="p-5 border-b border-gray-200">
            <h2 className="font-bold text-gray-800 text-lg">Reports Center</h2>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {REPORT_TYPES.map(report => (
                <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition-colors ${selectedReport.id === report.id ? 'bg-nbfc-50 text-nbfc-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <span>{report.label}</span>
                    {selectedReport.id === report.id && <ChevronRight size={16} />}
                </button>
            ))}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedReport.label}</h2>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded border border-gray-200">{selectedReport.category}</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                    <Calendar size={16} /> Last 30 Days
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                    <Filter size={16} /> Filters
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-nbfc-600 text-white rounded text-sm hover:bg-nbfc-700 shadow-sm">
                    <Download size={16} /> Export CSV
                </button>
            </div>
        </div>

        {/* Data Area Placeholder */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px]">
                {/* Mock Table Header */}
                <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-semibold text-xs text-gray-500 uppercase">
                    <div>Date</div>
                    <div>Agent</div>
                    <div>Customer</div>
                    <div>Duration/Status</div>
                    <div>Outcome</div>
                </div>
                {/* Mock Table Rows */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50">
                        <div>2023-10-{30-i} 10:30 AM</div>
                        <div className="font-medium">Sarah Jenkins</div>
                        <div>Rajesh Kumar</div>
                        <div>
                            {selectedReport.id.includes('call') ? '04:32' : 'Resolved'}
                        </div>
                        <div>
                            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs border border-green-100">Success</span>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Displaying top 8 records. Export to view full dataset.</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
