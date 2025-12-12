

import { AIState, QuestionNode, AnswerOption } from '../types';

// Define the Decision Tree Nodes
const QUESTIONS: Record<string, QuestionNode> = {
  // --- Scenarios ---
  
  // 1. Drop-off Scenario (Existing)
  'DropOff_Start': {
    id: 'DropOff_Start',
    text: "Drop-off Recovery Opening",
    agentScript: "Hi, I'm calling from Shriram Finance. I noticed you started an application for a Fixed Deposit of ₹{amount} but couldn't complete it. Was there any technical issue I can help with?",
    persuasionTip: "Address the specific product and amount to show context. Be helpful, not salesy initially.",
    type: 'choice',
    options: [
      { text: 'Technical Issue', intent: 'neutral' }, 
      { text: 'Just Checking', intent: 'objection' }, 
      { text: 'Payment Failed', intent: 'neutral' }
    ],
    category: 'Identity'
  },

  // 2. Maturity Nearing Scenario
  'Maturity_Start': {
    id: 'Maturity_Start',
    text: "Maturity Renewal Opening",
    agentScript: "Hi, this is regarding your FD ending on 12th Feb. It is eligible for a special renewal rate of 7.25%. Would you like to lock this rate today?",
    persuasionTip: "Create urgency around the 'Special Renewal Rate'.",
    type: 'choice',
    options: [
      { text: 'Interested in Renewal', intent: 'positive' }, 
      { text: 'Want to Withdraw', intent: 'negative' }
    ],
    category: 'Investment'
  },

  // 3. Collection/Overdue Scenario
  'Collection_Start': {
    id: 'Collection_Start',
    text: "EMI Overdue Opening",
    agentScript: "Hi, this is a reminder that your Personal Loan EMI of ₹{emi} is overdue by 32 days. To avoid impact on your CIBIL score, shall I send a payment link now?",
    persuasionTip: "Use 'Loss Aversion' (CIBIL score impact).",
    type: 'choice',
    options: [
      { text: 'Send Link', intent: 'positive' }, 
      { text: 'Will Pay Later', intent: 'neutral' },
      { text: 'Dispute Charges', intent: 'objection' }
    ],
    category: 'Loan'
  },

  // --- Common Objections & Closings ---
  
  'Obj_Browsing': {
    id: 'Obj_Browsing',
    text: "Handling Browsing",
    agentScript: "Completely understand. Since you are exploring, did you know we currently offer one of the highest interest rates in the market at 9.40%* p.a.? This is a limited-time festive offer.",
    persuasionTip: "Pivot to FOMO. Highlight the headline rate.",
    type: 'choice',
    options: [
      { text: 'Tell me more', intent: 'positive' }, 
      { text: 'Not interested', intent: 'negative' }
    ],
    category: 'Investment'
  },

  'Closing_Soft': {
    id: 'Closing_Soft',
    text: "Soft Close - Link",
    agentScript: "Great. I'm sending a secure link to your mobile. You can complete the process in just 2 minutes. Shall I send it?",
    persuasionTip: "Minimize effort. 'Just 2 minutes'.",
    type: 'choice',
    options: [
      { text: 'Yes, send link', intent: 'positive' }, 
      { text: 'No, not now', intent: 'negative' }
    ],
    category: 'Closing'
  },

  'Closing_Hard': {
    id: 'Closing_Hard',
    text: "Hard Close - Booking",
    agentScript: "Since you are happy with the returns, I can help you book this right now on the call. Shall we proceed?",
    persuasionTip: "Assumptive Close.",
    type: 'choice',
    options: [
      { text: 'Proceed', intent: 'positive' }, 
      { text: 'Call me later', intent: 'neutral' }
    ],
    category: 'Closing'
  },

  'End_Success': {
    id: 'End_Success',
    text: "Success",
    agentScript: "Excellent! I have initiated the process. You will receive an SMS shortly.",
    persuasionTip: "Confirm and Close.",
    type: 'choice',
    options: [
      { text: 'End Call', intent: 'neutral' }
    ],
    category: 'Closing'
  },
  'End_Neutral': {
    id: 'End_Neutral',
    text: "Neutral",
    agentScript: "No problem. I have noted your preference. Thank you for your time.",
    persuasionTip: "Polite Exit.",
    type: 'choice',
    options: [
      { text: 'End Call', intent: 'neutral' }
    ],
    category: 'Closing'
  }
};

