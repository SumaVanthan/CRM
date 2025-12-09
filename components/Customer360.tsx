
import React, { useState, useEffect, useRef } from 'react';
import { Customer, Loan, Investment, Interaction, Ticket, LoanType, ProductRelationship, Offer, CommunicationTemplate, AnswerOption } from '../types';
import { mockActiveProducts, mockPastProducts, mockOffers, mockTemplates } from '../services/mockData';
import { AIDecisionEngine } from '../services/aiDecisionEngine';
import PrivacyText from './PrivacyText';
import { CreditCard, Wallet, Clock, FileText, AlertTriangle, CheckCircle, Smartphone, Mail, MapPin, IndianRupee, Play, Send, MessageSquare, Zap, Target, Lightbulb, History, Briefcase, Phone, Monitor, Bell, X, ChevronRight, TrendingUp, ShieldCheck, Bot, UserPlus } from 'lucide-react';

interface Customer360Props {
  customer: Customer;
  loans: Loan[];
  investments: Investment[];
  interactions: Interaction[];
  tickets: Ticket[];
  isNTB?: boolean; // New Flag for NTB Mode
}

const Customer360: React.FC<Customer360Props> = ({ customer, loans, investments, interactions, tickets, isNTB = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'investments' | 'history' | 'sales_coach'>('overview');
  
  // Initialize AI Engine for Sales Coach
  const engineRef = useRef<AIDecisionEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new AIDecisionEngine();
  }
  const engine = engineRef.current;
  const [currentQuestion, setCurrentQuestion] = useState(engine.getCurrentQuestion());
  const [aiState, setAiState] = useState(engine.getState());

  // NTB Logic: Default to Sales Coach if it's a new lead
  useEffect(() => {
    if (isNTB) {
        setActiveTab('sales_coach');
    } else {
        setActiveTab('overview');
    }
  }, [isNTB]);

  // Communication Modal State
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [messagePreview, setMessagePreview] = useState('');

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const tmpl = mockTemplates.find(t => t.id === e.target.value);
      if (tmpl) {
          setSelectedTemplate(tmpl);
          // Auto-fill mock params
          let content = tmpl.content.replace('{name}', customer.fullName.split(' ')[0]);
          content = content.replace('{emi_amount}', '14,500').replace('{due_date}', '05 Nov');
          content = content.replace('{amount}', '2,00,000').replace('{link}', 'fin.co/x7z9');
          setMessagePreview(content);
      } else {
          setSelectedTemplate(null);
          setMessagePreview('');
      }
  };

  const handleSendMessage = () => {
      alert(`Message Sent via ${selectedTemplate?.channel}: ${messagePreview}`);
      setIsCommModalOpen(false);
  };

  // AI Engine Handler
  const handleAnswer = (option: AnswerOption) => {
    const newState = engine.processAnswer(option.text);
    setAiState({ ...newState });
    setCurrentQuestion(engine.getCurrentQuestion());
  };

  const getButtonStyles = (intent: string) => {
    switch(intent) {
        case 'positive': return 'bg-green-50 border-green-200 hover:bg-green-100 text-green-800 hover:border-green-300';
        case 'negative': return 'bg-red-50 border-red-200 hover:bg-red-100 text-red-800 hover:border-red-300';
        case 'objection': return 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800 hover:border-amber-300';
        default: return 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      
      {/* 3.2.1 Customer Identity Header */}
      <div className="bg-white p-6 shadow-sm border-b border-gray-200 flex flex-wrap justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-nbfc-100 rounded-full flex items-center justify-center text-nbfc-800 text-2xl font-bold">
            {customer.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{customer.fullName}</h1>
                {isNTB && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded border border-purple-200">New Lead</span>}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1"><span className="text-gray-400">ID:</span> {customer.id}</div>
                <div className="w-px h-4 bg-gray-300"></div>
                {/* For NTB, Risk might be 'Assessing' or just hide if irrelevant */}
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadgeColor(customer.riskCategory)}`}>
                    Risk: {customer.riskCategory}
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-700">CIBIL:</span> {isNTB ? 'N/A' : customer.creditScore}
                </div>
                {!isNTB && (
                    <>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1 text-purple-700 font-medium">
                        <Target size={14}/> Rel. Score: {customer.relationshipScore}/100
                    </div>
                    </>
                )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[200px]">
           <div className="flex gap-2">
               <button 
                onClick={() => setIsCommModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-nbfc-600 text-white rounded-md text-sm font-medium hover:bg-nbfc-700 transition-colors shadow-sm"
               >
                   <Send size={14} /> Send SMS/Email
               </button>
           </div>
           <div className="flex flex-col gap-1 items-end">
                <div className="flex items-center gap-2 text-sm">
                    <PrivacyText type="mobile" text={customer.mobile} />
                    <Smartphone size={14} className="text-gray-400" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <PrivacyText type="email" text={customer.email} />
                    <Mail size={14} className="text-gray-400" />
                </div>
           </div>
        </div>
      </div>

      {/* Alerts & Flags Section (Dynamic) */}
      <div className="bg-gray-50 px-6 pt-4 pb-2">
         <div className="flex flex-wrap gap-3">
             {/* Critical Alerts (Only for ETB) */}
             {!isNTB && loans.some(l => l.dpd > 0) && (
                 <div className="flex items-center gap-2 px-3 py-2 bg-red-100 border border-red-200 text-red-800 rounded-md text-sm font-medium animate-pulse">
                     <AlertTriangle size={16} />
                     <span>Action Required: EMI Overdue by {loans.find(l => l.dpd > 0)?.dpd} Days</span>
                 </div>
             )}
             {/* Info Alerts */}
             {!isNTB ? (
                 <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-md text-sm">
                     <Bell size={16} />
                     <span>Upcoming FD Maturity: 20 Jun 2024</span>
                 </div>
             ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 text-purple-700 rounded-md text-sm">
                     <Bot size={16} />
                     <span>AI Insight: Web Drop-off Detected (FD Page)</span>
                 </div>
             )}
         </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white px-6 border-b border-gray-200">
        <div className="flex space-x-6 overflow-x-auto">
            {[
                { id: 'sales_coach', label: isNTB ? 'Sales Coach (Active)' : 'Sales Coach', icon: Zap }, // NTB Default
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'loans', label: 'Lending', icon: CreditCard },
                { id: 'investments', label: 'Investments', icon: Wallet },
                { id: 'history', label: 'History', icon: History },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-nbfc-600 text-nbfc-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                    {tab.id === 'sales_coach' && (
                        <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold">AI</span>
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scroll">
        
        {/* TAB: SALES COACH (Enhanced with Command Center) */}
        {activeTab === 'sales_coach' && (
            <div className="flex gap-6 h-full">
                {/* Sales Command Center (Left) */}
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Bot size={18} className="text-indigo-600"/> {isNTB ? 'Lead Engagement Script' : 'Cross-Sell Script'}
                        </h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">
                            {isNTB ? 'FD Drop-off Scenario' : 'Top-up Scenario'}
                        </span>
                    </div>

                    <div className="p-8 flex-col flex gap-8">
                         {/* HERO SCRIPT */}
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <MessageSquare size={12}/> Agent Script
                            </div>
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-xl font-medium text-gray-900 leading-relaxed relative">
                                <span className="absolute top-2 left-2 text-6xl text-indigo-200 font-serif -z-10">“</span>
                                {currentQuestion.agentScript}
                            </div>
                        </div>

                        {/* BATTLE STATION */}
                        <div>
                             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Target size={12}/> Customer Response
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options?.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleAnswer(opt)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all shadow-sm active:scale-95 flex flex-col justify-center h-20 ${getButtonStyles(opt.intent)}`}
                                    >
                                        <span className="text-base font-bold">{opt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* COACHING TIP */}
                        {currentQuestion.persuasionTip && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex gap-3">
                                <Lightbulb className="text-amber-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-amber-900 text-sm">Persuasion Logic</h4>
                                    <p className="text-amber-800 text-sm mt-1">{currentQuestion.persuasionTip}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scorecard & Cheat Sheet (Right) */}
                <div className="w-80 flex flex-col gap-6">
                    {/* Scorecard */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Buying Intent</span>
                             <span className={`text-lg font-black ${aiState.scores.intent > 60 ? 'text-green-600' : 'text-amber-500'}`}>{aiState.scores.intent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${aiState.scores.intent > 60 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${aiState.scores.intent}%`}}></div>
                        </div>
                    </div>

                    {/* Product Cheat Sheet (Contextual) */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Zap size={12}/> Product Cheat Sheet
                        </h3>
                        <div className="space-y-3">
                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                 <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase mb-1">
                                     <TrendingUp size={12}/> Best Rate
                                 </div>
                                 <p className="text-xl font-bold text-gray-900">9.40%*</p>
                             </div>
                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                 <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase mb-1">
                                     <ShieldCheck size={12}/> Trust Rating
                                 </div>
                                 <p className="text-sm font-bold text-gray-900">MAA+/Stable</p>
                             </div>
                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                 <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
                                     <IndianRupee size={12}/> Min Investment
                                 </div>
                                 <p className="text-sm font-bold text-gray-900">₹ 5,000</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Col: Profile Details (Moved here) */}
                <div className="lg:col-span-1 space-y-6">
                     {/* Quick Profile Stats */}
                     <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Profile Details</h3>
                         <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">DOB</span> <span>{customer.dob || '--'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">PAN</span> <PrivacyText type="pan" text={customer.pan} /></div>
                            <div className="flex justify-between"><span className="text-gray-500">Segment</span> <span>{customer.segment}</span></div>
                            <div className="pt-2 border-t border-gray-100">
                                 <span className="text-gray-500 block mb-1">Address</span>
                                 <p className="text-gray-800 leading-tight">{customer.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col: Relationship Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Relationship Overview Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Relationship Summary</h3>
                            <span className="text-xs font-medium text-gray-500">{isNTB ? 'Prospect Status' : 'Active & Past Products'}</span>
                        </div>
                        
                        {!isNTB ? (
                        <>
                        {/* Active Products (ETB) */}
                        <div className="p-6 border-b border-gray-100">
                            <h4 className="text-xs font-bold text-green-700 uppercase mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active Relationships
                            </h4>
                            <div className="space-y-4">
                                {mockActiveProducts.map(prod => (
                                    <div key={prod.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${prod.category === 'Loan' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {prod.category === 'Loan' ? <CreditCard size={20}/> : <Wallet size={20}/>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{prod.productName}</p>
                                                <p className="text-xs text-gray-500">{prod.accountNumber}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-sm">₹{prod.amount.toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-gray-500">Balance</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="font-medium text-gray-700 text-sm">{prod.nextActionDate}</p>
                                            <p className="text-xs text-gray-500">Next Action</p>
                                        </div>
                                        <div>
                                            {prod.status === 'Overdue' ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Overdue</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Active</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Past Products (ETB) */}
                        <div className="p-6 bg-gray-50">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div> Past Relationships
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockPastProducts.map(prod => (
                                    <div key={prod.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-75">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-gray-200 text-gray-500 rounded">
                                                {prod.category === 'Loan' ? <CreditCard size={16}/> : <Wallet size={16}/>}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700 text-xs">{prod.productName}</p>
                                                <p className="text-[10px] text-gray-500">{prod.endDate ? `Closed: ${prod.endDate}` : 'Closed'}</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-medium">{prod.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </>
                        ) : (
                            // NTB View
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <UserPlus size={32} className="text-gray-400"/>
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg">No Active Relationships</h3>
                                <p className="text-gray-500 text-sm max-w-md mt-2">
                                    This is a New-to-Bank customer. Use the Sales Coach tab to profile their needs and recommend products.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Opportunities (Offers Only) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Upsell & Cross-Sell Panel */}
                    <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
                        <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 flex items-center justify-between">
                            <h3 className="font-bold text-purple-900 flex items-center gap-2">
                                <Zap size={18} className="text-purple-600"/> Offers & Opportunities
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {isNTB ? (
                                // Generic Offer for NTB
                                <div className="border border-purple-100 rounded-lg p-4 bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded tracking-wide">Acquisition</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">New Customer FD Scheme</h4>
                                    <p className="text-xs text-gray-600 mb-3">High yield 9.40% interest rate for first-time bookers.</p>
                                    <button className="w-full py-1.5 bg-purple-600 text-white rounded text-xs font-bold">Pitch Now</button>
                                </div>
                            ) : (
                                mockOffers.map(offer => (
                                    <div key={offer.id} className="border border-purple-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded tracking-wide">
                                                {offer.type}
                                            </span>
                                            <span className="text-xs font-bold text-green-600">{offer.probability}% Match</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{offer.title}</h4>
                                        <p className="text-xs text-gray-600 mb-3">{offer.description}</p>
                                        
                                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 mb-3 italic">
                                            Why: {offer.reason}
                                        </div>

                                        <button className="w-full py-1.5 bg-purple-600 text-white rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            Pitch Now
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAB: LOANS (Existing) */}
        {activeTab === 'loans' && (
            <div className="space-y-6">
                {loans.length > 0 ? loans.map(loan => (
                    <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><CreditCard size={20}/></div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{loan.type}</h3>
                                    <p className="text-xs text-gray-500">Acc: {loan.accountNumber}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`block text-xs font-bold uppercase ${loan.dpd > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {loan.dpd > 0 ? `Overdue by ${loan.dpd} Days` : 'Standard Asset'}
                                </span>
                                {loan.dpd > 0 && <span className="text-xs text-red-500">Call Outcome: Mandatory</span>}
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-gray-500">Outstanding Principal</p>
                                <p className="text-lg font-bold text-gray-900">₹{loan.outstandingPrincipal.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">EMI Amount</p>
                                <p className="text-lg font-medium text-gray-900">₹{loan.emiAmount.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Next Due Date</p>
                                <p className="text-lg font-medium text-gray-900">{loan.nextEmiDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Interest Rate</p>
                                <p className="text-lg font-medium text-gray-900">{loan.interestRate}%</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center p-12 text-gray-400">
                        <CreditCard size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>No Active Loan Accounts</p>
                    </div>
                )}
            </div>
        )}

        {/* TAB: INVESTMENTS (Existing) */}
        {activeTab === 'investments' && (
            <div className="space-y-6">
                 {investments.length > 0 ? investments.map(inv => (
                    <div key={inv.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-green-100 text-green-700 rounded-full"><IndianRupee size={24}/></div>
                             <div>
                                <h3 className="font-bold text-gray-800">{inv.type}</h3>
                                <p className="text-xs text-gray-500">{inv.accountNumber}</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Current Value</p>
                            <p className="text-xl font-bold text-green-700">₹{inv.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-gray-500">Maturity Date</p>
                             <p className="text-sm font-medium">{inv.maturityDate}</p>
                        </div>
                    </div>
                 )) : (
                    <div className="text-center p-12 text-gray-400">
                        <Wallet size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>No Investment Portfolios</p>
                    </div>
                 )}
            </div>
        )}

        {/* TAB: HISTORY (Enhanced Omni-Channel) */}
        {activeTab === 'history' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Omni-Channel Timeline</h3>
                    <div className="flex gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Call</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> SMS/Email</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> App/Web</span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-10">
                        {interactions.map(interaction => (
                            <div key={interaction.id} className="relative pl-8 group">
                                {/* Icon Bubble */}
                                <div className={`absolute -left-[18px] top-0 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 
                                    ${interaction.type === 'Call' ? 'bg-blue-100 text-blue-600' : 
                                      interaction.type === 'App' || interaction.type === 'Web' ? 'bg-orange-100 text-orange-600' : 
                                      'bg-purple-100 text-purple-600'}`}>
                                    {interaction.type === 'Call' ? <Phone size={14}/> : 
                                     interaction.type === 'Email' ? <Mail size={14}/> :
                                     interaction.type === 'SMS' ? <MessageSquare size={14}/> :
                                     interaction.type === 'App' ? <Smartphone size={14}/> :
                                     <Monitor size={14}/>}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-50 p-4 rounded-lg border border-gray-100 group-hover:border-gray-300 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 text-sm">{interaction.type}</span>
                                            {interaction.direction !== 'N/A' && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{interaction.direction}</span>
                                            )}
                                            <span className="text-xs text-gray-400 font-medium">• {interaction.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{interaction.summary}</p>
                                        
                                        {/* Metadata Tags */}
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {interaction.agentName && (
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Briefcase size={10}/> {interaction.agentName}
                                                </span>
                                            )}
                                            {interaction.sentiment && (
                                                <span className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${interaction.sentiment === 'Negative' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                    {interaction.sentiment === 'Negative' ? <AlertTriangle size={10}/> : <CheckCircle size={10}/>} {interaction.sentiment}
                                                </span>
                                            )}
                                            {interaction.metadata?.deliveryStatus && (
                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded border border-gray-300 flex items-center gap-1">
                                                    <CheckCircle size={10}/> {interaction.metadata.deliveryStatus}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Link */}
                                    {interaction.type === 'Call' && (
                                        <button className="mt-2 sm:mt-0 text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-colors">
                                            <Play size={10} fill="currentColor" /> Play Rec
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* Communication Modal */}
      {isCommModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <Send size={18} className="text-nbfc-600"/> Send Message
                      </h3>
                      <button onClick={() => setIsCommModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      {/* Channel Selection */}
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Template</label>
                          <select 
                            onChange={handleTemplateSelect}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-nbfc-500 outline-none"
                          >
                              <option value="">-- Choose a template --</option>
                              {mockTemplates.map(t => (
                                  <option key={t.id} value={t.id}>[{t.channel}] {t.name}</option>
                              ))}
                          </select>
                      </div>

                      {/* Preview & Edit */}
                      {selectedTemplate && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Message Preview <span className="text-xs font-normal text-gray-500">(Editable)</span>
                              </label>
                              <textarea 
                                value={messagePreview}
                                onChange={(e) => setMessagePreview(e.target.value)}
                                className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-nbfc-500 outline-none font-mono text-gray-600 bg-gray-50"
                              />
                              <div className="mt-2 flex gap-2">
                                  {selectedTemplate.channel === 'SMS' ? 
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">SMS Channel</span> : 
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Email Channel</span>
                                  }
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                      <button 
                        onClick={() => setIsCommModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleSendMessage}
                        disabled={!selectedTemplate}
                        className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm flex items-center gap-2 ${!selectedTemplate ? 'bg-gray-300 cursor-not-allowed' : 'bg-nbfc-600 hover:bg-nbfc-700'}`}
                      >
                          <Send size={16}/> Send Now
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Customer360;
