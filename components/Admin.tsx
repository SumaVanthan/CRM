
import React, { useState } from 'react';
import { AuditLog, SystemUser } from '../types';
import { Shield, Users, Lock, Search, MoreVertical, Database, FileText } from 'lucide-react';

interface AdminProps {
  auditLogs: AuditLog[];
  users: SystemUser[];
}

const Admin: React.FC<AdminProps> = ({ auditLogs, users }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'config'>('users');

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-sm text-gray-500 mt-1">System configuration, user management, and security audits.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
        <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
            <Users size={16}/> User Management
        </button>
        <button 
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'audit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
            <Shield size={16}/> Audit Logs
        </button>
        <button 
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'config' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
            <Database size={16}/> System Config
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative">
                        <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-nbfc-500 w-64"/>
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                    <button className="bg-nbfc-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-nbfc-700">
                        Add User
                    </button>
                </div>
                <div className="overflow-auto custom-scroll flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Login</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'audit' && (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Lock size={16} className="text-gray-500"/>
                        Security & Access Logs (RBAC Enforced)
                    </h3>
                </div>
                <div className="overflow-auto custom-scroll flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Module</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono text-sm">
                            {auditLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-gray-500">{log.timestamp}</td>
                                    <td className="px-6 py-3 font-medium text-nbfc-700">{log.user}</td>
                                    <td className="px-6 py-3 text-gray-600">{log.module}</td>
                                    <td className="px-6 py-3 text-purple-600 font-medium">{log.action}</td>
                                    <td className="px-6 py-3 text-gray-600 truncate max-w-xs" title={log.details}>{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* SYSTEM CONFIG TAB */}
        {activeTab === 'config' && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Database size={18}/> Data Retention</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-600">Call Recordings</label>
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"><option>12 Months</option><option>24 Months</option></select>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm text-gray-600">Audit Logs</label>
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"><option>5 Years</option></select>
                        </div>
                    </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                     <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18}/> Compliance</h3>
                     <div className="flex items-center gap-3 mb-3">
                        <input type="checkbox" checked readOnly className="h-4 w-4 text-nbfc-600 rounded"/>
                        <span className="text-sm text-gray-700">Enforce Masking by Default (PII)</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <input type="checkbox" checked readOnly className="h-4 w-4 text-nbfc-600 rounded"/>
                        <span className="text-sm text-gray-700">Require MFA for Remote Access</span>
                     </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
