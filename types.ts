
// 3.2.1 Customer Identity
export interface Customer {
  id: string;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  segment: 'Retail' | 'HNI' | 'Corporate';
  riskCategory: 'Low' | 'Medium' | 'High';
  creditScore: string; // e.g., "750-800"
  kycStatus: 'Verified' | 'Pending' | 'Expired';
  status: 'Active' | 'Inactive' | 'Dormant' | 'Blacklisted';
  mobile: string;
  email: string;
  pan: string;
  address: string;
  relationshipScore: number; // 0-100
  // 3.2.10 Sales Opportunities
  preApprovedOffers: string[]; 
}

// Relationship Summary (Active & Past)
export interface ProductRelationship {
  id: string;
  category: 'Loan' | 'Investment' | 'Service';
  productName: string;
  accountNumber: string;
  status: 'Active' | 'Closed' | 'Matured' | 'Surrendered' | 'Overdue';
  amount: number; // Outstanding or Invested
  startDate: string;
  endDate?: string;
  nextActionDate?: string;
  alerts?: string[]; // Specific alerts for this product
}

// Offers & Opportunities
export interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'Pre-approved' | 'Top-up' | 'Cross-sell' | 'Retention';
  probability: number; // 0-100
  reason: string;
  pitch: string;
}

// Communication Actions
export interface CommunicationTemplate {
  id: string;
  name: string;
  channel: 'SMS' | 'Email' | 'WhatsApp';
  category: 'Service' | 'Sales' | 'Collections';
  content: string;
}

// 3.2.3 Lending Portfolio
export enum LoanType {
  HOME = 'Home Loan',
  AUTO = 'Auto Loan',
  PERSONAL = 'Personal Loan',
  GOLD = 'Gold Loan'
}

export interface Loan {
  id: string;
  type: LoanType;
  accountNumber: string;
  holderName: string; // Name of borrower
  sanctionedAmount: number;
  outstandingPrincipal: number;
  interestRate: number;
  emiAmount: number;
  nextEmiDate: string;
  dpd: number; // Days Past Due
  tenureMonths: number;
  startDate: string;
  collateral?: string; // For secured loans
  // C360 Document Flags
  hasLoanStatement?: boolean;
  hasLedger?: boolean;
  hasSanctionLetter?: boolean;
  hasRepaymentSchedule?: boolean;
}

// 3.2.4 Investment Portfolio
// Detailed FD Product structure based on C360 spec
export interface FDProduct {
  id: string;
  type: 'FD' | 'RD';
  certificateNumber: string;
  holderName: string; // Name of holder
  nominee?: string; // Name of nominee
  folioNo: string;
  acknowledgementNo: string;
  refundAckNo?: string;
  chequeNo?: string;
  amount: number;
  interestRate: number;
  maturityDate: string;
  maturityAmount: number;
  status: 'Active' | 'Matured' | 'Closed';
  // Document Flags
  hasTdsCertificate: boolean;
  hasForm15G: boolean;
  hasSOA: boolean;
  hasLedger: boolean;
}

// Insurance Product structure based on C360 spec
export interface InsuranceProduct {
  id: string;
  productName: string;
  policyNo: string;
  holderName: string; // Added holder name
  premiumPaid: string;
  nextDueDate: string;
  acknowledgementNo?: string;
  srNo?: string;
  hasPolicyDocument: boolean;
}

// Simplified Investment interface for backward compatibility if needed, 
// but we prefer FDProduct for the detailed view.
export interface Investment extends Partial<FDProduct> {
  accountNumber: string; // mapping certificateNumber to this for generic views
}

// Drop-off / In-progress Investment Details
export interface DropOffDetails {
  applicationId: string;
  productType: 'FD' | 'Loan' | 'Insurance';
  enteredAmount?: string;
  enteredTenure?: string;
  kycProgress: string; // e.g., "60%"
  stage: string; // e.g., "KYC Pending"
  lastActivity?: string;
  capturedData?: {
      name: string;
      mobile: string;
      pan?: string;
      paymentMethod?: string;
  };
}

// 3.2.7 Communication History (Omni-channel)
export interface Interaction {
  id: string;
  type: 'Call' | 'Email' | 'SMS' | 'Visit' | 'Web' | 'App' | 'System' | 'WhatsApp';
  direction: 'Inbound' | 'Outbound' | 'N/A';
  date: string;
  summary: string;
  agentName?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Angry';
  metadata?: {
    templateUsed?: string;
    deliveryStatus?: 'Sent' | 'Delivered' | 'Read' | 'Failed';
    recordingUrl?: string;
  };
}

// Call Logs (CDR) for Agent/Manager History
export interface CallLog {
  id: string;
  userId: string;
  callerId: string;
  callDate: string; // DATETIME
  campaignName: string;
  remarks: string;
  disposition: string;
  subDisposition: string;
  leadId: string;
  leadDate: string; // DATETIME
  callActiveTime: string; // TIME (Predictive)
  opsActiveTime: string; // TIME (Preview)
}

// 3.2.8 Service Requests
export interface Ticket {
  id: string;
  type: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdDate: string;
  subject: string;
  assignedTo?: string;
  slaDue?: string;
}

// 3.6 Campaign Management
export interface Campaign {
  id: string;
  name: string;
  type: 'Sales' | 'Collection' | 'Service' | 'Survey';
  status: 'Running' | 'Paused' | 'Completed';
  totalLeads: number;
  contacted: number;
  converted: number;
  startDate: string;
  endDate: string;
}

// 3.8.3 Audit Trail & Admin
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
}

export interface SystemUser {
  id: string;
  name: string;
  role: 'Agent' | 'Supervisor' | 'Manager' | 'Admin';
  status: 'Active' | 'Inactive';
  email: string;
  lastLogin: string;
}

export interface DashboardStats {
  totalCalls: number;
  avgHandleTime: string; // mm:ss
  csatScore: number;
  conversionRate: number;
}

// --- AI Engine Types ---

export interface AnswerOption {
  text: string;
  intent: 'positive' | 'negative' | 'objection' | 'neutral';
}

export interface QuestionNode {
  id: string;
  text: string; // Internal logic description or backup text
  agentScript?: string; // What the agent should say
  persuasionTip?: string; // Why they should say it
  options: AnswerOption[]; // Changed to structured options
  type: 'choice' | 'text' | 'currency';
  category?: 'Identity' | 'Loan' | 'Investment' | 'Closing';
}

export interface AIState {
  currentNodeId: string;
  history: { question: string; answer: string; script?: string }[];
  scores: {
    intent: number;
    eligibility: number;
  };
  customerProfile: Partial<LeadProfile>;
  recommendation?: string;
  objectionPrediction?: string;
}

export interface LeadProfile {
  intentType: 'Loan' | 'Investment' | 'Unknown';
  income?: string;
  employmentType?: 'Salaried' | 'Self-Employed';
  urgency?: 'High' | 'Medium' | 'Low';
  existingLoans?: boolean;
}
