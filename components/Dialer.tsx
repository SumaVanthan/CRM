
import React, { useState, useEffect, useMemo } from 'react';
import { Phone, Users, Minus, ChevronUp, ClipboardList, CheckCircle, UserPlus, ArrowRight, Calendar } from 'lucide-react';

interface DialerProps {
  onSimulateIncoming: () => void;
  onSimulateNewLead?: () => void;
  onEndCall?: () => void;
  isCallActive: boolean;
  activeCustomerName?: string;
  
  // Controlled Props
  callDuration?: number;
  callStage?: 'talking' | 'disposition';
  isMuted?: boolean;
  isOnHold?: boolean;
  isHidden?: boolean; 
}

// Data Structure for Dispositions based on requirements
const DISPOSITION_DATA = [
  { disp: 'Customer Busy', sub: 'Asked to call back', cat: 'Positive', action: 'Schedule callback at preferred time; send reminder SMS.' },
  { disp: 'Customer Busy', sub: 'Call disconnected - Partial Presentation', cat: 'Positive', action: 'Redial in 5 minutes; send pitch summary SMS.' },
  { disp: 'Different Loan product Request', sub: 'Personal Loan', cat: 'Neutral', action: 'Route lead to PL desk; send PL brochure link.' },
  { disp: 'Different Loan product Request', sub: 'Two wheeler loan used card loan', cat: 'Neutral', action: 'Route to TWL/UCL desk; send eligibility checklist.' },
  { disp: 'Different Loan product Request', sub: 'Used car loan', cat: 'Neutral', action: 'Route to UCL desk; send valuation steps.' },
  { disp: 'Different Loan product Request', sub: 'Gold Loan', cat: 'Neutral', action: 'Share nearest branch details; schedule call with gold loan officer.' },
  { disp: 'Different Loan product Request', sub: 'Commercial vehicle loan', cat: 'Neutral', action: 'Send doc checklist; assign commercial loan officer.' },
  { disp: 'Different Loan product Request', sub: 'Working capital loan', cat: 'Neutral', action: 'Connect to SME desk; send WC loan requirements.' },
  { disp: 'Different Loan product Request', sub: 'Business Loan', cat: 'Neutral', action: 'Assign relationship manager; send BL program brochure.' },
  { disp: 'Different Loan product Request', sub: 'Home Loan', cat: 'Neutral', action: 'Send HL rate sheet and schedule callback.' },
  { disp: 'Different Loan product Request', sub: 'Mortgage Loan', cat: 'Neutral', action: 'Route to LAP desk; share LTV details.' },
  { disp: 'Different Loan product Request', sub: 'Vehicle Insurance', cat: 'Neutral', action: 'Send quote link; schedule follow-up.' },
  { disp: 'Different Loan product Request', sub: 'General Insurance', cat: 'Neutral', action: 'Transfer to GI sales; send quote link.' },
  { disp: 'Different Loan product Request', sub: 'Car Insurance', cat: 'Neutral', action: 'Send renewal/quote link.' },
  { disp: 'Different Loan product Request', sub: 'Life Insurance', cat: 'Neutral', action: 'Schedule advisor call; send policy illustrations.' },
  { disp: 'Different Loan product Request', sub: 'Mutual Fund Enquiry', cat: 'Neutral', action: 'Route to MF specialist; send KYC link.' },
  { disp: 'Different Loan product Request', sub: 'FIP Enquiry', cat: 'Neutral', action: 'Share FD vs FIP comparison; pitch FIP.' },
  { disp: 'Different Loan product Request', sub: 'EMI Enquiry', cat: 'DPR', action: 'Send EMI breakup; offer cross-sell if eligible.' },
  { disp: 'Do Not Call', sub: 'Do Not Call', cat: 'Negative', action: 'Mark DNC; stop outbound attempts; send confirmation SMS.' },
  { disp: 'Existing Customer', sub: 'Tax form Enquiry', cat: 'Neutral', action: 'Send interest certificate/26AS link.' },
  { disp: 'Existing Customer', sub: 'Existing FD Interest Calculation', cat: 'Neutral', action: 'Provide calculation; pitch top-up FD.' },
  { disp: 'Existing Customer', sub: 'Demographic Update', cat: 'Neutral', action: 'Update details; raise SR if needed.' },
  { disp: 'Existing Customer', sub: 'Complaint call', cat: 'Neutral', action: 'Register complaint; escalate as per TAT; send tracking ID.' },
  { disp: 'Existing Customer', sub: 'Service request Not Resolved', cat: 'Neutral', action: 'Reopen SR; escalate to L2; callback after resolution.' },
  { disp: 'Existing Customer', sub: 'Pre Closure', cat: 'Neutral', action: 'Explain charges; pitch renewal/top-up.' },
  { disp: 'Existing Customer', sub: 'Pre Closure Charges Enquiry', cat: 'Neutral', action: 'Share charges; provide alternative options.' },
  { disp: 'Existing Customer', sub: 'FD Renewal process', cat: 'Neutral', action: 'Share renewal flow; offer higher interest renewal.' },
];

