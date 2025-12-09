
import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Pause, Play, Users, Minus, ChevronUp, ClipboardList, CheckCircle, UserPlus } from 'lucide-react';

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
  isHidden?: boolean; // New prop to hide dialer during talking (handled by header)
}

const Dialer: React.FC<DialerProps> = ({ 
    onSimulateIncoming, 
    onSimulateNewLead, 
    onEndCall, 
    isCallActive, 
    activeCustomerName,
    callDuration = 0,
    callStage = 'talking',
    isMuted = false,
    isOnHold = false,
    isHidden = false
}) => {
  const [dialNumber, setDialNumber] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Disposition State
  const [disposition, setDisposition] = useState('');
  const [notes, setNotes] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');

  // Auto-expand/reset logic
  useEffect(() => {
    if (isCallActive && callStage === 'talking') {
      setIsMinimized(false);
      setDisposition('');
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

  const isFormValid = disposition && (disposition !== 'Callback Required' || (callbackDate && callbackTime));

  return (
    <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col transition-all duration-300 ${isCallActive ? 'rounded-t-lg' : ''}`}>
      
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
        <div className="bg-gray-50 flex flex-col animate-in slide-in-from-bottom-2 duration-200">
        
        {isCallActive ? (
          callStage === 'talking' ? (
          // This block is technically unreachable if isHidden=true is passed correctly during talking
          // But kept as fallback or for future standalone use
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
          <div className="p-6 flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600"/>
                  Call Ended
              </h3>
              
              <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Call Outcome *</label>
                  <select 
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                  >
                      <option value="">Select Disposition</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Callback Required">Callback Required</option>
                      <option value="Sale Made">Sale Made</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Wrong Number">Wrong Number</option>
                      <option value="Escalated">Escalated</option>
                  </select>
              </div>

              {disposition === 'Callback Required' && (
                  <div className="grid grid-cols-2 gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Date *</label>
                          <input 
                            type="date" 
                            value={callbackDate}
                            onChange={(e) => setCallbackDate(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Time *</label>
                          <input 
                            type="time" 
                            value={callbackTime}
                            onChange={(e) => setCallbackTime(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                          />
                      </div>
                  </div>
              )}

              <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter call summary..."
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-nbfc-500"
                  ></textarea>
              </div>

              <button 
                onClick={handleCompleteInteraction}
                disabled={!isFormValid}
                className={`w-full py-2.5 rounded-lg flex justify-center items-center gap-2 font-bold shadow-sm transition-colors ${!isFormValid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-nbfc-600 hover:bg-nbfc-700 text-white'}`}
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
