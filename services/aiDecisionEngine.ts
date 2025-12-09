
import { AIState, QuestionNode, LeadProfile, AnswerOption } from '../types';

// Define the Decision Tree Nodes for FD Drop-off Scenario
const QUESTIONS: Record<string, QuestionNode> = {
  // --- Root ---
  'Start': {
    id: 'Start',
    text: "Opening Script",
    agentScript: "Hi, I'm calling from Shriram Finance. I noticed you were checking our FD rates online a few minutes ago but didn't complete the booking. Was there any specific information you needed or a concern I can help clarify?",
    persuasionTip: "Acknowledge their action immediately. This shows relevance and attentiveness, not a cold call.",
    type: 'choice',
    options: [
      { text: 'Just Checking Rates', intent: 'neutral' }, 
      { text: 'Rates seem low', intent: 'objection' }, 
      { text: 'Concerned about Safety', intent: 'objection' }, 
      { text: 'Need money soon', intent: 'objection' }
    ],
    category: 'Identity'
  },
  
  // --- Objection: Just Checking ---
  'Obj_Browsing': {
    id: 'Obj_Browsing',
    text: "Handling Browsing",
    agentScript: "Completely understand. Since you are exploring, did you know we currently offer one of the highest interest rates in the market at 9.40%* p.a. for senior citizens? This is a limited-time festive offer.",
    persuasionTip: "Pivot from 'just looking' to 'fear of missing out' (FOMO). Highlight the headline rate immediately.",
    type: 'choice',
    options: [
      { text: 'Tell me more', intent: 'positive' }, 
      { text: 'Not interested', intent: 'negative' }
    ],
    category: 'Investment'
  },

  // --- Objection: Rates Low ---
  'Obj_RatesLow': {
    id: 'Obj_RatesLow',
    text: "Handling Rate Comparison",
    agentScript: "I hear you. However, compared to standard bank FDs which average around 7%, our 9.1% yield effectively beats inflation. Plus, we offer 0.5% extra for senior citizens/women. Would you like a quick calculation?",
    persuasionTip: "Use the 'Contrast Principle'. Frame the rate against lower bank averages to make it shine.",
    type: 'choice',
    options: [
      { text: 'Show Calculation', intent: 'positive' }, 
      { text: 'Still not convinced', intent: 'negative' }
    ],
    category: 'Investment'
  },

  // --- Objection: Safety ---
  'Obj_Safety': {
    id: 'Obj_Safety',
    text: "Handling Trust/Safety",
    agentScript: "Safety is our priority too. We are rated 'MAA+/Stable' by ICRA and have been serving customers for over 45 years. Your principal is backed by the Shriram Group legacy.",
    persuasionTip: "Leverage 'Social Proof' and 'Authority'. Mentioning ratings and years in business builds trust.",
    type: 'choice',
    options: [
      { text: 'Okay, that helps', intent: 'positive' }, 
      { text: 'I prefer Banks', intent: 'negative' }
    ],
    category: 'Investment'
  },

  // --- Objection: Liquidity ---
  'Obj_Liquidity': {
    id: 'Obj_Liquidity',
    text: "Handling Lock-in Fears",
    agentScript: "I understand you might need funds. The good news is, we offer a Loan against FD up to 90% of the value. You get high returns, but your money isn't stuck if an emergency happens.",
    persuasionTip: "Address the 'Liquidity Trap' fear. Offering an exit option (Loan) reduces the risk of commitment.",
    type: 'choice',
    options: [
      { text: 'That sounds good', intent: 'positive' }, 
      { text: 'No, I need cash', intent: 'negative' }
    ],
    category: 'Investment'
  },

  // --- Closing ---
  'Closing_Soft': {
    id: 'Closing_Soft',
    text: "Soft Close - Calculation",
    agentScript: "Great. If you invest ₹1 Lakh today, it grows to approx ₹1.35 Lakhs in just 42 months. Shall I send you a secure link to lock this rate?",
    persuasionTip: "Use 'Visualisation'. Concrete numbers are more persuasive than percentages.",
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
    agentScript: "Since you are happy with the returns, I can help you book this right now on the call. It only takes 2 minutes and you start earning interest from today. Shall we proceed?",
    persuasionTip: "The 'Assumptive Close'. Minimize friction and assume they want to proceed to reduce hesitation.",
    type: 'choice',
    options: [
      { text: 'Proceed', intent: 'positive' }, 
      { text: 'Call me later', intent: 'neutral' }
    ],
    category: 'Closing'
  },

  // --- End States ---
  'End_Success': {
    id: 'End_Success',
    text: "Success",
    agentScript: "Excellent! I have initiated the booking. You will receive an OTP shortly.",
    persuasionTip: "Congratulations! Interaction successful.",
    type: 'choice',
    options: [
      { text: 'End Call', intent: 'neutral' }
    ],
    category: 'Closing'
  },
  'End_Neutral': {
    id: 'End_Neutral',
    text: "Neutral",
    agentScript: "No problem. I have sent the detailed brochure to your email. Please verify it at your convenience. Thank you.",
    persuasionTip: "Leave the door open. A neutral exit is better than a pushy failure.",
    type: 'choice',
    options: [
      { text: 'End Call', intent: 'neutral' }
    ],
    category: 'Closing'
  }
};

