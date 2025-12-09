import { BarChart3, LayoutDashboard, Phone, Ticket, Users, FileText, Settings, ShieldAlert } from "lucide-react";

export const APP_NAME = "FinConnect CRM";

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customer360', label: 'Customer 360', icon: Users },
  { id: 'tickets', label: 'Service Requests', icon: Ticket },
  { id: 'campaigns', label: 'Campaigns', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'admin', label: 'Admin', icon: Settings },
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, text: "High Priority: 3 SLA Breached Tickets", type: "error" },
  { id: 2, text: "System: Upcoming maintenance at 02:00 AM", type: "info" },
];