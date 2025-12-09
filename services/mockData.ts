
import { Customer, Loan, LoanType, Investment, Interaction, Ticket, Campaign, AuditLog, SystemUser, ProductRelationship, Offer, CommunicationTemplate } from '../types';

export const mockCustomer: Customer = {
  id: 'CUST-884201',
  fullName: 'Rajesh Kumar Verma',
  dob: '15/08/1985',
  gender: 'Male',
  segment: 'Retail',
  riskCategory: 'Low',
  creditScore: '750-799',
  kycStatus: 'Verified',
  status: 'Active',
  mobile: '+91-9876543210',
  email: 'rajesh.verma85@gmail.com',
  pan: 'ABCDE1234F',
  address: 'Flat 402, Sunshine Heights, Andheri West, Mumbai, Maharashtra',
  relationshipScore: 85,
  preApprovedOffers: ['Pre-approved Personal Loan ₹5L', 'Credit Card Upgrade']
};

export const mockNTBCustomer: Customer = {
  id: 'LEAD-998877',
  fullName: 'Vikram Singh (Lead)',
  dob: '',
  gender: 'Male',
  segment: 'Retail',
  riskCategory: 'Medium', // Default for NTB
  creditScore: 'Unknown',
  kycStatus: 'Pending',
  status: 'Active',
  mobile: '+91-9988776655',
  email: 'vikram.singh@gmail.com',
  pan: 'Unknown',
  address: 'Mumbai, Maharashtra (Detected via IP)',
  relationshipScore: 0,
  preApprovedOffers: []
};

export const mockLoans: Loan[] = [
  {
    id: 'LN-HM-001',
    type: LoanType.HOME,
    accountNumber: 'HML-8842-1102',
    sanctionedAmount: 4500000,
    outstandingPrincipal: 3850000,
    interestRate: 8.55,
    emiAmount: 38500,
    nextEmiDate: '2023-11-05',
    dpd: 0,
    tenureMonths: 240,
    startDate: '2019-05-10',
    collateral: 'Residential Property - Mumbai'
  },
  {
    id: 'LN-PL-002',
    type: LoanType.PERSONAL,
    accountNumber: 'PL-8842-9981',
    sanctionedAmount: 500000,
    outstandingPrincipal: 120000,
    interestRate: 11.5,
    emiAmount: 14500,
    nextEmiDate: '2023-11-05',
    dpd: 32, // Showing some overdue for UI demo
    tenureMonths: 36,
    startDate: '2021-02-15'
  }
];

export const mockInvestments: Investment[] = [
  {
    id: 'INV-FD-001',
    type: 'FD',
    accountNumber: 'FD-7712-0091',
    amount: 200000,
    interestRate: 7.1,
    maturityDate: '2024-06-20',
    maturityAmount: 228000
  }
];

// Relationship Summary Data
export const mockActiveProducts: ProductRelationship[] = [
  { id: '1', category: 'Loan', productName: 'Home Loan', accountNumber: 'HML-8842-1102', status: 'Active', amount: 3850000, startDate: '2019-05-10', nextActionDate: '2023-11-05' },
  { id: '2', category: 'Loan', productName: 'Personal Loan', accountNumber: 'PL-8842-9981', status: 'Overdue', amount: 120000, startDate: '2021-02-15', nextActionDate: '2023-11-05', alerts: ['EMI Overdue: 32 Days'] },
  { id: '3', category: 'Investment', productName: 'Fixed Deposit', accountNumber: 'FD-7712-0091', status: 'Active', amount: 200000, startDate: '2022-06-20', endDate: '2024-06-20' },
];

export const mockPastProducts: ProductRelationship[] = [
  { id: '4', category: 'Loan', productName: 'Two Wheeler Loan', accountNumber: 'TWL-5541-0022', status: 'Closed', amount: 0, startDate: '2015-03-10', endDate: '2017-03-10' },
  { id: '5', category: 'Investment', productName: 'Recurring Deposit', accountNumber: 'RD-3321-9988', status: 'Matured', amount: 50000, startDate: '2020-01-01', endDate: '2021-01-01' },
];

