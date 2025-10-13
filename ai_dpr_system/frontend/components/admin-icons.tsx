'use client'

import { 
  Home, 
  Users, 
  Settings, 
  BarChart, 
  FileText, 
  AlertTriangle, 
  Database,
  Shield,
  HelpCircle,
  Eye
} from 'lucide-react'

export const AdminIcons = {
  Dashboard: Home,
  Users: Users,
  Settings: Settings,
  Analytics: BarChart,
  Reports: FileText,
  RiskAlerts: AlertTriangle,
  Database: Database,
  Security: Shield,
  Help: HelpCircle,
  Monitoring: Eye
}

export type AdminIconName = keyof typeof AdminIcons