export class AIDecisionEngine {
  private state: AIState;

  constructor() {
    this.state = {
      currentNodeId: 'Start',
      history: [],
      scores: { intent: 40, eligibility: 80 }, // Start with mid intent (drop-off) but high eligibility
      customerProfile: { intentType: 'Investment' },
      recommendation: "FD - 9.40% Special Scheme",
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
    
    // Update History with Script context
    this.state.history.push({ 
        question: currentNode.text, // Internal label
        script: currentNode.agentScript, // What was said
        answer: answerText 
    });

    // Scoring Updates
    if (answerText.includes('Not interested') || answerText.includes('No')) {
        this.state.scores.intent -= 20;
    } else {
        this.state.scores.intent += 15;
    }
    this.state.scores.intent = Math.min(100, Math.max(0, this.state.scores.intent));

    // Transition Logic
    let nextNodeId = '';

    if (currentNode.id === 'Start') {
        if (answerText === 'Just Checking Rates') nextNodeId = 'Obj_Browsing';
        else if (answerText === 'Rates seem low') nextNodeId = 'Obj_RatesLow';
        else if (answerText === 'Concerned about Safety') nextNodeId = 'Obj_Safety';
        else if (answerText === 'Need money soon') nextNodeId = 'Obj_Liquidity';
    } 
    
    // Objection Handling Transitions
    else if (currentNode.id === 'Obj_Browsing') {
        nextNodeId = answerText === 'Tell me more' ? 'Closing_Soft' : 'End_Neutral';
    }
    else if (currentNode.id === 'Obj_RatesLow') {
        nextNodeId = answerText === 'Show Calculation' ? 'Closing_Soft' : 'End_Neutral';
    }
    else if (currentNode.id === 'Obj_Safety') {
        nextNodeId = answerText === 'Okay, that helps' ? 'Closing_Hard' : 'End_Neutral';
    }
    else if (currentNode.id === 'Obj_Liquidity') {
        nextNodeId = answerText === 'That sounds good' ? 'Closing_Soft' : 'End_Neutral';
    }

    // Closing Transitions
    else if (currentNode.id === 'Closing_Soft') {
        nextNodeId = answerText === 'Yes, send link' ? 'End_Success' : 'End_Neutral';
    }
    else if (currentNode.id === 'Closing_Hard') {
        nextNodeId = answerText === 'Proceed' ? 'End_Success' : 'End_Neutral';
    }

    if (nextNodeId && QUESTIONS[nextNodeId]) {
      this.state.currentNodeId = nextNodeId;
    }

    return this.state;
  }
}
