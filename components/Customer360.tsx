

import React, { useState, useEffect, useRef } from 'react';
import { Customer, Loan, FDProduct, InsuranceProduct, DropOffDetails, Interaction, Ticket, CommunicationTemplate, AnswerOption } from '../types';
import { mockOffers, mockTemplates } from '../services/mockData';
import { AIDecisionEngine } from '../services/aiDecisionEngine';
import PrivacyText from './PrivacyText';
import { CreditCard, Wallet, FileText, AlertTriangle, CheckCircle, Smartphone, Mail, Target, Lightbulb, History, Zap, Bot, UserPlus, AlertCircle, Send, MessageSquare, Printer, Eye, ChevronDown, Download, Share2, Shield } from 'lucide-react';

interface Customer360Props {
  customer: Customer;
  loans: Loan[];
  fds: FDProduct[];
  insurance: InsuranceProduct[];
  interactions: Interaction[];
  tickets: Ticket[];
  isNTB?: boolean;
  dropOffDetails?: DropOffDetails;
}

const Customer360: React.FC<Customer360Props> = ({ customer, loans, fds, insurance, interactions, tickets, isNTB = false, dropOffDetails }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'history' | 'sales_coach'>('overview');
  
  // Initialize AI Engine with context
  const engineRef = useRef<AIDecisionEngine | null>(null);
  
  // Reset engine on customer change
  useEffect(() => {
    engineRef.current = new AIDecisionEngine({
        isDropOff: !!dropOffDetails,
        isOverdue: loans.some(l => l.dpd > 0),
        isMaturity: fds.some(f => f.status === 'Matured'), // simplistic check
        amount: dropOffDetails?.enteredAmount
    });
    setCurrentQuestion(engineRef.current.getCurrentQuestion());
    setAiState(engineRef.current.getState());
    
    // Set default tab based on customer type
    if (isNTB) setActiveTab('sales_coach');
    else setActiveTab('overview');

  }, [customer.id, isNTB, dropOffDetails, loans, fds]);

  const engine = engineRef.current!;
  const [currentQuestion, setCurrentQuestion] = useState(engine?.getCurrentQuestion());
  const [aiState, setAiState] = useState(engine?.getState());

  // Communication Modal State
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [messagePreview, setMessagePreview] = useState('');
  const [commContext, setCommContext] = useState<{docName?: string, docLink?: string}>({});

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const tmpl = mockTemplates.find(t => t.id === e.target.value);
      if (tmpl) {
          setSelectedTemplate(tmpl);
          let content = tmpl.content.replace('{name}', customer.fullName.split(' ')[0]);
          if (commContext.docName) content = content.replace('requested document', commContext.docName);
          if (commContext.docLink) content = content.replace('{link}', commContext.docLink);
          setMessagePreview(content);
      } else {
          setSelectedTemplate(null);
          setMessagePreview('');
      }
  };

  const openCommModal = (docName: string) => {
      setCommContext({
          docName,
          docLink: `fin.co/docs/${Math.floor(Math.random()*10000)}`
      });
      setIsCommModalOpen(true);
  };

  const handleSendMessage = () => {
      alert(`Message Sent via ${selectedTemplate?.channel}: ${messagePreview}`);
      setIsCommModalOpen(false);
  };

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
      
      {/* Header */}
      <div className="bg-white p-6 shadow-sm border-b border-gray-200 flex justify-between items-start">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-nbfc-100 rounded-full flex items-center justify-center text-nbfc-800 text-2xl font-bold">
            {customer.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{customer.fullName}</h1>
                {isNTB && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold uppercase rounded border border-purple-200">Prospect</span>}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1"><span className="text-gray-400">ID:</span> {customer.id}</div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${customer.riskCategory === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    Risk: {customer.riskCategory}
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
             <div className="flex items-center gap-2 text-sm"><PrivacyText type="mobile" text={customer.mobile} /><Smartphone size={14} className="text-gray-400" /></div>
             <div className="flex items-center gap-2 text-sm"><PrivacyText type="email" text={customer.email} /><Mail size={14} className="text-gray-400" /></div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-gray-50 px-6 pt-4 pb-2 flex gap-3 flex-wrap">
         {loans.some(l => l.dpd > 0) && (
             <div className="flex items-center gap-2 px-3 py-2 bg-red-100 border border-red-200 text-red-800 rounded-md text-sm font-medium animate-pulse">
                 <AlertTriangle size={16} /> Action Required: EMI Overdue
             </div>
         )}
         {dropOffDetails && (
             <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 border border-orange-200 text-orange-800 rounded-md text-sm font-medium">
                 <AlertCircle size={16} /> Incomplete {dropOffDetails.productType} Application detected
             </div>
         )}
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 border-b border-gray-200">
        <div className="flex space-x-6 overflow-x-auto">
            {[
                { id: 'sales_coach', label: 'Sales Coach', icon: Zap },
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'products', label: 'Product Docs', icon: Wallet },
                { id: 'history', label: 'History', icon: History },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-nbfc-600 text-nbfc-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <tab.icon size={18} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scroll">
        
        {/* --- TAB: SALES COACH --- */}
        {activeTab === 'sales_coach' && currentQuestion && (
            <div className="flex gap-6 h-full">
                <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><Bot size={18} className="text-indigo-600"/> AI Scripting Engine</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">{dropOffDetails ? 'Recovery Mode' : 'Standard Mode'}</span>
                    </div>
                    <div className="p-8 flex-col flex gap-8">
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><MessageSquare size={12}/> Agent Script</div>
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-xl font-medium text-gray-900 leading-relaxed">{currentQuestion.agentScript}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={12}/> Customer Response</div>
                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options?.map((opt, idx) => (
                                    <button key={idx} onClick={() => handleAnswer(opt)} className={`p-4 rounded-xl border-2 text-left transition-all shadow-sm active:scale-95 flex flex-col justify-center h-20 ${getButtonStyles(opt.intent)}`}>
                                        <span className="text-base font-bold">{opt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {currentQuestion.persuasionTip && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex gap-3">
                                <Lightbulb className="text-amber-500 shrink-0" size={24} />
                                <div><h4 className="font-bold text-amber-900 text-sm">Persuasion Logic</h4><p className="text-amber-800 text-sm mt-1">{currentQuestion.persuasionTip}</p></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB: PRODUCTS (Detailed) --- */}
        {activeTab === 'products' && (
            <div className="space-y-8">
                {/* 1. Incomplete Applications (Drop-offs) */}
                {dropOffDetails && (
                    <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
                        <div className="bg-orange-50 px-6 py-4 border-b border-orange-200 flex justify-between items-center">
                             <h3 className="font-bold text-orange-800 flex items-center gap-2"><AlertCircle size={18}/> Incomplete Application / Recovery Center</h3>
                             <button className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded font-bold shadow-sm hover:bg-orange-700">Resume Application</button>
                        </div>
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div><p className="text-xs text-gray-500">Product</p><p className="font-bold text-gray-900">{dropOffDetails.productType}</p></div>
                            <div><p className="text-xs text-gray-500">Amount Entered</p><p className="font-bold text-gray-900">₹{dropOffDetails.enteredAmount}</p></div>
                            <div><p className="text-xs text-gray-500">KYC Progress</p><p className="font-bold text-gray-900">{dropOffDetails.kycProgress}</p></div>
                            <div><p className="text-xs text-gray-500">Stage</p><p className="font-bold text-orange-600">{dropOffDetails.stage}</p></div>
                            {dropOffDetails.capturedData && (
                                <div className="col-span-full mt-2 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Captured Data</p>
                                    <div className="flex gap-4 text-sm text-gray-700">
                                        <span>Name: <strong>{dropOffDetails.capturedData.name}</strong></span>
                                        <span>Mobile: <strong>{dropOffDetails.capturedData.mobile}</strong></span>
                                        {dropOffDetails.capturedData.paymentMethod && <span>Payment: <strong>{dropOffDetails.capturedData.paymentMethod}</strong></span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. FD Products */}
                {fds.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-gray-800">Fixed Deposits</h3></div>
                        <div className="p-6 space-y-6">
                            {fds.map(fd => (
                                <div key={fd.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{fd.type} - {fd.certificateNumber}</p>
                                            <p className="text-xs text-gray-500">Holder: {fd.holderName} {fd.nominee && <span className="text-gray-400 ml-2">(Nominee: {fd.nominee})</span>}</p>
                                        </div>
                                        <div className="text-right"><p className="text-sm font-bold text-green-700">₹{fd.amount.toLocaleString()}</p><p className="text-xs text-gray-500">Principal</p></div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { label: 'TDS Cert', enabled: fd.hasTdsCertificate },
                                            { label: 'Form 15G/H', enabled: fd.hasForm15G },
                                            { label: 'SOA', enabled: fd.hasSOA },
                                            { label: 'Ledger', enabled: fd.hasLedger }
                                        ].map(doc => (
                                            <div key={doc.label} className={`p-2 rounded border flex justify-between items-center text-xs ${doc.enabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 text-gray-400'}`}>
                                                <span>{doc.label}</span>
                                                <div className="flex gap-1">
                                                    <button disabled={!doc.enabled} onClick={() => openCommModal(doc.label)} className="p-1 hover:bg-white rounded text-blue-600" title="Send Link"><Share2 size={12}/></button>
                                                    <button disabled={!doc.enabled} className="p-1 hover:bg-white rounded text-gray-600" title="Print"><Printer size={12}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Loan Products */}
                {loans.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-gray-800">Active Loans</h3></div>
                         <div className="p-6 space-y-6">
                            {loans.map(loan => (
                                <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                                     <div className="flex justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{loan.type} - {loan.accountNumber}</p>
                                            <p className="text-xs text-gray-500">Borrower: {loan.holderName}</p>
                                        </div>
                                        <div className="text-right"><p className="text-sm font-bold text-blue-700">₹{loan.outstandingPrincipal.toLocaleString()}</p><p className="text-xs text-gray-500">Outstanding</p></div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                         {[
                                            { label: 'Statement', enabled: loan.hasLoanStatement },
                                            { label: 'Ledger', enabled: loan.hasLedger },
                                            { label: 'Sanction Letter', enabled: loan.hasSanctionLetter },
                                            { label: 'Repayment Sch', enabled: loan.hasRepaymentSchedule }
                                        ].map(doc => (
                                            <div key={doc.label} className={`p-2 rounded border flex justify-between items-center text-xs ${doc.enabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 text-gray-400'}`}>
                                                <span>{doc.label}</span>
                                                <div className="flex gap-1">
                                                    <button disabled={!doc.enabled} onClick={() => openCommModal(doc.label)} className="p-1 hover:bg-white rounded text-blue-600" title="Send Link"><Share2 size={12}/></button>
                                                    <button disabled={!doc.enabled} className="p-1 hover:bg-white rounded text-gray-600" title="Download"><Download size={12}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
                
                {/* 4. Insurance Products */}
                {insurance.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-gray-800">Insurance Portfolio</h3></div>
                         <div className="p-6 space-y-6">
                            {insurance.map(ins => (
                                <div key={ins.id} className="border border-gray-200 rounded-lg p-4">
                                     <div className="flex justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{ins.productName}</p>
                                            <p className="text-xs text-gray-500">Policy No: {ins.policyNo}</p>
                                            <p className="text-xs text-gray-500">Insured: {ins.holderName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-purple-700">₹{parseInt(ins.premiumPaid).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">Premium Paid</p>
                                            <p className="text-xs text-gray-400">Next Due: {ins.nextDueDate}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                         {[
                                            { label: 'Policy Document', enabled: ins.hasPolicyDocument },
                                            { label: 'Premium Receipt', enabled: true },
                                            { label: 'Tax Certificate', enabled: true },
                                        ].map(doc => (
                                            <div key={doc.label} className={`p-2 rounded border flex justify-between items-center text-xs ${doc.enabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 text-gray-400'}`}>
                                                <span>{doc.label}</span>
                                                <div className="flex gap-1">
                                                    <button disabled={!doc.enabled} onClick={() => openCommModal(doc.label)} className="p-1 hover:bg-white rounded text-blue-600" title="Send Link"><Share2 size={12}/></button>
                                                    <button disabled={!doc.enabled} className="p-1 hover:bg-white rounded text-gray-600" title="Download"><Download size={12}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        )}

        {/* --- TAB: OVERVIEW (Simplified) --- */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Relationship Snapshot</h3>
                        {isNTB ? (
                             dropOffDetails ? (
                                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
                                    <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                                        <AlertCircle size={18}/> Active Application Context
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-100">
                                             <div>
                                                 <p className="text-xs text-gray-500 uppercase font-bold">Product</p>
                                                 <p className="font-bold text-gray-900">{dropOffDetails.productType}</p>
                                             </div>
                                             <div className="text-right">
                                                 <p className="text-xs text-gray-500 uppercase font-bold">Amount</p>
                                                 <p className="font-bold text-gray-900">₹{dropOffDetails.enteredAmount}</p>
                                             </div>
                                        </div>
                                        {dropOffDetails.capturedData && (
                                            <div className="p-3 bg-gray-50 rounded border border-gray-100">
                                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Applicant Details</p>
                                                <p className="text-sm text-gray-800">Name: <strong>{dropOffDetails.capturedData.name}</strong></p>
                                                <p className="text-sm text-gray-800">Mobile: {dropOffDetails.capturedData.mobile}</p>
                                            </div>
                                        )}
                                        <button onClick={() => setActiveTab('products')} className="w-full py-2 bg-orange-600 text-white rounded text-sm font-bold hover:bg-orange-700">
                                            Resume Application
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                 <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                     <UserPlus size={32} className="mx-auto text-gray-400 mb-2"/>
                                     <p className="text-gray-600 font-medium">New Prospect</p>
                                     <p className="text-xs text-gray-400">No active products found. Check Products tab for drop-off data.</p>
                                 </div>
                            )
                        ) : (
                            <div className="space-y-3">
                                {loans.map(l => (
                                    <div key={l.id} className="flex justify-between p-3 bg-blue-50 rounded border border-blue-100">
                                        <div>
                                            <span className="text-sm font-bold text-blue-900">{l.type}</span>
                                            <span className="block text-xs text-blue-600">Borrower: {l.holderName}</span>
                                        </div>
                                        <span className="text-sm font-mono">{l.accountNumber}</span>
                                    </div>
                                ))}
                                {fds.map(f => (
                                    <div key={f.id} className="flex justify-between p-3 bg-green-50 rounded border border-green-100">
                                        <div>
                                            <span className="text-sm font-bold text-green-900">Fixed Deposit</span>
                                            <span className="block text-xs text-green-600">Holder: {f.holderName}</span>
                                        </div>
                                        <span className="text-sm font-mono">{f.certificateNumber}</span>
                                    </div>
                                ))}
                                {insurance.map(ins => (
                                    <div key={ins.id} className="flex justify-between p-3 bg-purple-50 rounded border border-purple-100">
                                        <div>
                                            <span className="text-sm font-bold text-purple-900">{ins.productName}</span>
                                            <span className="block text-xs text-purple-600">Insured: {ins.holderName}</span>
                                        </div>
                                        <span className="text-sm font-mono">{ins.policyNo}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                     <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                        <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2"><Zap size={18}/> Offers</h3>
                        <div className="space-y-3">
                            {mockOffers.map(offer => (
                                <div key={offer.id} className="border border-purple-100 rounded p-3 text-sm">
                                    <p className="font-bold text-gray-800">{offer.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{offer.description}</p>
                                    <button className="mt-2 w-full py-1 bg-purple-600 text-white text-xs font-bold rounded">Pitch</button>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        )}

        {/* --- TAB: HISTORY --- */}
        {activeTab === 'history' && (
             <div className="space-y-4">
                 {interactions.map(i => (
                     <div key={i.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-start">
                         <div>
                             <p className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                 {i.type === 'Call' && <Smartphone size={14}/>}
                                 {i.type === 'Email' && <Mail size={14}/>}
                                 {i.type} <span className="text-xs font-normal text-gray-500">• {i.date}</span>
                             </p>
                             <p className="text-sm text-gray-600 mt-1">{i.summary}</p>
                         </div>
                         {i.sentiment && (
                            <span className={`text-xs px-2 py-1 rounded ${i.sentiment === 'Negative' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{i.sentiment}</span>
                         )}
                     </div>
                 ))}
             </div>
        )}
      </div>

      {/* Comm Modal */}
      {isCommModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2"><Send size={18} className="text-nbfc-600"/> Send Document Link</h3>
                      <button onClick={() => setIsCommModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Template</label>
                          <select onChange={handleTemplateSelect} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-nbfc-500 outline-none">
                              <option value="">-- Choose --</option>
                              {mockTemplates.map(t => <option key={t.id} value={t.id}>[{t.channel}] {t.name}</option>)}
                          </select>
                      </div>
                      {selectedTemplate && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                              <textarea value={messagePreview} onChange={(e) => setMessagePreview(e.target.value)} className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm font-mono text-gray-600 bg-gray-50"/>
                          </div>
                      )}
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                      <button onClick={() => setIsCommModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white">Cancel</button>
                      <button onClick={handleSendMessage} disabled={!selectedTemplate} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-nbfc-600 hover:bg-nbfc-700 flex items-center gap-2 shadow-sm"><Send size={16}/> Send</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Customer360;
