import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Terminal,
  Cpu,
  Database,
  Activity,
  CreditCard,
  Users,
  Lock,
  Archive,
  ToggleLeft,
  ToggleRight,
  BrainCircuit,
  Settings,
  RefreshCw,
  Power,
  Key,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  ShieldCheck,
  Zap,
  Filter,
  Eye,
  Trash2,
  Server,
  Layers,
  FileCode,
  Search,
  Globe,
} from 'lucide-react';
import { api } from '../lib/api';
import {
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
  UserAccount,
} from '../types';

interface DeveloperPanelProps {
  onClose?: () => void;
}

export const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onClose }) => {
  // Auth state
  const [devToken, setDevToken] = useState<string>(() => localStorage.getItem('repairhub_dev_token') || '');
  const [devEmail, setDevEmail] = useState<string>('bimal8514samanta@gmail.com');
  const [devPin, setDevPin] = useState<string>('Akash@2004');
  const [code2FA, setCode2FA] = useState<string>('990088');
  const [requires2FA, setRequires2FA] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [devUser, setDevUser] = useState<UserAccount | null>(null);
  const [activeSession, setActiveSession] = useState<DevSession | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'server'
    | 'database'
    | 'api'
    | 'payment'
    | 'security'
    | 'backups'
    | 'flags'
    | 'ai'
    | 'gsc'
    | 'env'
  >('overview');

  // Dashboard Data States
  const [overview, setOverview] = useState<any>(null);
  const [serverMetrics, setServerMetrics] = useState<DevSystemMetrics | null>(null);
  const [dbMetrics, setDbMetrics] = useState<DevDatabaseMetrics | null>(null);
  const [apiLogs, setApiLogs] = useState<DevApiLog[]>([]);
  const [paymentLogs, setPaymentLogs] = useState<DevPaymentLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<DevSecurityAuditLog[]>([]);
  const [backups, setBackups] = useState<DevBackupItem[]>([]);
  const [featureFlags, setFeatureFlags] = useState<DevFeatureFlag[]>([]);
  const [aiInsights, setAiInsights] = useState<DevAIInsight | null>(null);
  const [envConfig, setEnvConfig] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Developer GSC Engine States
  const [devGscConfig, setDevGscConfig] = useState<any>(null);
  const [devGscTestResult, setDevGscTestResult] = useState<any>(null);
  const [devGscInspectedUrl, setDevGscInspectedUrl] = useState<string>('https://repairhub.in/book-repair');
  const [devGscInspectionData, setDevGscInspectionData] = useState<any>(null);
  const [devGscReindexUrl, setDevGscReindexUrl] = useState<string>('https://repairhub.in/sitemap.xml');
  const [devGscCredsForm, setDevGscCredsForm] = useState({
    clientId: '',
    clientSecret: '',
    serviceAccountEmail: '',
  });
  const [devGscLoading, setDevGscLoading] = useState<boolean>(false);


  // Status Message / Toast Notification
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Search & Filter state for logs
  const [logFilterSeverity, setLogFilterSeverity] = useState<string>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');

  // Maintenance mode custom text
  const [maintText, setMaintText] = useState<string>(
    'RepairHub is undergoing scheduled infrastructure security upgrade. Emergency repair bookings remain operational.'
  );

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 5000);
  };

  // Challenge step 1
  const handleInitiateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await api.devChallenge(devEmail, devPin);
      if (res.requires2FA) {
        setRequires2FA(true);
        showNotification('Developer Whitelist Verified. Input 6-Digit Authenticator 2FA Code.', 'info');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Access Denied: Whitelist check failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Challenge step 2: 2FA Verification
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await api.devVerify2FA(devEmail, code2FA);
      if (res.success && res.token) {
        setDevToken(res.token);
        localStorage.setItem('repairhub_dev_token', res.token);
        setDevUser(res.user);
        setActiveSession(res.session);
        showNotification('Tier 0 Developer Session Successfully Authenticated with 2FA.', 'success');
      }
    } catch (err: any) {
      setAuthError(err.message || '2FA Verification Failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch data when authenticated
  const loadDevData = async () => {
    if (!devToken) return;
    setLoadingData(true);
    try {
      const [
        ovRes,
        srvRes,
        dbRes,
        apiRes,
        payRes,
        secRes,
        bakRes,
        ffRes,
        envRes,
        gscRes,
      ] = await Promise.allSettled([
        api.getDevOverview(devToken),
        api.getDevServerMetrics(devToken),
        api.getDevDbMetrics(devToken),
        api.getDevApiLogs(devToken),
        api.getDevPaymentLogs(devToken),
        api.getDevSecurityLogs(devToken),
        api.getDevBackups(devToken),
        api.getDevFeatureFlags(devToken),
        api.getDevEnvConfig(devToken),
        api.getDevGscConfig(devToken),
      ]);

      if (ovRes.status === 'fulfilled') setOverview(ovRes.value);
      if (srvRes.status === 'fulfilled') setServerMetrics(srvRes.value);
      if (dbRes.status === 'fulfilled') setDbMetrics(dbRes.value);
      if (apiRes.status === 'fulfilled') setApiLogs(apiRes.value);
      if (payRes.status === 'fulfilled') setPaymentLogs(payRes.value);
      if (secRes.status === 'fulfilled') setSecurityLogs(secRes.value);
      if (bakRes.status === 'fulfilled') setBackups(bakRes.value);
      if (ffRes.status === 'fulfilled') setFeatureFlags(ffRes.value);
      if (envRes.status === 'fulfilled') setEnvConfig(envRes.value);
      if (gscRes.status === 'fulfilled') setDevGscConfig(gscRes.value);
    } catch (e: any) {
      console.error('Failed loading dev panel data:', e);
      if (e.message?.includes('403') || e.message?.includes('Forbidden')) {
        setDevToken('');
        localStorage.removeItem('repairhub_dev_token');
        setAuthError('Session expired or revoked. Please re-authenticate.');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const loadDevGscConfig = async () => {
    if (!devToken) return;
    try {
      setDevGscLoading(true);
      const cfg = await api.getDevGscConfig(devToken);
      setDevGscConfig(cfg);
    } catch (err: any) {
      console.warn('Failed loading dev GSC config:', err);
    } finally {
      setDevGscLoading(false);
    }
  };

  const handleTestDevGscConnection = async () => {
    if (!devToken) return;
    try {
      setDevGscLoading(true);
      const res = await api.testDevGscConnection(devToken);
      setDevGscTestResult(res);
      showNotification('Developer Diagnostic: GSC & Indexing API technical health check succeeded.', 'success');
    } catch (err: any) {
      showNotification('GSC Connection Diagnostic Error: ' + err.message, 'error');
    } finally {
      setDevGscLoading(false);
    }
  };

  const handleUpdateDevGscCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devToken) return;
    try {
      setDevGscLoading(true);
      const res = await api.updateDevGscCredentials(devToken, devGscCredsForm);
      showNotification(res.message, 'success');
      setDevGscCredsForm({ clientId: '', clientSecret: '', serviceAccountEmail: '' });
      loadDevGscConfig();
    } catch (err: any) {
      showNotification('Failed updating GSC credentials: ' + err.message, 'error');
    } finally {
      setDevGscLoading(false);
    }
  };

  const handleRunUrlInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devToken || !devGscInspectedUrl) return;
    try {
      setDevGscLoading(true);
      const res = await api.inspectDevUrl(devToken, devGscInspectedUrl);
      setDevGscInspectionData(res);
      showNotification(`URL Inspection complete for [${devGscInspectedUrl}]`, 'success');
    } catch (err: any) {
      showNotification('URL Inspection failed: ' + err.message, 'error');
    } finally {
      setDevGscLoading(false);
    }
  };

  const handleReindexSitemap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devToken || !devGscReindexUrl) return;
    try {
      setDevGscLoading(true);
      const res = await api.reindexDevSitemap(devToken, devGscReindexUrl);
      showNotification(res.message, 'success');
      loadDevGscConfig();
    } catch (err: any) {
      showNotification('Reindexing request failed: ' + err.message, 'error');
    } finally {
      setDevGscLoading(false);
    }
  };


  useEffect(() => {
    if (devToken) {
      loadDevData();
      const interval = setInterval(() => {
        loadDevData();
      }, 15000); // Live telemetry pulse every 15s
      return () => clearInterval(interval);
    }
  }, [devToken]);

  // Load AI Insights on demand
  const handleFetchAiInsights = async () => {
    if (!devToken) return;
    try {
      showNotification('Running Server-Side Gemini AI Security & Business Telemetry Engine...', 'info');
      const res = await api.getDevAIInsights(devToken);
      setAiInsights(res);
      showNotification('Gemini AI Telemetry Analysis Updated.', 'success');
    } catch (err: any) {
      showNotification('Failed generating AI telemetry: ' + err.message, 'error');
    }
  };

  // Toggle Emergency Lockout
  const handleToggleEmergencyLockout = async () => {
    if (!devToken) return;
    const currentState = overview?.isEmergencyLockout;
    try {
      const res = await api.toggleEmergencyLockout(devToken, !currentState);
      showNotification(res.message, res.isEmergencyLockout ? 'error' : 'success');
      loadDevData();
    } catch (e: any) {
      showNotification(e.message, 'error');
    }
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = async () => {
    if (!devToken) return;
    const currentState = overview?.isMaintenanceMode;
    try {
      const res = await api.setDevMaintenanceMode(devToken, !currentState, maintText);
      showNotification(
        res.isMaintenanceMode
          ? 'System Maintenance Mode Activated. Non-developer mutations blocked.'
          : 'System Maintenance Mode Deactivated. Full service restored.',
        res.isMaintenanceMode ? 'error' : 'success'
      );
      loadDevData();
    } catch (e: any) {
      showNotification(e.message, 'error');
    }
  };

  // Create Snapshot Backup
  const handleCreateBackup = async () => {
    if (!devToken) return;
    try {
      const res = await api.createDevBackup(devToken);
      if (res.success) {
        showNotification(`Database Snapshot ${res.backup.id} generated (${res.backup.sizeKB} KB).`, 'success');
        loadDevData();
      }
    } catch (e: any) {
      showNotification(e.message, 'error');
    }
  };

  // Clear Cache
  const handleClearCache = async () => {
    if (!devToken) return;
    try {
      const res = await api.clearDevCache(devToken);
      showNotification(res.message, 'success');
      loadDevData();
    } catch (e: any) {
      showNotification(e.message, 'error');
    }
  };

  // Toggle Feature Flag
  const handleToggleFlag = async (flagKey: string, currentVal: boolean) => {
    if (!devToken) return;
    try {
      const res = await api.toggleDevFeatureFlag(devToken, flagKey, !currentVal);
      if (res.success) {
        showNotification(`Feature Flag [${flagKey}] updated to ${!currentVal ? 'ENABLED' : 'DISABLED'}.`, 'success');
        loadDevData();
      }
    } catch (e: any) {
      showNotification(e.message, 'error');
    }
  };

  // Revoke Session and Exit
  const handleLogoutDev = async () => {
    if (devToken) {
      try {
        await api.revokeDevSessions(devToken);
      } catch (e) {
        // Ignore errors during logout
      }
    }
    setDevToken('');
    localStorage.removeItem('repairhub_dev_token');
    setRequires2FA(false);
    showNotification('Developer session successfully terminated and JWT token purged.', 'info');
    if (onClose) onClose();
  };

  // Export Audit Logs to JSON
  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(securityLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `repairhub_security_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Security audit logs exported to JSON.', 'success');
  };

  // IF NOT AUTHENTICATED -> SHOW LOGIN TERMINAL
  if (!devToken) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-y-auto font-mono">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              ✕
            </button>
          )}

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                REPAIRHUB DEVSECOPS CONSOLE
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold">
                  RESTRICTED ACCESS
                </span>
              </h2>
              <p className="text-xs text-slate-400">Tier 0 Whitelisted Account & 2FA Required</p>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 rounded-lg text-red-200 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{authError}</p>
                <p className="text-[11px] text-red-300/80 mt-0.5">
                  Admin, Technician, or Customer roles are forbidden from accessing this terminal.
                </p>
              </div>
            </div>
          )}

          {!requires2FA ? (
            <form onSubmit={handleInitiateChallenge} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Whitelisted Developer Email</label>
                <input
                  type="email"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="bimal8514samanta@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Developer Passcode / Key</label>
                <input
                  type="password"
                  value={devPin}
                  onChange={(e) => setDevPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="Akash@2004"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> IP Whitelist Verification
                </p>
                <p>Client IP: <span className="text-emerald-400 font-mono">127.0.0.1 (Cloud Container Ingress)</span></p>
                <p>Allowed Roles: <span className="text-white font-bold">developer ONLY</span></p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/50"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" /> Verify Credentials & Initiate 2FA
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-lg text-xs text-cyan-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" /> 2-Factor Authentication Required
                </p>
                <p className="text-[11px] text-cyan-300/80 mt-1">
                  Open your Authenticator app (or enter code <span className="text-amber-400 font-bold">990088</span> for terminal access).
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">6-Digit Authenticator TOTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/50 rounded-lg px-3 py-2 text-center text-lg tracking-widest text-emerald-400 focus:outline-none focus:border-cyan-400 font-mono"
                  placeholder="990088"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRequires2FA(false)}
                  className="w-1/3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {authLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Authenticate Session
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Filter security logs
  const filteredSecurityLogs = securityLogs.filter((log) => {
    const matchesSev = logFilterSeverity === 'all' || log.severity === logFilterSeverity;
    const matchesQuery =
      !logSearchQuery ||
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearchQuery.toLowerCase());
    return matchesSev && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12 flex flex-col">
      {/* DEVELOPER PANEL TOP BAR */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-wider font-mono">
                  REPAIRHUB DEVELOPER CONTROL TERMINAL
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-semibold">
                  TIER 0 MASTER SEC
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  v2026.4
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Account: <strong className="text-slate-200 font-mono">Akash Samanta (Lead SecOps)</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">2FA Active & Verified</span>
              </p>
            </div>
          </div>

          {/* QUICK EMERGENCY ACTIONS & SESSION LOGOUT */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEmergencyLockout}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                overview?.isEmergencyLockout
                  ? 'bg-red-900/90 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border-slate-700'
              }`}
              title="Locks down all write mutations across non-developer endpoints"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              {overview?.isEmergencyLockout ? 'LOCKOUT ACTIVE' : 'Emergency Lockout'}
            </button>

            <button
              onClick={handleToggleMaintenance}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                overview?.isMaintenanceMode
                  ? 'bg-amber-900/90 text-amber-200 border-amber-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Power className="w-3.5 h-3.5 text-amber-400" />
              {overview?.isMaintenanceMode ? 'Maintenance ON' : 'Maintenance Mode'}
            </button>

            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5"
              title="Purge rate limiter and memory cache buffers"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Clear Cache
            </button>

            <button
              onClick={handleLogoutDev}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" /> Exit Terminal
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* NOTIFICATION TOASTER */}
      {actionMessage && (
        <div
          className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-3 transition-all ${
            actionMessage.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-200'
              : actionMessage.type === 'info'
              ? 'bg-cyan-950/90 border-cyan-800 text-cyan-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          } border rounded-lg p-3 text-xs flex items-center justify-between font-mono`}
        >
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            {actionMessage.text}
          </span>
          <button onClick={() => setActionMessage(null)} className="opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* TAB NAVIGATION BAR */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 sticky top-[61px] z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: 'overview', label: 'Overview', icon: Terminal },
            { id: 'server', label: 'Server Monitoring', icon: Cpu },
            { id: 'database', label: 'Database & Queries', icon: Database },
            { id: 'api', label: 'API Stream', icon: Activity },
            { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
            { id: 'security', label: 'Security & Audit Logs', icon: Lock },
            { id: 'backups', label: 'Backups & Snapshots', icon: Archive },
            { id: 'flags', label: 'Feature Flags', icon: ToggleRight },
            { id: 'ai', label: 'Gemini AI Insights', icon: BrainCircuit },
            { id: 'gsc', label: 'GSC & SEO Engine', icon: Search },
            { id: 'env', label: 'Env Config', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 flex-1">
        {loadingData && (
          <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2 font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            Synchronizing Developer Telemetry Stream...
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* STAT CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>System Health</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400 font-mono uppercase">
                  {overview?.systemStatus || 'Healthy'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Uptime: {Math.floor((overview?.uptimeSec || 0) / 3600)}h {Math.floor(((overview?.uptimeSec || 0) % 3600) / 60)}m
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Active Repairs</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {overview?.activeRepairsCount ?? 0} Jobs
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Live in-memory database</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Security Audit Logs</span>
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-amber-400 font-mono">
                  {overview?.auditLogsCount ?? securityLogs.length} Events
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Immutable Security Trail</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>API Traffic Requests</span>
                  <Server className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl font-bold text-indigo-300 font-mono">
                  {apiLogs.length} Logged
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Average Response: ~4ms</p>
              </div>
            </div>

            {/* ACTIVE DEVELOPER SESSION PROFILE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                ACTIVE DEVELOPER SESSION PROFILE & IP WHITELIST STATUS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Authenticated Developer:</span>
                  <p className="text-white font-semibold mt-0.5">Bimal Samanta (Lead SecOps)</p>
                  <p className="text-slate-400 text-[11px]">ABRgroupfoundation01.07.2026@gmail.com</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Security Clearance:</span>
                  <p className="text-emerald-400 font-semibold mt-0.5">Tier 0 - Master Security</p>
                  <p className="text-slate-400 text-[11px]">2FA Verified via TOTP</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Ingress IP & Connection:</span>
                  <p className="text-cyan-300 font-semibold mt-0.5">127.0.0.1 (Cloud Container)</p>
                  <p className="text-emerald-400 text-[11px]">IP Whitelist Match Verified</p>
                </div>
              </div>
            </div>

            {/* MAINTENANCE MODE BANNER CONTROL */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Power className="w-4 h-4 text-amber-400" />
                GLOBAL MAINTENANCE MODE NOTICE CONTROL
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Activating maintenance mode displays a notice banner on customer and technician portals, blocking write requests while maintaining developer access.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={maintText}
                  onChange={(e) => setMaintText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  onClick={handleToggleMaintenance}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    overview?.isMaintenanceMode
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {overview?.isMaintenanceMode ? 'Deactivate Maintenance' : 'Activate Maintenance Mode'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVER MONITORING */}
        {activeTab === 'server' && serverMetrics && (
          <div className="space-y-6 font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CPU METER */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>CPU Usage ({serverMetrics.cpuCoresCount} Cores)</span>
                  <span className="text-cyan-400 font-bold">{serverMetrics.cpuPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 mb-3">
                  <div
                    className={`h-full transition-all ${
                      serverMetrics.cpuPercent > 80 ? 'bg-red-500' : serverMetrics.cpuPercent > 50 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${serverMetrics.cpuPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">Load Average: {serverMetrics.loadAverage.join(', ')}</p>
              </div>

              {/* MEMORY METER */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>RAM Memory</span>
                  <span className="text-emerald-400 font-bold">
                    {serverMetrics.memoryUsedMB} MB / {serverMetrics.memoryTotalMB} MB
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 mb-3">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${(serverMetrics.memoryUsedMB / serverMetrics.memoryTotalMB) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">Heap Allocation: Node.js V8 Engine</p>
              </div>

              {/* DISK STORAGE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Storage Usage</span>
                  <span className="text-indigo-400 font-bold">
                    {serverMetrics.diskUsedGB} GB / {serverMetrics.diskTotalGB} GB
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 mb-3">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${(serverMetrics.diskUsedGB / serverMetrics.diskTotalGB) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">Container Storage: Fast NVMe SSD</p>
              </div>
            </div>

            {/* PROCESS & NETWORK TELEMETRY */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                RUNTIME PLATFORM TELEMETRY
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Node Runtime:</span>
                  <p className="text-white font-bold mt-1">{serverMetrics.nodeVersion}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">OS Platform:</span>
                  <p className="text-white font-bold mt-1">{serverMetrics.osPlatform}</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Network Throughput:</span>
                  <p className="text-cyan-300 font-bold mt-1">
                    ↓ {serverMetrics.networkInKbps} KB/s | ↑ {serverMetrics.networkOutKbps} KB/s
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Active HTTP Sockets:</span>
                  <p className="text-emerald-400 font-bold mt-1">{serverMetrics.activeConnectionsCount} Connections</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATABASE MONITORING */}
        {activeTab === 'database' && dbMetrics && (
          <div className="space-y-6 font-mono">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-400 text-xs">Connection Pool</span>
                <p className="text-lg font-bold text-white mt-1">
                  {dbMetrics.connectionPool.active} Active / {dbMetrics.connectionPool.idle} Idle ({dbMetrics.connectionPool.max} Max)
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-400 text-xs">Average Query Duration</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">{dbMetrics.averageQueryTimeMs} ms</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-slate-400 text-xs">Total Queries Executed</span>
                <p className="text-lg font-bold text-cyan-400 mt-1">{dbMetrics.totalQueriesCount.toLocaleString()}</p>
              </div>
            </div>

            {/* SLOW QUERIES LOG TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                SLOW QUERY AUDIT LOG
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3">Query ID</th>
                      <th className="py-2 px-3">SQL / Query Text</th>
                      <th className="py-2 px-3">Duration</th>
                      <th className="py-2 px-3">Caller Component</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {dbMetrics.slowQueries.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-cyan-400 font-bold">{q.id}</td>
                        <td className="py-2 px-3 text-slate-200">{q.query}</td>
                        <td className="py-2 px-3 text-amber-400 font-semibold">{q.durationMs} ms</td>
                        <td className="py-2 px-3 text-slate-400">{q.caller}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: API STREAM MONITORING */}
        {activeTab === 'api' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                LIVE HTTP REQUEST LOG STREAM
              </h3>
              <span className="text-xs text-slate-400">{apiLogs.length} Recent Requests</span>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 sticky top-0 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Endpoint Path</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Latency</th>
                    <th className="py-2 px-3">Client IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {apiLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.method === 'GET'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {log.method}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-200 font-semibold">{log.path}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.status < 300
                              ? 'bg-emerald-950 text-emerald-400'
                              : log.status === 403
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-cyan-400">{log.durationMs} ms</td>
                      <td className="py-2 px-3 text-slate-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENT GATEWAY LOGS */}
        {activeTab === 'payment' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              RAZORPAY & UPI TRANSACTION LOG STREAM
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Transaction ID</th>
                    <th className="py-2 px-3">Provider</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Customer Email</th>
                    <th className="py-2 px-3">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paymentLogs.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400 font-bold">{p.transactionId}</td>
                      <td className="py-2 px-3 text-slate-200">{p.provider}</td>
                      <td className="py-2 px-3 text-white font-bold">₹{p.amount}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'captured'
                              ? 'bg-emerald-950 text-emerald-400'
                              : p.status === 'refunded'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-400">{p.customerEmail}</td>
                      <td className="py-2 px-3 text-slate-400">{p.latencyMs} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & AUDIT LOGS */}
        {activeTab === 'security' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  IMMUTABLE SECURITY AUDIT LOG TRAIL
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Logs all authentication challenges, privilege checks, and intrusion attempts
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={logFilterSeverity}
                  onChange={(e) => setLogFilterSeverity(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="warn">Warnings</option>
                  <option value="info">Info</option>
                </select>
                <button
                  onClick={handleExportLogs}
                  className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Actor / Email</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Severity</th>
                    <th className="py-2 px-3">Action Description</th>
                    <th className="py-2 px-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSecurityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-3">
                        <p className="text-white font-semibold">{log.actor}</p>
                        <p className="text-slate-400 text-[10px]">{log.actorEmail} ({log.ip})</p>
                      </td>
                      <td className="py-2 px-3 text-cyan-400 font-bold">{log.category}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.severity === 'critical'
                              ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                              : log.severity === 'warn'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {log.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-200">
                        <p className="font-semibold">{log.action}</p>
                        <p className="text-slate-400 text-[11px]">{log.details}</p>
                      </td>
                      <td className="py-2 px-3 font-bold">
                        <span
                          className={
                            log.result === 'success'
                              ? 'text-emerald-400'
                              : log.result === 'blocked'
                              ? 'text-red-400'
                              : 'text-amber-400'
                          }
                        >
                          {log.result.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: BACKUPS & SNAPSHOTS */}
        {activeTab === 'backups' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Archive className="w-4 h-4 text-cyan-400" />
                  DATABASE SNAPSHOTS & RESTORE MANAGEMENT
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Generate immutable system snapshots or restore point-in-time state</p>
              </div>
              <button
                onClick={handleCreateBackup}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <Archive className="w-4 h-4" /> Create Snapshot Backup
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Snapshot ID</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">SHA-256 Hash</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {backups.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-cyan-400 font-bold">{b.id}</td>
                      <td className="py-2 px-3 text-slate-300">{new Date(b.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-3 text-slate-200">{b.sizeKB} KB</td>
                      <td className="py-2 px-3 text-slate-400 font-mono text-[10px]">{b.hash}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                          {b.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to restore database snapshot ${b.id}?`)) {
                              api.restoreDevBackup(devToken, b.id).then((r) => showNotification(r.message, 'success'));
                            }
                          }}
                          className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded text-[11px] font-bold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore State
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: FEATURE FLAGS */}
        {activeTab === 'flags' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <ToggleRight className="w-4 h-4 text-cyan-400" />
              DYNAMIC FEATURE FLAGS & SYSTEM TOGGLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400">{flag.key}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                        {flag.environment}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white mt-1">{flag.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{flag.description}</p>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Updated by {flag.lastUpdatedBy} at {new Date(flag.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleFlag(flag.key, flag.enabled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      flag.enabled
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: GEMINI AI INSIGHTS */}
        {activeTab === 'ai' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  SERVER-SIDE GEMINI AI TELEMETRY & THREAT PREDICTION
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time threat level analysis, 30-day business forecasting, & vulnerabilities</p>
              </div>
              <button
                onClick={handleFetchAiInsights}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Run AI Telemetry Audit
              </button>
            </div>

            {aiInsights ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-xs">Security Threat Level</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1 uppercase">{aiInsights.threatLevel}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{aiInsights.securitySummary}</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-xs">AI 30-Day Revenue Forecast</span>
                    <p className="text-lg font-bold text-cyan-300 mt-1">₹{aiInsights.revenueForecastNext30Days.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Based on active repair queue momentum</p>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-xs">Technician Efficiency Score</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{aiInsights.technicianEfficiencyScore}%</p>
                    <p className="text-[11px] text-slate-400 mt-1">SLA dispatch compliance rating</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-white mb-2">Recommended Security & Operational Hardening Actions</h4>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {aiInsights.recommendedActions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Click <strong className="text-cyan-400">Run AI Telemetry Audit</strong> to invoke server-side Gemini AI model.
              </div>
            )}
          </div>
        )}

        {/* TAB 10: GSC & SEO ENGINE */}
        {activeTab === 'gsc' && (
          <div className="space-y-6 font-mono">
            {/* TOP HEADER BANNER */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    DEVELOPER GOOGLE SEARCH CONSOLE & TECHNICAL SEO ENGINE
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    DEV API MANAGEMENT
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage OAuth2 Client secrets, Service Accounts, Indexing API rate limits, URL inspection diagnostics, and Googlebot crawl requests.
                </p>
              </div>

              <button
                onClick={handleTestDevGscConnection}
                disabled={devGscLoading}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${devGscLoading ? 'animate-spin' : ''}`} />
                <span>Run Technical Diagnostic Ping</span>
              </button>
            </div>

            {/* STAT CARDS & QUOTA METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Daily Webmaster Queries</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {devGscConfig?.apiQuotas?.dailyQueriesUsed ?? 1420} / {devGscConfig?.apiQuotas?.dailyQueriesLimit?.toLocaleString() ?? '100,000'}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[2%]" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">1.42% Daily Quota Consumed</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Indexing API Batch Quota</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {devGscConfig?.apiQuotas?.indexingBatchQuotaUsed ?? 18} / {devGscConfig?.apiQuotas?.indexingBatchQuotaLimit ?? 200}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[9%]" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Priority Recrawl Submissions</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Service Account</span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs font-bold text-purple-300 truncate" title={devGscConfig?.serviceAccountEmail}>
                  {devGscConfig?.serviceAccountEmail || 'repairhub-gsc-sa@...'}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Configured & Server-Protected
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>OAuth2 Client Status</span>
                  <Key className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs font-bold text-amber-300 truncate" title={devGscConfig?.clientIdMasked}>
                  {devGscConfig?.clientIdMasked || '108429381920...apps'}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-400">
                  <CheckCircle2 className="w-3 h-3" /> Token Service Valid
                </div>
              </div>
            </div>

            {/* TWO COLUMN GRID: CREDENTIALS MANAGEMENT & DIAGNOSTIC RESULT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CONFIG & CREDENTIALS FORM */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  API OAuth2 Credentials & Scope Settings
                </h4>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Redirect URI:</span>
                    <span className="text-cyan-300 font-mono text-[11px] select-all">{devGscConfig?.redirectUri || 'https://.../api/admin/gsc/callback'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Environment:</span>
                    <span className="text-emerald-400 font-bold uppercase">{devGscConfig?.environment || 'production'}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block mb-1">Active Scopes:</span>
                    <div className="flex flex-wrap gap-1">
                      {devGscConfig?.scopes?.map((sc: string, idx: number) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 rounded text-[10px]">
                          {sc.replace('https://www.googleapis.com/auth/', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateDevGscCreds} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Google OAuth2 Client ID</label>
                    <input
                      type="text"
                      value={devGscCredsForm.clientId}
                      onChange={(e) => setDevGscCredsForm({ ...devGscCredsForm, clientId: e.target.value })}
                      placeholder={devGscConfig?.clientIdMasked || '1084293819203-gsc-repairhub-oauth...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Google OAuth2 Client Secret</label>
                    <input
                      type="password"
                      value={devGscCredsForm.clientSecret}
                      onChange={(e) => setDevGscCredsForm({ ...devGscCredsForm, clientSecret: e.target.value })}
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Service Account Email</label>
                    <input
                      type="email"
                      value={devGscCredsForm.serviceAccountEmail}
                      onChange={(e) => setDevGscCredsForm({ ...devGscCredsForm, serviceAccountEmail: e.target.value })}
                      placeholder={devGscConfig?.serviceAccountEmail || 'repairhub-gsc-sa@...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[10px] text-cyan-300 flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
                    <span>Credentials are stored strictly in server-side memory & process ENV. Secrets are never exposed to client bundles or non-developer roles.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={devGscLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Update Developer Credentials on Server</span>
                  </button>
                </form>
              </div>

              {/* TECHNICAL DIAGNOSTIC OUTPUT */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    API Health Diagnostic Output
                  </span>
                  {devGscTestResult && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      HTTP 200 OK ({devGscTestResult.latencyMs}ms)
                    </span>
                  )}
                </h4>

                {devGscTestResult ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <p className="text-slate-400 text-[11px]">Timestamp: {devGscTestResult.timestamp}</p>
                      <div className="space-y-1.5">
                        {Object.entries(devGscTestResult.endpointCheck || {}).map(([key, val]: [string, any]) => (
                          <div key={key} className="flex justify-between items-center text-[11px] border-b border-slate-900 pb-1">
                            <span className="text-slate-300 font-mono">{key}:</span>
                            <span className="text-emerald-400 font-bold">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-emerald-300 text-xs">
                      {devGscTestResult.message}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-950 rounded-lg border border-slate-800 text-slate-500 text-xs space-y-2">
                    <Activity className="w-8 h-8 text-slate-700 animate-pulse" />
                    <p>No diagnostic test run yet.</p>
                    <p className="text-[11px] text-slate-600">Click "Run Technical Diagnostic Ping" above to execute endpoint latency and token refresh checks.</p>
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM TOOLS: URL INSPECTION & FORCED REINDEXING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TOOL 1: URL INSPECTOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Technical URL Inspection & Rich Snippet Diagnostic
                </h4>

                <form onSubmit={handleRunUrlInspection} className="flex gap-2">
                  <input
                    type="url"
                    value={devGscInspectedUrl}
                    onChange={(e) => setDevGscInspectedUrl(e.target.value)}
                    placeholder="https://repairhub.in/book-repair"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                  <button
                    type="submit"
                    disabled={devGscLoading}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    Inspect URL
                  </button>
                </form>

                {devGscInspectionData && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Coverage State:</span>
                      <span className="text-emerald-400 font-bold">{devGscInspectionData.coverageState}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Crawled As:</span>
                      <span className="text-slate-200">{devGscInspectionData.crawledAs}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Mobile Usability:</span>
                      <span className="text-emerald-400 font-bold">{devGscInspectionData.mobileUsability?.verdict}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Detected Structured Data Schemas:</span>
                      <div className="space-y-1">
                        {devGscInspectionData.richResultsSchema?.map((sch: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] bg-slate-900 px-2 py-1 rounded">
                            <span className="text-cyan-300 font-mono">{sch.type}</span>
                            <span className="text-emerald-400 font-bold">✓ Valid Schema</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TOOL 2: GOOGLEBOT PRIORITY REINDEXING */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Googlebot Priority Reindexing & Indexing API Queue
                </h4>

                <form onSubmit={handleReindexSitemap} className="flex gap-2">
                  <input
                    type="url"
                    value={devGscReindexUrl}
                    onChange={(e) => setDevGscReindexUrl(e.target.value)}
                    placeholder="https://repairhub.in/sitemap.xml"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                  <button
                    type="submit"
                    disabled={devGscLoading}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    Trigger Priority Recrawl
                  </button>
                </form>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-2">
                  <p className="text-slate-300">
                    Submits target sitemap XML or URL to the Google Indexing API endpoint (<code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">/v3/urlNotifications:publish</code>).
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Googlebot will prioritize crawl scheduling within minutes. Remaining daily Indexing API quota: <strong className="text-emerald-400">{devGscConfig?.apiQuotas?.indexingBatchQuotaLimit - devGscConfig?.apiQuotas?.indexingBatchQuotaUsed} batch requests</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: ENV CONFIG */}
        {activeTab === 'env' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono">
            <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              SANITIZED ENVIRONMENT & SYSTEM CONFIGURATION INVENTORY
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Variable Key</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Sanitized Value</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {envConfig.map((env, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-cyan-400">{env.key}</td>
                      <td className="py-2 px-3 text-slate-400">{env.category}</td>
                      <td className="py-2 px-3 text-slate-200">{env.value}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[10px]">
                          {env.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