const Dialer: React.FC<DialerProps> = ({ 
    onSimulateIncoming, 
    onSimulateNewLead, 
    onEndCall, 
    isCallActive, 
    activeCustomerName,
    callDuration = 0,
    callStage = 'talking',
    isHidden = false
}) => {
  const [dialNumber, setDialNumber] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Disposition State
  const [disposition, setDisposition] = useState('');
  const [subDisposition, setSubDisposition] = useState('');
  const [notes, setNotes] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');

  // Derived unique dispositions
  const uniqueDispositions = useMemo(() => {
    return Array.from(new Set(DISPOSITION_DATA.map(d => d.disp)));
  }, []);

  // Filtered sub-dispositions
  const subDispositions = useMemo(() => {
    return DISPOSITION_DATA.filter(d => d.disp === disposition);
  }, [disposition]);

  // Current selected Record
  const currentDispositionData = useMemo(() => {
    return DISPOSITION_DATA.find(d => d.disp === disposition && d.sub === subDisposition);
  }, [disposition, subDisposition]);

  // Auto-expand/reset logic
  useEffect(() => {
    if (isCallActive && callStage === 'talking') {
      setIsMinimized(false);
      setDisposition('');
      setSubDisposition('');
      setNotes('');
      setCallbackDate('');
      setCallbackTime('');
    }
  }, [isCallActive, callStage]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteInteraction = () => {
    if (onEndCall) onEndCall();
  };

  // Determine if callback inputs should be shown
  const showCallback = currentDispositionData?.action.toLowerCase().includes('schedule callback') || 
                       currentDispositionData?.action.toLowerCase().includes('redial') ||
                       subDisposition === 'Asked to call back';

  const isFormValid = disposition && subDisposition && (!showCallback || (callbackDate && callbackTime));

  // If hidden (e.g. active call handled by Top Bar), return null
  if (isHidden) return null;

  // Render minimized view (only if not hidden)
  if (isMinimized && isCallActive) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow-xl z-50 flex items-center gap-3 cursor-pointer animate-in fade-in slide-in-from-bottom-2 hover:bg-green-700 transition-colors"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="font-bold">{formatDuration(callDuration)}</span>
        <span className="text-sm border-l border-green-400 pl-3">{activeCustomerName}</span>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col transition-all duration-300 ${isCallActive ? 'rounded-t-lg' : ''}`}>
      
      {/* Header */}
      <div 
        className={`p-4 flex justify-between items-center cursor-pointer select-none relative z-10 transition-colors ${isCallActive ? (callStage === 'disposition' ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white') : 'bg-nbfc-900 text-white'}`}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          {isCallActive ? (
            <>
              {callStage === 'disposition' ? <ClipboardList size={18} /> : <Phone size={18} className="animate-pulse" />}
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none">{callStage === 'disposition' ? 'Wrap Up' : 'Connected'}</span>
                <span className="text-xs opacity-90 font-mono mt-0.5">{formatDuration(callDuration)}</span>
              </div>
            </>
          ) : (
            <>
              <Phone size={18} />
              <span className="font-semibold">Softphone</span>
            </>
          )}
        </div>
        
        <button 
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
          type="button"
        >
          {isMinimized ? <ChevronUp size={18} /> : <Minus size={18} />}
        </button>
      </div>

      {/* Screen Body */}
      {!isMinimized && (
        <div className="bg-gray-50 flex flex-col animate-in slide-in-from-bottom-2 duration-200 max-h-[80vh] overflow-y-auto custom-scroll">
        
        {isCallActive ? (
          callStage === 'talking' ? (
          // This block is technically unreachable if isHidden=true is passed correctly during talking
          <div className="p-6 flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
               <Users size={36} className="text-gray-500" />
             </div>
             <h3 className="font-bold text-gray-900 text-lg text-center leading-tight">{activeCustomerName || 'Unknown Caller'}</h3>
             <p className="text-sm text-gray-500 mb-8">+91-98765-XXXXX</p>
             <div className="text-center text-sm text-gray-400">Call Controls in Header</div>
          </div>
          ) : (
          // --------------------------
          // 2. DISPOSITION STAGE UI
          // --------------------------
          <div className="p-6 flex flex-col gap-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <CheckCircle size={18} className="text-green-600"/>
                  Call Disposition
              </h3>
              
              {/* Disposition Dropdown */}
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Disposition *</label>
                  <select 
                    value={disposition}
                    onChange={(e) => { setDisposition(e.target.value); setSubDisposition(''); }}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                  >
                      <option value="">Select Disposition</option>
                      {uniqueDispositions.map(d => (
                          <option key={d} value={d}>{d}</option>
                      ))}
                  </select>
              </div>

              {/* Sub-Disposition Dropdown */}
              <div className={!disposition ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sub Disposition *</label>
                  <select 
                    value={subDisposition}
                    onChange={(e) => setSubDisposition(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                    disabled={!disposition}
                  >
                      <option value="">Select Detail</option>
                      {subDispositions.map(d => (
                          <option key={d.sub} value={d.sub}>{d.sub}</option>
                      ))}
                  </select>
              </div>

              {/* Next Best Action Box */}
              {currentDispositionData && (
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-1.5 rounded tracking-wide">Next Best Action</span>
                          {currentDispositionData.cat === 'Positive' && <span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-1.5 rounded tracking-wide">Positive</span>}
                          {currentDispositionData.cat === 'Negative' && <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-1.5 rounded tracking-wide">Negative</span>}
                      </div>
                      <div className="flex gap-2 items-start text-sm text-blue-800 font-medium">
                          <ArrowRight size={16} className="shrink-0 mt-0.5"/>
                          {currentDispositionData.action}
                      </div>
                  </div>
              )}

              {/* Callback Inputs (Conditional) */}
              {showCallback && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-2 text-yellow-800 font-bold text-xs uppercase">
                          <Calendar size={14}/> Schedule Callback
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Date *</label>
                              <input 
                                type="date" 
                                value={callbackDate}
                                onChange={(e) => setCallbackDate(e.target.value)}
                                className="w-full p-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Time *</label>
                              <input 
                                type="time" 
                                value={callbackTime}
                                onChange={(e) => setCallbackTime(e.target.value)}
                                className="w-full p-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                              />
                          </div>
                      </div>
                  </div>
              )}

              {/* Notes */}
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add specific call details..."
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                  ></textarea>
              </div>

              <button 
                onClick={handleCompleteInteraction}
                disabled={!isFormValid}
                className={`w-full py-2.5 rounded-lg flex justify-center items-center gap-2 font-bold shadow-sm transition-colors mt-2 ${!isFormValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-nbfc-600 hover:bg-nbfc-700 text-white'}`}
                type="button"
             >
                Complete Interaction
             </button>
          </div>
          )
        ) : (
          // --------------------------
          // 3. DIALPAD UI
          // --------------------------
          <div className="p-4">
             <input 
                type="text" 
                placeholder="Enter Number" 
                className="w-full p-4 mb-4 text-xl border border-gray-300 rounded-lg bg-white text-right tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-nbfc-500 focus:border-transparent placeholder:text-gray-300 placeholder:font-sans placeholder:tracking-normal"
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
             />

             <div className="grid grid-cols-3 gap-3 mb-4">
                 {[1,2,3,4,5,6,7,8,9, '*', 0, '#'].map((k) => (
                     <button 
                        key={k} 
                        onClick={() => setDialNumber(prev => prev + k.toString())} 
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700 text-xl shadow-sm active:bg-gray-100 transition-colors"
                        type="button"
                     >
                         {k}
                     </button>
                 ))}
             </div>
             
             <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex justify-center items-center gap-2 font-bold shadow-md transition-colors active:scale-95" type="button">
                 <Phone size={20} /> Call
             </button>

             <div className="mt-3 flex gap-2">
                 <button 
                    onClick={onSimulateIncoming}
                    className="flex-1 py-2 text-xs text-blue-600 hover:bg-blue-50 border border-blue-200 rounded border-dashed transition-colors"
                    type="button"
                >
                    Simulate Customer
                </button>
                <button 
                    onClick={onSimulateNewLead}
                    className="flex-1 py-2 text-xs text-purple-600 hover:bg-purple-50 border border-purple-200 rounded border-dashed transition-colors flex items-center justify-center gap-1"
                    type="button"
                >
                    <UserPlus size={12}/> New Lead
                </button>
             </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Dialer;