export const mockOffers: Offer[] = [
  { 
    id: 'OFF-001', 
    title: 'Personal Loan Top-up', 
    description: 'Eligible for ₹2L additional top-up on existing PL', 
    type: 'Top-up', 
    probability: 85, 
    reason: 'Consistent repayment on Home Loan + Low leverage', 
    pitch: "Sir, since you've been a valued customer for 4 years, we can release an additional ₹2 Lakhs into your account within 4 hours. No new paperwork." 
  },
  { 
    id: 'OFF-002', 
    title: 'Senior Citizen FD for Parents', 
    description: 'Special 0.5% extra interest for family members', 
    type: 'Cross-sell', 
    probability: 60, 
    reason: 'Customer age profile suggests dependent parents', 
    pitch: "Did you know you can book an FD for your parents and get 0.5% extra interest? It's fully digital." 
  }
];

export const mockTemplates: CommunicationTemplate[] = [
  { id: 'TMP-001', name: 'Payment Reminder (Gentle)', channel: 'SMS', category: 'Collections', content: 'Dear Customer, your EMI of Rs. {emi_amount} is due on {due_date}. Please pay via app to avoid charges.' },
  { id: 'TMP-002', name: 'Top-up Offer Details', channel: 'Email', category: 'Sales', content: 'Hi {name}, Congratulations! You are eligible for a Pre-approved Top-up Loan of Rs. {amount}. Click here to avail: {link}' },
  { id: 'TMP-003', name: 'Statement Link', channel: 'SMS', category: 'Service', content: 'Dear {name}, here is the link to your requested loan statement: {link}. Password is your DOB.' },
];

export const mockInteractions: Interaction[] = [
  {
    id: 'INT-001',
    type: 'Call',
    direction: 'Inbound',
    date: '2023-10-25 10:30 AM',
    summary: 'Customer enquired about foreclosure charges for Personal Loan.',
    agentName: 'Sarah Jenkins',
    sentiment: 'Neutral',
    metadata: { recordingUrl: '#' }
  },
  {
    id: 'INT-002',
    type: 'Email',
    direction: 'Outbound',
    date: '2023-10-25 10:45 AM',
    summary: 'Sent foreclosure statement via email.',
    agentName: 'System',
    metadata: { templateUsed: 'Foreclosure Statement', deliveryStatus: 'Delivered' }
  },
  {
    id: 'INT-003',
    type: 'Call',
    direction: 'Outbound',
    date: '2023-10-20 02:15 PM',
    summary: 'Collection follow-up for PL overdues. Customer promised to pay by 28th.',
    agentName: 'Mike Ross',
    sentiment: 'Negative'
  },
  {
    id: 'INT-004',
    type: 'App',
    direction: 'N/A',
    date: '2023-10-28 08:15 PM',
    summary: 'Customer checked "Loan Statement" section in Mobile App',
    agentName: 'System'
  },
  {
    id: 'INT-005',
    type: 'SMS',
    direction: 'Outbound',
    date: '2023-10-29 09:00 AM',
    summary: 'Payment Reminder SMS Sent',
    agentName: 'System',
    metadata: { deliveryStatus: 'Delivered' }
  }
];

