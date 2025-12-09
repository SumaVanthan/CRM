
import React, { useState } from 'react';
import { Ticket } from '../types';
import { Plus, Filter, AlertCircle, Clock, CheckCircle, Search } from 'lucide-react';

interface ServiceRequestsProps {
  tickets: Ticket[];
}

const ServiceRequests: React.FC<ServiceRequestsProps> = ({ tickets }) => {
  const [filter, setFilter] = useState('All');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle size={16} className="text-green-500" />;
      case 'Closed': return <CheckCircle size={16} className="text-gray-400" />;
      case 'In Progress': return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-orange-500" />;
    }
  };

  const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer queries, complaints, and service tickets.</p>
        </div>
        <button className="bg-nbfc-600 hover:bg-nbfc-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6 p-6 pb-2">
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm font-medium">Open Tickets</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{tickets.filter(t => t.status === 'Open').length}</div>
         </div>
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm font-medium">SLA Breached</div>
            <div className="text-2xl font-bold text-red-600 mt-1">2</div>
         </div>
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm font-medium">Critical Priority</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{tickets.filter(t => t.priority === 'Critical').length}</div>
         </div>
         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 text-sm font-medium">Resolved Today</div>
            <div className="text-2xl font-bold text-green-600 mt-1">5</div>
         </div>
      </div>

      {/* Filter Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filter === status ? 'bg-nbfc-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                    {status}
                </button>
            ))}
        </div>
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search tickets..." 
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-nbfc-500 w-64"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full overflow-y-auto custom-scroll">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4 border-b border-gray-200">Ticket ID</th>
                        <th className="px-6 py-4 border-b border-gray-200">Subject</th>
                        <th className="px-6 py-4 border-b border-gray-200">Type</th>
                        <th className="px-6 py-4 border-b border-gray-200">Priority</th>
                        <th className="px-6 py-4 border-b border-gray-200">Status</th>
                        <th className="px-6 py-4 border-b border-gray-200">Assigned To</th>
                        <th className="px-6 py-4 border-b border-gray-200">Created</th>
                        <th className="px-6 py-4 border-b border-gray-200 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredTickets.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{ticket.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ticket.subject}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{ticket.type}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    {getStatusIcon(ticket.status)}
                                    {ticket.status}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo || 'Unassigned'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{ticket.createdDate}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-sm text-gray-400 hover:text-nbfc-600 font-medium">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredTickets.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Filter size={48} className="mb-2 opacity-20" />
                    <p>No tickets found matching current filters.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequests;
