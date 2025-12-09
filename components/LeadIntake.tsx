
import React, { useState, useRef } from 'react';
import { AIDecisionEngine } from '../services/aiDecisionEngine';
import { Bot, Lightbulb, MessageSquare, Target, Zap, ShieldCheck, IndianRupee, Clock, TrendingUp } from 'lucide-react';
import { AnswerOption } from '../types';

const LeadIntake: React.FC = () => {
  const engineRef = useRef<AIDecisionEngine | null>(null);
  
  if (!engineRef.current) {
    engineRef.current = new AIDecisionEngine();
  }

  const engine = engineRef.current;
  const [currentQuestion, setCurrentQuestion] = useState(engine.getCurrentQuestion());
  const [aiState, setAiState] = useState(engine.getState());

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
    <div className="flex h-full bg-gray-50 overflow-hidden font-sans">
      
      {/* LEFT: Command Center */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bot size={20} className="text-indigo-600"/>
                Sales Command Center
            </h2>
            <div className="flex gap-2">
                 <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase">FD Drop-off</div>
            </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto custom-scroll">
            
            {/* HERO SCRIPT */}
            <div className="mb-8">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MessageSquare size={12}/> Agent Script
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-2xl font-medium text-gray-900 leading-relaxed relative">
                    <span className="absolute top-4 left-4 text-6xl text-gray-100 font-serif -z-10">“</span>
                    {currentQuestion.agentScript}
                </div>
            </div>

            {/* BATTLE STATION (Buttons) */}
            <div className="mb-8">
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Target size={12}/> Customer Response
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options?.map((opt, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(opt)}
                            className={`p-4 rounded-xl border-2 text-left transition-all shadow-sm active:scale-95 flex flex-col justify-center h-24 ${getButtonStyles(opt.intent)}`}
                        >
                            <span className="text-lg font-bold">{opt.text}</span>
                            <span className="text-xs opacity-70 uppercase font-bold mt-1 tracking-wide">{opt.intent}</span>
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

      {/* RIGHT: Cheat Sheet & Scorecard */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto custom-scroll">
         
         {/* Lead Score */}
         <div className="p-6 border-b border-gray-100">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-gray-500 uppercase">Buying Intent</span>
                 <span className={`text-lg font-black ${aiState.scores.intent > 60 ? 'text-green-600' : 'text-amber-500'}`}>{aiState.scores.intent}%</span>
             </div>
             <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-500 ${aiState.scores.intent > 60 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${aiState.scores.intent}%`}}></div>
             </div>
         </div>

         {/* Product Cheat Sheet */}
         <div className="p-6 flex-1">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Zap size={12}/> Product Cheat Sheet
             </h3>

             <div className="space-y-4">
                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase mb-1">
                         <TrendingUp size={12}/> Best Rate
                     </div>
                     <p className="text-2xl font-bold text-gray-900">9.40%*</p>
                     <p className="text-xs text-gray-500">For Senior Citizens (50 months)</p>
                 </div>

                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase mb-1">
                         <ShieldCheck size={12}/> Trust Rating
                     </div>
                     <p className="text-lg font-bold text-gray-900">MAA+/Stable</p>
                     <p className="text-xs text-gray-500">Rated by ICRA</p>
                 </div>

                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
                         <IndianRupee size={12}/> Min Investment
                     </div>
                     <p className="text-lg font-bold text-gray-900">₹ 5,000</p>
                 </div>

                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase mb-1">
                         <Clock size={12}/> Loan vs FD
                     </div>
                     <p className="text-sm font-bold text-gray-900">Up to 90% LTV</p>
                     <p className="text-xs text-gray-500">Instant liquidity option</p>
                 </div>
             </div>
         </div>

         {/* Recommendation */}
         {aiState.recommendation && (
             <div className="p-4 bg-green-50 border-t border-green-100">
                 <div className="text-xs font-bold text-green-700 uppercase mb-1">AI Recommendation</div>
                 <div className="font-bold text-gray-900">{aiState.recommendation}</div>
             </div>
         )}
         
         {/* Footer Padding to avoid obstruction if dialer was floating (though now it's not) */}
         <div className="h-20"></div>

      </div>
    </div>
  );
};

export default LeadIntake;