// NTB Digital Footprint
export const mockNTBInteractions: Interaction[] = [
    {
      id: 'INT-NTB-001',
      type: 'Web',
      direction: 'N/A',
      date: '2023-10-30 10:05 AM',
      summary: 'Visited "Fixed Deposit" Product Page. Spent 4 mins.',
      agentName: 'System',
      sentiment: 'Neutral'
    },
    {
      id: 'INT-NTB-002',
      type: 'Web',
      direction: 'N/A',
      date: '2023-10-30 10:10 AM',
      summary: 'Used "FD Calculator". Input: 5L for 3 Years.',
      agentName: 'System',
      sentiment: 'Positive'
    },
    {
        id: 'INT-NTB-003',
        type: 'Web',
        direction: 'N/A',
        date: '2023-10-30 10:15 AM',
        summary: 'Started Application Form. Dropped off at "KYC Upload" step.',
        agentName: 'System',
        sentiment: 'Negative'
    }
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-2023-991',
    type: 'Statement Request',
    status: 'Resolved',
    priority: 'Low',
    createdDate: '2023-10-25',
    subject: 'Request for last 6 months loan statement',
    assignedTo: 'Sarah Jenkins',
    slaDue: '2023-10-26'
  },
  {
    id: 'TKT-2023-998',
    type: 'Dispute',
    status: 'In Progress',
    priority: 'High',
    createdDate: '2023-10-28',
    subject: 'Incorrect late payment charges applied',
    assignedTo: 'Mike Ross',
    slaDue: '2023-10-29'
  },
  {
    id: 'TKT-2023-1002',
    type: 'Product Query',
    status: 'Open',
    priority: 'Medium',
    createdDate: '2023-10-30',
    subject: 'Enquiry about Gold Loan interest rates',
    assignedTo: 'Unassigned',
    slaDue: '2023-10-31'
  },
  {
    id: 'TKT-2023-1005',
    type: 'Complaint',
    status: 'Open',
    priority: 'Critical',
    createdDate: '2023-10-30',
    subject: 'Harassment complaint against recovery agent',
    assignedTo: 'Supervisor Team',
    slaDue: '2023-10-30'
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'CMP-PL-UPSELL',
    name: 'Q3 Personal Loan Upsell',
    type: 'Sales',
    status: 'Running',
    totalLeads: 5000,
    contacted: 3200,
    converted: 450,
    startDate: '2023-10-01',
    endDate: '2023-12-31'
  },
  {
    id: 'CMP-COL-SOFT',
    name: 'Soft Collections (0-30 DPD)',
    type: 'Collection',
    status: 'Running',
    totalLeads: 1200,
    contacted: 850,
    converted: 600, // PTP
    startDate: '2023-10-01',
    endDate: '2023-10-31'
  },
  {
    id: 'CMP-KYC-REM',
    name: 'KYC Update Reminder',
    type: 'Service',
    status: 'Paused',
    totalLeads: 2000,
    contacted: 150,
    converted: 80,
    startDate: '2023-11-01',
    endDate: '2023-11-15'
  }
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'LOG-001', timestamp: '2023-10-30 10:15:22', user: 'Agent Smith', action: 'Login', module: 'Auth', details: 'Successful login from IP 192.168.1.10' },
  { id: 'LOG-002', timestamp: '2023-10-30 10:20:05', user: 'Agent Smith', action: 'View PII', module: 'Customer 360', details: 'Unmasked Mobile Number for CUST-884201' },
  { id: 'LOG-003', timestamp: '2023-10-30 11:05:00', user: 'Manager John', action: 'Export', module: 'Reports', details: 'Exported "Agent Performance Report"' },
  { id: 'LOG-004', timestamp: '2023-10-30 11:30:45', user: 'Agent Smith', action: 'Update', module: 'Tickets', details: 'Changed status of TKT-2023-998 to In Progress' },
];

export const mockUsers: SystemUser[] = [
  { id: 'AGT-2022', name: 'Agent Smith', role: 'Agent', status: 'Active', email: 'smith@finconnect.com', lastLogin: '2023-10-30 10:15:22' },
  { id: 'SUP-1001', name: 'Manager John', role: 'Manager', status: 'Active', email: 'john@finconnect.com', lastLogin: '2023-10-30 09:00:00' },
  { id: 'AGT-2023', name: 'Sarah Jenkins', role: 'Agent', status: 'Active', email: 'sarah@finconnect.com', lastLogin: '2023-10-30 10:00:00' },
  { id: 'AGT-2024', name: 'Mike Ross', role: 'Agent', status: 'Inactive', email: 'mike@finconnect.com', lastLogin: '2023-10-28 18:00:00' },
];
