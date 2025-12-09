import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PrivacyTextProps {
  text: string;
  type: 'mobile' | 'email' | 'pan' | 'aadhaar';
  label?: string;
}

const PrivacyText: React.FC<PrivacyTextProps> = ({ text, type, label }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const getMaskedText = () => {
    switch (type) {
      case 'mobile':
        // Show last 3 digits: +91-XXXXX-XX789
        return text.replace(/(\d{5})(\d{2})/, 'XXXXX-XX'); 
      case 'email':
        // a***@example.com
        const [user, domain] = text.split('@');
        return `${user.charAt(0)}***@${domain}`;
      case 'pan':
        // XXX**1234X
        return text.substring(0, 3) + '**' + text.substring(5);
      default:
        return '••••••••';
    }
  };

  const handleToggle = () => {
    // In a real app, this would trigger an audit log (3.8.3)
    if (!isRevealed) {
        // Simulating 3.8.1 Manager approval or Role Check
        console.log(`[AUDIT] User requested unmask for ${type}`);
    }
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="flex flex-col">
      {label && <span className="text-xs text-gray-500 mb-1">{label}</span>}
      <div className="flex items-center gap-2 group">
        <span className={`font-medium ${isRevealed ? 'text-gray-900' : 'text-gray-600 font-mono tracking-wide'}`}>
          {isRevealed ? text : getMaskedText()}
        </span>
        <button 
          onClick={handleToggle}
          className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
          title={isRevealed ? "Hide PII" : "View PII (Audit Logged)"}
        >
          {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
};

export default PrivacyText;