export class AIDecisionEngine {
  private state: AIState;

  constructor(context?: { isDropOff?: boolean; isOverdue?: boolean; isMaturity?: boolean; amount?: string }) {
    let startNodeId = 'DropOff_Start'; // Default fallback

    if (context?.isOverdue) startNodeId = 'Collection_Start';
    else if (context?.isMaturity) startNodeId = 'Maturity_Start';
    else if (context?.isDropOff) startNodeId = 'DropOff_Start';
    
    // Inject dynamic values into script if needed
    let startScript = QUESTIONS[startNodeId].agentScript || "";
    if (context?.amount) {
        startScript = startScript.replace('{amount}', context.amount).replace('{emi}', context.amount);
    }
    // Note: In a real app we'd clone the node to avoid mutating static const, 
    // but here we just assume the consuming component handles the string display if we return it in state.
    // For simplicity, we are not mutating the QUESTIONS object directly here but relying on the component to render.
    
    // Hack: Mutating the text for the session instance (simplified)
    if (context?.amount) {
         QUESTIONS[startNodeId] = {
             ...QUESTIONS[startNodeId],
             agentScript: startScript
         }
    }

    this.state = {
      currentNodeId: startNodeId,
      history: [],
      scores: { intent: 40, eligibility: 80 },
      customerProfile: { intentType: 'Investment' },
      recommendation: context?.isOverdue ? "Pay EMI" : "FD - 9.40% Special Scheme",
      objectionPrediction: "Rate Sensitivity"
    };
  }

  getCurrentQuestion(): QuestionNode {
    return QUESTIONS[this.state.currentNodeId];
  }

  getState(): AIState {
    return this.state;
  }

  processAnswer(answerText: string): AIState {
    const currentNode = QUESTIONS[this.state.currentNodeId];
    
    this.state.history.push({ 
        question: currentNode.text, 
        script: currentNode.agentScript, 
        answer: answerText 
    });

    if (answerText.includes('Not interested') || answerText.includes('No')) {
        this.state.scores.intent -= 20;
    } else {
        this.state.scores.intent += 15;
    }
    this.state.scores.intent = Math.min(100, Math.max(0, this.state.scores.intent));

    let nextNodeId = 'End_Neutral'; // Default end

    // Simple Logic Routing
    if (currentNode.id === 'DropOff_Start') {
        if (answerText === 'Technical Issue') nextNodeId = 'Closing_Soft';
        else if (answerText === 'Just Checking') nextNodeId = 'Obj_Browsing';
    }
    else if (currentNode.id === 'Maturity_Start') {
        nextNodeId = answerText === 'Interested in Renewal' ? 'Closing_Hard' : 'End_Neutral';
    }
    else if (currentNode.id === 'Collection_Start') {
        nextNodeId = answerText === 'Send Link' ? 'End_Success' : 'End_Neutral';
    }
    else if (currentNode.id === 'Obj_Browsing') {
        nextNodeId = answerText === 'Tell me more' ? 'Closing_Soft' : 'End_Neutral';
    }
    else if (currentNode.id === 'Closing_Soft' || currentNode.id === 'Closing_Hard') {
        nextNodeId = answerText.includes('Yes') || answerText.includes('Proceed') ? 'End_Success' : 'End_Neutral';
    }

    if (nextNodeId && QUESTIONS[nextNodeId]) {
      this.state.currentNodeId = nextNodeId;
    }

    return this.state;
  }
}
