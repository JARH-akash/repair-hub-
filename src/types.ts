export type UserRole = 'customer' | 'technician' | 'admin' | 'developer';

export interface UserAccount {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  specializations?: string[];
  experienceYears?: number;
  certifications?: string;
  department?: string;
  cvFileName?: string;
  cvFileUrl?: string;
  cvUploadedAt?: string;
  avatar?: string;
  createdAt: string;
  is2FAEnabled?: boolean;
}

export type RepairStatus =
  | 'booked'
  | 'assigned'
  | 'en_route'
  | 'diagnosing'
  | 'estimate_pending'
  | 'approved'
  | 'repairing'
  | 'qc_testing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type DeviceCategory =
  | 'mobile'
  | 'laptop'
  | 'tablet'
  | 'tv_audio'
  | 'fridge'
  | 'ac'
  | 'console'
  | 'appliance'
  | 'wearable';

export type ServiceMode = 'doorstep' | 'pickup_drop' | 'walk_in' | 'business_fleet';

export interface EstimateItem {
  id: string;
  description: string;
  partId?: string;
  partName: string;
  unitCost: number;
  laborCost: number;
  quantity: number;
  total: number;
}

export interface StatusHistoryItem {
  status: RepairStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface RepairJob {
  id: string;
  trackingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  locationCoords?: { lat: number; lng: number };
  deviceCategory: DeviceCategory;
  deviceModel: string;
  serialNumber?: string;
  problemDescription: string;
  issuePhotos: string[];
  serviceMode: ServiceMode;
  preferredDate: string;
  preferredTimeSlot: string;
  status: RepairStatus;
  statusHistory: StatusHistoryItem[];
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianCoords?: { lat: number; lng: number };
  technicianEtaMinutes?: number;
  otpCode: string;
  estimate: {
    items: EstimateItem[];
    subtotal: number;
    tax: number;
    total: number;
    approved: boolean;
    approvedAt?: string;
  };
  payment: {
    status: 'pending' | 'paid' | 'refunded';
    method?: 'card' | 'upi' | 'cash' | 'netbanking';
    transactionId?: string;
    paidAt?: string;
    amount: number;
  };
  warranty: {
    isActive: boolean;
    warrantyDays: number;
    validUntil?: string;
    certificateNumber?: string;
  };
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  completedJobsCount: number;
  activeJobId?: string;
  status: 'online' | 'in_transit' | 'busy' | 'offline';
  location: { lat: number; lng: number; address: string };
  skills: DeviceCategory[];
}

export interface InventoryItem {
  id: string;
  partName: string;
  partNumber: string;
  category: DeviceCategory;
  compatibleModels: string[];
  stockQuantity: number;
  minStockThreshold: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  lastRestocked: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  messages: {
    id: string;
    sender: 'customer' | 'support' | 'ai';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface AIDiagnosticResult {
  deviceModel: string;
  symptomsAnalyzed: string;
  probableCauses: {
    issue: string;
    probability: number;
    description: string;
  }[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  recommendedParts: {
    partName: string;
    estimatedCost: number;
  }[];
  estimatedPriceRange: {
    min: number;
    max: number;
  };
  diyTroubleshootingSteps: string[];
  professionalRecommendation: string;
  safetyWarning?: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  activeRepairsCount: number;
  completedTodayCount: number;
  lowStockAlertsCount: number;
  slaComplianceRate: number;
  revenueByDay: { day: string; revenue: number; jobsCount: number }[];
  jobsByDeviceCategory: { category: string; count: number }[];
  jobsByStatus: { status: string; count: number }[];
}

// Developer Security & System Panel Interfaces
export interface DevSecurityAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  role: UserRole;
  ip: string;
  action: string;
  category: 'AUTH' | 'RBAC' | 'CONFIG' | 'BACKUP' | 'CACHE' | 'EMERGENCY' | 'DATA';
  severity: 'low' | 'info' | 'warn' | 'critical';
  details: string;
  result: 'success' | 'denied' | 'blocked';
}

export interface DevSystemMetrics {
  cpuPercent: number;
  cpuCoresCount: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  diskUsedGB: number;
  diskTotalGB: number;
  networkInKbps: number;
  networkOutKbps: number;
  processUptimeSec: number;
  activeConnectionsCount: number;
  loadAverage: [number, number, number];
  nodeVersion: string;
  osPlatform: string;
}

export interface DevDatabaseMetrics {
  connectionPool: { active: number; idle: number; max: number };
  slowQueriesCount: number;
  averageQueryTimeMs: number;
  totalQueriesCount: number;
  tablesSizeMB: number;
  slowQueries: { id: string; query: string; durationMs: number; timestamp: string; caller: string }[];
}

export interface DevApiLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  ip: string;
  userAgent: string;
  errorTrace?: string;
}

export interface DevPaymentLog {
  id: string;
  timestamp: string;
  amount: number;
  provider: 'Razorpay' | 'UPI' | 'Card' | 'Netbanking';
  status: 'captured' | 'failed' | 'refunded';
  transactionId: string;
  customerEmail: string;
  latencyMs: number;
  failureReason?: string;
}

export interface DevBackupItem {
  id: string;
  timestamp: string;
  sizeKB: number;
  hash: string;
  createdBy: string;
  status: 'completed' | 'restoring' | 'verified';
  type: 'automated' | 'manual';
  downloadUrl?: string;
}

export interface DevFeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: 'all' | 'production' | 'staging';
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface DevCrashLog {
  id: string;
  timestamp: string;
  title: string;
  component: string;
  stackTrace: string;
  occurrences: number;
  status: 'unresolved' | 'investigating' | 'resolved';
  affectedRole: string;
}

export interface DevHealthCheck {
  name: string;
  component: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  lastCheck: string;
  details: string;
}

export interface DevSession {
  id: string;
  userId: string;
  userEmail: string;
  ip: string;
  location: string;
  userAgent: string;
  authTime: string;
  is2FAVerified: boolean;
  expiresAt: string;
  tier: 'Tier 0 - Master Security';
}

export interface DevAIInsight {
  timestamp: string;
  threatLevel: 'low' | 'medium' | 'high';
  securitySummary: string;
  revenueForecastNext30Days: number;
  technicianEfficiencyScore: number;
  recommendedActions: string[];
  vulnerabilitiesDetected: { title: string; risk: string; remediation: string }[];
}

