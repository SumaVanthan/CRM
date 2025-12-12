

import { Customer, Loan, LoanType, FDProduct, InsuranceProduct, DropOffDetails, Interaction, Ticket, Campaign, AuditLog, SystemUser, ProductRelationship, Offer, CommunicationTemplate, CallLog } from '../types';

export const mockCustomer: Customer = {
  id: 'CUST902113',
  fullName: 'Arun Prakash',
  dob: '15/08/1985',
  gender: 'Male',
  segment: 'Retail',
  riskCategory: 'Low',
  creditScore: '750-799',
  kycStatus: 'Verified',
  status: 'Active',
  mobile: '+91-9876543210',
  email: 'arun.prakash@example.com',
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
    holderName: 'Arun Prakash & Priya Prakash',
    sanctionedAmount: 4500000,
    outstandingPrincipal: 3850000,
    interestRate: 8.55,
    emiAmount: 38500,
    nextEmiDate: '2023-11-05',
    dpd: 0,
    tenureMonths: 240,
    startDate: '2019-05-10',
    collateral: 'Residential Property - Mumbai',
    hasLoanStatement: true,
    hasLedger: true,
    hasSanctionLetter: true,
    hasRepaymentSchedule: true
  },
  {
    id: 'LN-PL-002',
    type: LoanType.PERSONAL,
    accountNumber: 'PL-8842-9981',
    holderName: 'Arun Prakash',
    sanctionedAmount: 500000,
    outstandingPrincipal: 120000,
    interestRate: 11.5,
    emiAmount: 14500,
    nextEmiDate: '2023-11-05',
    dpd: 32, // Showing some overdue for UI demo
    tenureMonths: 36,
    startDate: '2021-02-15',
    hasLoanStatement: true,
    hasLedger: true
  }
];

export const mockFDProducts: FDProduct[] = [
  {
    id: 'FD-7712-0091',
    type: 'FD',
    certificateNumber: 'FD-2025-778812',
    holderName: 'Arun Prakash',
    nominee: 'Priya Prakash',
    folioNo: 'FOL99871',
    acknowledgementNo: 'ACK-FD-12881',
    chequeNo: 'CHQ112398',
    amount: 200000,
    interestRate: 7.1,
    maturityDate: '2024-06-20',
    maturityAmount: 228000,
    status: 'Active',
    hasTdsCertificate: true,
    hasForm15G: false,
    hasSOA: true,
    hasLedger: true
  }
];

export const mockInsuranceProducts: InsuranceProduct[] = [
    {
        id: 'INS-001',
        productName: 'Life Insurance',
        policyNo: 'POL447712',
        holderName: 'Arun Prakash',
        premiumPaid: '12500',
        nextDueDate: '2025-02-10',
        acknowledgementNo: 'ACK-INS-099',
        hasPolicyDocument: true
    },
    {
        id: 'INS-002',
        productName: 'Health Insurance',
        policyNo: 'HLT-998811',
        holderName: 'Priya Prakash',
        premiumPaid: '18000',
        nextDueDate: '2024-12-15',
        acknowledgementNo: 'ACK-INS-105',
        hasPolicyDocument: true
    }
];

// Re-mapping for backward compat in overview (if needed) or used directly
export const mockInvestments: any[] = mockFDProducts.map(fd => ({
  ...fd,
  accountNumber: fd.certificateNumber
}));

// Scenario 1: ETB Drop-off
export const mockETBDropOff: DropOffDetails = {
    applicationId: 'FD-NEW-1281',
    productType: 'FD',
    enteredAmount: '25000',
    enteredTenure: '12 months',
    kycProgress: '60%',
    stage: 'Payment Pending',
    lastActivity: '2 hours ago',
    capturedData: {
        name: 'Arun Prakash',
        mobile: '9876543210'
    }
};

// Scenario 2: NTB Drop-off
export const mockNTBDropOff: DropOffDetails = {
    applicationId: 'LN-APP-8821',
    productType: 'Loan',
    enteredAmount: '500000',
    kycProgress: '20%',
    stage: 'KYC Pending',
    lastActivity: '1 day ago',
    capturedData: {
        name: 'Vikram Singh',
        mobile: '9988776655',
        pan: 'ABCDE1234F',
        paymentMethod: 'UPI'
    }
};


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
  { id: 'TMP-003', name: 'Statement Link', channel: 'WhatsApp', category: 'Service', content: 'Dear {name}, here is the link to your requested document: {link}. Password is your DOB.' },
  { id: 'TMP-004', name: 'Drop-off Recovery', channel: 'WhatsApp', category: 'Sales', content: 'Hi {name}, we noticed you tried to book an FD of {amount}. Click here to complete the process: {link}' },
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

// Call Logs (CDR)
export const mockCallLogs: CallLog[] = [
    {
        id: 'CDR-1001',
        userId: 'AGT-2022',
        callerId: '9876543210',
        callDate: '2023-10-30 10:30:00',
        campaignName: 'Diwali_Offer_2025',
        remarks: 'Customer asked for callback in evening',
        disposition: 'Customer Busy',
        subDisposition: 'Asked to call back',
        leadId: 'LD-2023-889',
        leadDate: '2023-10-25',
        callActiveTime: '00:04:12',
        opsActiveTime: '00:01:30'
    },
    {
        id: 'CDR-1002',
        userId: 'AGT-2022',
        callerId: '9988776655',
        callDate: '2023-10-30 09:45:00',
        campaignName: 'PL_Upsell_Q3',
        remarks: 'Interested in PL, forwarded to Senior Manager',
        disposition: 'Resolved',
        subDisposition: 'Different Loan product Request',
        leadId: 'LD-2023-992',
        leadDate: '2023-10-26',
        callActiveTime: '00:06:20',
        opsActiveTime: '00:02:10'
    },
    {
        id: 'CDR-1003',
        userId: 'AGT-2023',
        callerId: '8877665544',
        callDate: '2023-10-30 11:15:00',
        campaignName: 'Collections_Soft',
        remarks: 'Promised to pay by month end',
        disposition: 'Promise to Pay',
        subDisposition: 'Online Transfer',
        leadId: 'LD-2023-105',
        leadDate: '2023-10-24',
        callActiveTime: '00:03:45',
        opsActiveTime: '00:01:00'
    },
    {
        id: 'CDR-1004',
        userId: 'AGT-2024',
        callerId: '7766554433',
        callDate: '2023-10-30 09:10:00',
        campaignName: 'Welcome_Call',
        remarks: 'Call disconnected abruptly',
        disposition: 'Customer Busy',
        subDisposition: 'Call disconnected',
        leadId: 'LD-2023-771',
        leadDate: '2023-10-29',
        callActiveTime: '00:00:45',
        opsActiveTime: '00:00:15'
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
