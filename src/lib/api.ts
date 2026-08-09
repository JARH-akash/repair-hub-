import {
  AIDiagnosticResult,
  AnalyticsData,
  DevAIInsight,
  DevApiLog,
  DevBackupItem,
  DevCrashLog,
  DevDatabaseMetrics,
  DevFeatureFlag,
  DevPaymentLog,
  DevSecurityAuditLog,
  DevSession,
  DevSystemMetrics,
  InventoryItem,
  RepairJob,
  SupportTicket,
  Technician,
  UserAccount,
  UserRole,
} from '../types';

const BASE_URL = '';

async function fetchJSON<T>(url: string, options?: RequestInit, devToken?: string, retries = 2): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (devToken) {
    headers['X-Dev-Token'] = devToken;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch {
          // Ignore JSON parse error on non-json error responses
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (err: any) {
      const isNetworkError =
        err?.name === 'TypeError' ||
        err?.message?.includes('Failed to fetch') ||
        err?.message?.includes('NetworkError');

      if (attempt < retries && isNetworkError) {
        await new Promise((res) => setTimeout(res, 300 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Request failed after retries');
}

export const api = {
  // Health
  async checkHealth() {
    return fetchJSON<{ status: string; service: string }>('/api/health');
  },

  // Repair Jobs
  async getRepairs(params?: {
    status?: string;
    query?: string;
    trackingCode?: string;
    customerId?: string;
    technicianId?: string;
  }): Promise<RepairJob[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.query) queryParams.set('query', params.query);
    if (params?.trackingCode) queryParams.set('trackingCode', params.trackingCode);
    if (params?.customerId) queryParams.set('customerId', params.customerId);
    if (params?.technicianId) queryParams.set('technicianId', params.technicianId);

    const qs = queryParams.toString();
    return fetchJSON<RepairJob[]>(`/api/repairs${qs ? `?${qs}` : ''}`);
  },

  async getRepairById(id: string): Promise<RepairJob> {
    return fetchJSON<RepairJob>(`/api/repairs/${id}`);
  },

  async createBooking(bookingData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    deviceCategory: string;
    deviceModel: string;
    problemDescription: string;
    issuePhotos?: string[];
    serviceMode?: string;
    preferredDate?: string;
    preferredTimeSlot?: string;
  }): Promise<{ success: boolean; job: RepairJob }> {
    return fetchJSON<{ success: boolean; job: RepairJob }>('/api/repairs', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async updateRepairStatus(
    id: string,
    status: string,
    note?: string,
    updatedBy?: string
  ): Promise<{ success: boolean; job: RepairJob }> {
    return fetchJSON<{ success: boolean; job: RepairJob }>(`/api/repairs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, updatedBy }),
    });
  },

  async approveEstimate(id: string): Promise<{ success: boolean; job: RepairJob }> {
    return fetchJSON<{ success: boolean; job: RepairJob }>(`/api/repairs/${id}/approve-estimate`, {
      method: 'POST',
    });
  },

  async verifyOtp(id: string, otp: string): Promise<{ success: boolean; job: RepairJob }> {
    return fetchJSON<{ success: boolean; job: RepairJob }>(`/api/repairs/${id}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
  },

  async processPayment(
    id: string,
    paymentMethod: string
  ): Promise<{ success: boolean; job: RepairJob }> {
    return fetchJSON<{ success: boolean; job: RepairJob }>(`/api/repairs/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    });
  },

  // Technicians
  async getTechnicians(): Promise<Technician[]> {
    return fetchJSON<Technician[]>('/api/technicians');
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    return fetchJSON<InventoryItem[]>('/api/inventory');
  },

  async updateStock(id: string, stockQuantity: number): Promise<{ success: boolean; item: InventoryItem }> {
    return fetchJSON<{ success: boolean; item: InventoryItem }>(`/api/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stockQuantity }),
    });
  },

  async updateInventoryItem(
    id: string,
    data: { stockQuantity?: number; costPrice?: number; sellingPrice?: number; partName?: string }
  ): Promise<{ success: boolean; item: InventoryItem }> {
    return fetchJSON<{ success: boolean; item: InventoryItem }>(`/api/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return fetchJSON<AnalyticsData>('/api/analytics');
  },

  // AI Diagnostics
  async diagnoseDevice(data: {
    deviceModel: string;
    problemDescription: string;
    issuePhotoBase64?: string;
  }): Promise<AIDiagnosticResult> {
    return fetchJSON<AIDiagnosticResult>('/api/ai/diagnose', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Support
  async getSupportTickets(): Promise<SupportTicket[]> {
    return fetchJSON<SupportTicket[]>('/api/support/tickets');
  },

  async createSupportTicket(ticketData: {
    customerName?: string;
    customerEmail?: string;
    subject: string;
    category?: string;
    message: string;
  }): Promise<{ success: boolean; ticket: SupportTicket }> {
    return fetchJSON<{ success: boolean; ticket: SupportTicket }>('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  // Auth / Accounts
  async getUsers(): Promise<any[]> {
    return fetchJSON<any[]>('/api/auth/users');
  },

  async registerAccount(data: {
    role: UserRole;
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    city?: string;
    address?: string;
    specializations?: string[];
    experienceYears?: number;
    certifications?: string;
    department?: string;
    cvFileName?: string;
    cvFileUrl?: string;
    adminSecurityKey?: string;
  }): Promise<{ success: boolean; message: string; user: any; token: string }> {
    return fetchJSON<{ success: boolean; message: string; user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async loginAccount(data: {
    email: string;
    password?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; message: string; user: any; token: string }> {
    return fetchJSON<{ success: boolean; message: string; user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateUserProfile(data: {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
    password?: string;
    is2FAEnabled?: boolean;
  }): Promise<{ success: boolean; message: string; user: UserAccount }> {
    return fetchJSON<{ success: boolean; message: string; user: UserAccount }>('/api/auth/profile/update', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // -------------------------------------------------------------
  // DEVELOPER PANEL SECURE API CALLS
  // -------------------------------------------------------------
  async devChallenge(email: string, developerPin: string): Promise<{ success: boolean; requires2FA: boolean; clientIp: string; message: string }> {
    return fetchJSON('/api/dev/auth/challenge', {
      method: 'POST',
      body: JSON.stringify({ email, developerPin }),
    });
  },

  async devVerify2FA(email: string, code2FA: string): Promise<{ success: boolean; token: string; user: UserAccount; session: DevSession }> {
    return fetchJSON('/api/dev/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ email, code2FA }),
    });
  },

  async getDevOverview(token: string): Promise<any> {
    return fetchJSON('/api/dev/overview', undefined, token);
  },

  async getDevServerMetrics(token: string): Promise<DevSystemMetrics> {
    return fetchJSON<DevSystemMetrics>('/api/dev/server-metrics', undefined, token);
  },

  async getDevDbMetrics(token: string): Promise<DevDatabaseMetrics> {
    return fetchJSON<DevDatabaseMetrics>('/api/dev/db-metrics', undefined, token);
  },

  async getDevApiLogs(token: string): Promise<DevApiLog[]> {
    return fetchJSON<DevApiLog[]>('/api/dev/api-logs', undefined, token);
  },

  async getDevPaymentLogs(token: string): Promise<DevPaymentLog[]> {
    return fetchJSON<DevPaymentLog[]>('/api/dev/payment-logs', undefined, token);
  },

  async getDevSecurityLogs(token: string): Promise<DevSecurityAuditLog[]> {
    return fetchJSON<DevSecurityAuditLog[]>('/api/dev/security-logs', undefined, token);
  },

  async toggleEmergencyLockout(token: string, lockout: boolean): Promise<{ success: boolean; isEmergencyLockout: boolean; message: string }> {
    return fetchJSON('/api/dev/security/emergency-lockout', {
      method: 'POST',
      body: JSON.stringify({ lockout }),
    }, token);
  },

  async revokeDevSessions(token: string): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/dev/security/revoke-session', {
      method: 'POST',
    }, token);
  },

  async getDevBackups(token: string): Promise<DevBackupItem[]> {
    return fetchJSON<DevBackupItem[]>('/api/dev/backups', undefined, token);
  },

  async createDevBackup(token: string): Promise<{ success: boolean; backup: DevBackupItem }> {
    return fetchJSON('/api/dev/backups/create', {
      method: 'POST',
    }, token);
  },

  async restoreDevBackup(token: string, backupId: string): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/dev/backups/restore', {
      method: 'POST',
      body: JSON.stringify({ backupId }),
    }, token);
  },

  async clearDevCache(token: string): Promise<{ success: boolean; message: string }> {
    return fetchJSON('/api/dev/cache/clear', {
      method: 'POST',
    }, token);
  },

  async getDevFeatureFlags(token: string): Promise<DevFeatureFlag[]> {
    return fetchJSON<DevFeatureFlag[]>('/api/dev/feature-flags', undefined, token);
  },

  async toggleDevFeatureFlag(token: string, flagKey: string, enabled: boolean): Promise<{ success: boolean; flag: DevFeatureFlag }> {
    return fetchJSON('/api/dev/feature-flags/toggle', {
      method: 'POST',
      body: JSON.stringify({ flagKey, enabled }),
    }, token);
  },

  async setDevMaintenanceMode(token: string, enabled: boolean, message?: string): Promise<{ success: boolean; isMaintenanceMode: boolean; maintenanceMessage: string }> {
    return fetchJSON('/api/dev/maintenance-mode', {
      method: 'POST',
      body: JSON.stringify({ enabled, message }),
    }, token);
  },

  async getDevCrashLogs(token: string): Promise<DevCrashLog[]> {
    return fetchJSON<DevCrashLog[]>('/api/dev/crash-logs', undefined, token);
  },

  async resolveDevCrashLog(token: string, crashId: string): Promise<{ success: boolean; crash: DevCrashLog }> {
    return fetchJSON('/api/dev/crash-logs/resolve', {
      method: 'POST',
      body: JSON.stringify({ crashId }),
    }, token);
  },

  async getDevAIInsights(token: string): Promise<DevAIInsight> {
    return fetchJSON<DevAIInsight>('/api/dev/ai-insights', undefined, token);
  },

  async getDevEnvConfig(token: string): Promise<any[]> {
    return fetchJSON<any[]>('/api/dev/env-config', undefined, token);
  },

  // Google Search Console & SEO
  async getGSCInfo(): Promise<{
    accountEmail: string;
    customDomain: string;
    currentHostUrl: string;
    siteUrl: string;
    sitemapUrl: string;
    customSitemapUrl: string;
    robotsUrl: string;
    verificationHtmlUrl: string;
    verificationMetaTag: string;
    urls: {
      welcome: string;
      dashboard: string;
      sitemaps: string;
      inspectUrl: string;
    };
    customDomainUrls: {
      welcome: string;
      dashboard: string;
      sitemaps: string;
      inspectUrl: string;
    };
    instructions: string[];
  }> {
    return fetchJSON('/api/seo/gsc');
  },
};
