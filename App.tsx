
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, User, PhoneIncoming, LogOut, ChevronDown, UserPlus, Phone, PhoneOff, Mic, MicOff, Pause, Play, ClipboardList } from 'lucide-react';
import { NAVIGATION_ITEMS, MOCK_NOTIFICATIONS } from './constants';
import { mockCustomer, mockNTBCustomer, mockLoans, mockInvestments, mockInteractions, mockNTBInteractions, mockTickets, mockCampaigns, mockAuditLogs, mockUsers } from './services/mockData';
import Dashboard from './components/Dashboard';
import Customer360 from './components/Customer360';
import Dialer from './components/Dialer';
import ServiceRequests from './components/ServiceRequests';
import Campaigns from './components/Campaigns';
import Reports from './components/Reports';
import Admin from './components/Admin';

// Define the core views
type View = 'dashboard' | 'customer360' | 'tickets' | 'campaigns' | 'reports' | 'admin';
type Role = 'Manager' | 'Agent';
type AgentStatus = 'Ready' | 'Busy' | 'Break' | 'Offline';
type CallStage = 'talking' | 'disposition';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Customer State
  const [activeCustomer, setActiveCustomer] = useState(mockCustomer);
  const [isNTB, setIsNTB] = useState(false);
  
  // User & Role State
  const [userRole, setUserRole] = useState<Role>('Manager');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('Ready');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  // Call State (Lifted)
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStage, setCallStage] = useState<CallStage>('talking');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [isNewLeadCall, setIsNewLeadCall] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Filter Navigation based on Role
  const navItems = userRole === 'Agent' 
    ? NAVIGATION_ITEMS.filter(item => ['dashboard', 'customer360', 'tickets'].includes(item.id))
    : NAVIGATION_ITEMS;

  useEffect(() => {
    setActiveView('dashboard');
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
            setIsStatusDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isCallActive && !isOnHold && callStage === 'talking') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, isOnHold, callStage]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulateCall = () => {
    setIsNewLeadCall(false);
    if (userRole === 'Agent' && agentStatus === 'Ready') {
        acceptCall(false);
    } else {
        setShowIncomingModal(true);
    }
  };

  const handleSimulateNewLead = () => {
    setIsNewLeadCall(true);
    if (userRole === 'Agent' && agentStatus === 'Ready') {
        acceptCall(true);
    } else {
        setShowIncomingModal(true);
    }
  };

  const acceptCall = (isNewLead: boolean = false) => {
    setShowIncomingModal(false);
    setIsCallActive(true);
    setCallStage('talking');
    setCallDuration(0);
    setAgentStatus('Busy');
    
    // Set Customer Context based on call type
    if (isNewLead) {
        setActiveCustomer(mockNTBCustomer);
        setIsNTB(true);
    } else {
        setActiveCustomer(mockCustomer);
        setIsNTB(false);
    }
    
    // ALWAYS route to Customer 360, but props will differ
    setActiveView('customer360');
  };

  const handleHeaderEndCall = () => {
      setCallStage('disposition');
  };

  const handleCompleteInteraction = () => {
    setIsCallActive(false);
    setCallDuration(0);
    setAgentStatus('Ready');
    // Reset to default for demo purposes after call
    setIsNTB(false); 
    setActiveCustomer(mockCustomer); 
  };

  const handleStartDialing = () => {
    setIsCallActive(true);
    setCallStage('talking');
    setCallDuration(0);
    setAgentStatus('Busy');
    setIsNTB(false);
    setActiveCustomer(mockCustomer);
    setActiveView('customer360');
  };

  const handleStatusChange = (status: AgentStatus) => {
      setAgentStatus(status);
      setIsStatusDropdownOpen(false);
  };

  const toggleStatusDropdown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsStatusDropdownOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-nbfc-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20`}>
        <div className="p-4 flex items-center gap-3 border-b border-nbfc-800">
           <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shrink-0">FC</div>
           {isSidebarOpen && <span className="font-bold text-lg tracking-tight">FinConnect</span>}
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-nbfc-600 text-white shadow-lg' : 'text-nbfc-100 hover:bg-nbfc-800'}`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} className="shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-nbfc-800 bg-nbfc-950">
           <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-nbfc-900 font-bold shrink-0 ${userRole === 'Manager' ? 'bg-yellow-400' : 'bg-green-400'}`}>
                  {userRole === 'Manager' ? 'M' : 'A'}
              </div>
              {isSidebarOpen && (
                  <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{userRole === 'Manager' ? 'Manager John' : 'Agent Smith'}</p>
                      <p className="text-xs text-nbfc-300">{userRole}</p>
                  </div>
              )}
           </div>
           
           {isSidebarOpen && (
               <button 
                onClick={() => setUserRole(prev => prev === 'Manager' ? 'Agent' : 'Manager')}
                className="w-full py-1.5 text-xs bg-nbfc-800 hover:bg-nbfc-700 text-nbfc-100 rounded flex items-center justify-center gap-2 transition-colors border border-nbfc-700"
               >
                   <LogOut size={12}/> Switch Role (Demo)
               </button>
           )}
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10">
           
           {/* Left Section: Search or Active Call Control */}
           <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded text-gray-500">
                 <Menu size={20} />
              </button>
              
              {isCallActive && callStage === 'talking' ? (
                // --- ACTIVE CALL CONTROL BAR ---
                <div className="flex items-center gap-6 bg-green-50 border border-green-200 rounded-lg px-4 py-1.5 animate-in slide-in-from-top-2 w-full max-w-2xl">
                    <div className="flex items-center gap-3 border-r border-green-200 pr-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="font-mono font-bold text-green-800 text-lg">{formatDuration(callDuration)}</span>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-xs text-green-600 font-bold uppercase">Connected To</span>
                        <span className="text-sm font-bold text-gray-900">{activeCustomer.fullName}</span>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-red-100 text-red-600' : 'hover:bg-green-100 text-gray-600'}`}
                            title="Mute"
                        >
                            {isMuted ? <MicOff size={18}/> : <Mic size={18}/>}
                        </button>
                        <button 
                            onClick={() => setIsOnHold(!isOnHold)}
                            className={`p-2 rounded-full transition-colors ${isOnHold ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-green-100 text-gray-600'}`}
                            title="Hold"
                        >
                            {isOnHold ? <Play size={18}/> : <Pause size={18}/>}
                        </button>
                        <button 
                            onClick={handleHeaderEndCall}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm"
                        >
                            <PhoneOff size={16}/> End Call
                        </button>
                    </div>
                </div>
              ) : (
                // --- DEFAULT SEARCH ---
                <div className="relative hidden md:block w-96">
                   <input 
                      type="text" 
                      placeholder="Search Customer (ID, Mobile, PAN)..." 
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                   />
                   <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              )}
           </div>

           {/* Right Section: Status & Notifications */}
           <div className="flex items-center gap-4">
               {/* Status Toggle */}
               <div className="relative" ref={statusDropdownRef}>
                   <button 
                        onClick={toggleStatusDropdown}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all active:scale-95 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-nbfc-200 ${
                            agentStatus === 'Ready' ? 'bg-green-50 border-green-200 text-green-700' : 
                            agentStatus === 'Busy' ? 'bg-red-50 border-red-200 text-red-700' : 
                            'bg-gray-100 border-gray-200 text-gray-600'
                        }`}
                   >
                       <div className={`w-2.5 h-2.5 rounded-full ${
                            agentStatus === 'Ready' ? 'bg-green-500' : 
                            agentStatus === 'Busy' ? 'bg-red-500' : 'bg-gray-400'
                       }`}></div>
                       <span className="text-xs font-bold uppercase tracking-wide min-w-[3rem] text-left">{agentStatus}</span>
                       <ChevronDown size={14} className={`transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {isStatusDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            {['Ready', 'Busy', 'Break', 'Offline'].map((status) => (
                                <button 
                                        key={status}
                                        onClick={() => handleStatusChange(status as AgentStatus)}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-3 transition-colors"
                                >
                                    <div className={`w-2 h-2 rounded-full ${
                                        status === 'Ready' ? 'bg-green-500' : 
                                        status === 'Busy' ? 'bg-red-500' : 
                                        status === 'Break' ? 'bg-yellow-400' : 'bg-gray-300'
                                    }`}></div>
                                    <span className="font-medium">{status}</span>
                                </button>
                            ))}
                        </div>
                   )}
               </div>
               
               <div className="h-6 w-px bg-gray-300 mx-2"></div>

               <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
               </button>
           </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-hidden relative">
            {activeView === 'dashboard' && (
                <Dashboard 
                    userRole={userRole}
                    stats={{
                        totalCalls: 124,
                        avgHandleTime: '04:32',
                        csatScore: 4.2,
                        conversionRate: 18.5
                    }}
                />
            )}
            {activeView === 'customer360' && (
                <Customer360 
                    isNTB={isNTB}
                    customer={activeCustomer}
                    loans={isNTB ? [] : mockLoans}
                    investments={isNTB ? [] : mockInvestments}
                    interactions={isNTB ? mockNTBInteractions : mockInteractions}
                    tickets={mockTickets}
                />
            )}
            {activeView === 'tickets' && (
                <ServiceRequests tickets={mockTickets} />
            )}
            {activeView === 'campaigns' && (
                <Campaigns campaigns={mockCampaigns} onStartDialing={handleStartDialing} />
            )}
            {activeView === 'reports' && (
                <Reports />
            )}
            {activeView === 'admin' && (
                <Admin auditLogs={mockAuditLogs} users={mockUsers} />
            )}
        </main>
      </div>

      {/* Components Overlay */}
      <Dialer 
        onSimulateIncoming={handleSimulateCall}
        onSimulateNewLead={handleSimulateNewLead} 
        onEndCall={handleCompleteInteraction}
        isCallActive={isCallActive}
        callStage={callStage}
        activeCustomerName={activeCustomer.fullName}
        // Controlled Props
        callDuration={callDuration}
        isMuted={isMuted}
        isOnHold={isOnHold}
        isHidden={isCallActive && callStage === 'talking'}
      />

      {/* Screen Pop Modal Simulation */}
      {showIncomingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center animate-pulse">
             <div className="bg-white rounded-lg shadow-2xl p-6 w-80 text-center">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isNewLeadCall ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                     {isNewLeadCall ? <UserPlus size={32} /> : <PhoneIncoming size={32} />}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-1">Incoming Call</h3>
                 <p className="text-gray-600 mb-4">{isNewLeadCall ? '+91-99887-XXXXX' : '+91-98765-43210'}</p>
                 <div className={`text-sm p-2 rounded mb-6 border ${isNewLeadCall ? 'bg-purple-50 text-purple-800 border-purple-100' : 'bg-yellow-50 text-yellow-800 border-yellow-100'}`}>
                    {isNewLeadCall ? (
                        <><strong>New Lead</strong> - No records found.</>
                    ) : (
                        <>CRM Match: <strong>{activeCustomer.fullName}</strong></>
                    )}
                 </div>
                 <div className="flex gap-3">
                     <button 
                        onClick={() => setShowIncomingModal(false)}
                        className="flex-1 py-2 bg-red-100 text-red-700 font-semibold rounded hover:bg-red-200"
                     >
                        Reject
                     </button>
                     <button 
                        onClick={() => acceptCall(isNewLeadCall)}
                        className="flex-1 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 shadow-lg"
                     >
                        Accept
                     </button>
                 </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default App;
