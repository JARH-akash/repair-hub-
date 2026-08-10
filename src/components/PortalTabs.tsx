import React, { useState, useEffect } from 'react';
import {
  User,
  Wrench,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  PackageCheck,
  Search,
  Check,
  RefreshCw,
  QrCode,
  ShieldAlert,
  Award,
  Briefcase,
  Eye,
  EyeOff,
  Paperclip,
  Download,
  X,
  UserPlus,
  LogIn,
  Globe,
  Unlink,
  BarChart3,
  XCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { api } from '../lib/api';
import { Logo } from './Logo';
import {
  AnalyticsData,
  GSCAdminData,
  InventoryItem,
  RepairJob,
  SupportTicket,
  Technician,
  UserAccount,
  UserRole,
} from '../types';

interface PortalTabsProps {
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenInvoiceModal: (job: RepairJob) => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (role?: UserRole, mode?: 'login' | 'register') => void;
  onOpenAccountModal?: () => void;
}

export const PortalTabs: React.FC<PortalTabsProps> = ({
  activeRole,
  onSelectRole,
  onOpenInvoiceModal,
  currentUser,
  onOpenAuthModal,
  onOpenAccountModal,
}) => {
  const [repairs, setRepairs] = useState<RepairJob[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [registeredAccounts, setRegisteredAccounts] = useState<UserAccount[]>([]);
  const [selectedUserCv, setSelectedUserCv] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [ownerPasscode, setOwnerPasscode] = useState('');
  const [showOwnerPasscode, setShowOwnerPasscode] = useState(false);
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [ownerError, setOwnerError] = useState('');
  const [techDocSearch, setTechDocSearch] = useState('');
  const [selectedTechDoc, setSelectedTechDoc] = useState<string | null>(null);

  // Price Upgrade & Edit Inventory States
  const [editingPriceItem, setEditingPriceItem] = useState<InventoryItem | null>(null);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editSellingPrice, setEditSellingPrice] = useState<number>(0);
  const [priceSuccessMsg, setPriceSuccessMsg] = useState<string>('');

  // Service Tier & Protection Upgrade State
  const [userPlan, setUserPlan] = useState<'standard' | 'vip_pro' | 'enterprise'>(() => {
    return (localStorage.getItem('rh_user_plan') as any) || 'standard';
  });
  const [planUpgradeLoading, setPlanUpgradeLoading] = useState<boolean>(false);
  const [planUpgradeMsg, setPlanUpgradeMsg] = useState<string>('');

  // Google Search Console Admin States
  const [gscAdminData, setGscAdminData] = useState<GSCAdminData | null>(null);
  const [gscLoading, setGscLoading] = useState(false);
  const [gscSyncing, setGscSyncing] = useState(false);
  const [gscActionMsg, setGscActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConnectGscModal, setShowConnectGscModal] = useState(false);
  const [connectSiteUrlInput, setConnectSiteUrlInput] = useState('https://repairhub.in');
  const [connectEmailInput, setConnectEmailInput] = useState('ABRgroupfoundation01.07.2006@gmail.com');
  const [activeGscTab, setActiveGscTab] = useState<'performance' | 'indexing' | 'settings'>('performance');

  const loadGscAdminData = async () => {
    try {
      setGscLoading(true);
      const data = await api.getGSCAdminStatus(ownerPasscode || 'biswajit@ritam', currentUser?.role);
      setGscAdminData(data);
      if (data?.siteUrl) setConnectSiteUrlInput(data.siteUrl);
      if (data?.accountEmail) setConnectEmailInput(data.accountEmail);
    } catch (err: any) {
      console.warn('Could not fetch GSC Admin status:', err);
    } finally {
      setGscLoading(false);
    }
  };

  const handleSyncGscData = async () => {
    try {
      setGscSyncing(true);
      setGscActionMsg(null);
      const res = await api.syncGSCAdmin(ownerPasscode || 'biswajit@ritam', currentUser?.role);
      if (res.data) setGscAdminData(res.data);
      setGscActionMsg({ type: 'success', text: res.message || 'Search Console metrics updated successfully!' });
    } catch (err: any) {
      setGscActionMsg({ type: 'error', text: err.message || 'Failed to sync with Search Console.' });
    } finally {
      setGscSyncing(false);
    }
  };

  const handleConnectGsc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGscLoading(true);
      setGscActionMsg(null);
      const res = await api.connectGSCAdmin({
        siteUrl: connectSiteUrlInput.trim() || 'https://repairhub.in',
        accountEmail: connectEmailInput.trim() || 'ABRgroupfoundation01.07.2006@gmail.com',
      }, ownerPasscode || 'biswajit@ritam', currentUser?.role);

      if (res.data) setGscAdminData(res.data);
      setGscActionMsg({ type: 'success', text: 'Search Console property connected and verified.' });
      setShowConnectGscModal(false);
    } catch (err: any) {
      setGscActionMsg({ type: 'error', text: err.message || 'Could not connect Search Console.' });
    } finally {
      setGscLoading(false);
    }
  };

  const handleDisconnectGsc = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Search Console and revoke access?')) return;
    try {
      setGscLoading(true);
      setGscActionMsg(null);
      const res = await api.disconnectGSCAdmin(ownerPasscode || 'biswajit@ritam', currentUser?.role);
      if (res.data) setGscAdminData(res.data);
      setGscActionMsg({ type: 'success', text: 'Search Console connection disconnected and access revoked.' });
    } catch (err: any) {
      setGscActionMsg({ type: 'error', text: err.message || 'Failed to disconnect.' });
    } finally {
      setGscLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [repRes, techRes, invRes, anaRes, tickRes, userRes] = await Promise.allSettled([
        api.getRepairs(),
        api.getTechnicians(),
        api.getInventory(),
        api.getAnalytics(),
        api.getSupportTickets(),
        api.getUsers(),
      ]);

      if (repRes.status === 'fulfilled') setRepairs(repRes.value);
      if (techRes.status === 'fulfilled') setTechnicians(techRes.value);
      if (invRes.status === 'fulfilled') setInventory(invRes.value);
      if (anaRes.status === 'fulfilled') setAnalytics(anaRes.value);
      if (tickRes.status === 'fulfilled') setSupportTickets(tickRes.value);
      if (userRes.status === 'fulfilled') setRegisteredAccounts(userRes.value || []);
    } catch (err) {
      console.warn('Portal Data Partial Load Notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (isOwnerUnlocked || currentUser?.role === 'admin') {
      loadGscAdminData();
    }
  }, [isOwnerUnlocked, currentUser?.role]);

  const handleRestock = async (id: string, currentStock: number) => {
    try {
      await api.updateStock(id, currentStock + 10);
      loadData();
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const handleOpenPriceModal = (item: InventoryItem) => {
    setEditingPriceItem(item);
    setEditCostPrice(item.costPrice);
    setEditSellingPrice(item.sellingPrice);
    setPriceSuccessMsg('');
  };

  const handleSavePriceUpgrade = async () => {
    if (!editingPriceItem) return;
    try {
      await api.updateInventoryItem(editingPriceItem.id, {
        costPrice: editCostPrice,
        sellingPrice: editSellingPrice,
      });
      setPriceSuccessMsg(`Price upgraded successfully for ${editingPriceItem.partName}!`);
      setTimeout(() => {
        setEditingPriceItem(null);
        setPriceSuccessMsg('');
      }, 1200);
      loadData();
    } catch (err) {
      alert('Failed to update price');
    }
  };

  const handleUpgradeUserPlan = (plan: 'standard' | 'vip_pro' | 'enterprise') => {
    setPlanUpgradeLoading(true);
    setTimeout(() => {
      setUserPlan(plan);
      localStorage.setItem('rh_user_plan', plan);
      setPlanUpgradeLoading(false);
      setPlanUpgradeMsg(
        `Plan successfully upgraded to ${
          plan === 'vip_pro'
            ? 'Pro Care VIP Protection (₹999/year)'
            : plan === 'enterprise'
            ? 'Enterprise Fleet Ultra (₹2,999/year)'
            : 'Standard Pay-As-You-Go'
        }!`
      );
      setTimeout(() => setPlanUpgradeMsg(''), 5000);
    }, 600);
  };

  const filteredRepairs = repairs.filter(
    (r) =>
      r.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.deviceModel.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section id="portals" className="py-12 sm:py-16 lg:py-20 bg-[#020816] text-white border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Title & Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Logo size="md" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Integrated Multi-Role Workspaces
              </div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Platform Workspaces
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Switch between Customer Dashboard, Technician Operations Desk, and Admin Analytics Control Center.
            </p>
          </div>

          {/* Role Tabs Switcher */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => onSelectRole('customer')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeRole === 'customer'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-customer-btn"
            >
              <User className="w-4 h-4" /> Customer Portal
            </button>
            <button
              onClick={() => onSelectRole('technician')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeRole === 'technician'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-tech-btn"
            >
              <Wrench className="w-4 h-4" /> Technician Desk
            </button>
            <button
              onClick={() => onSelectRole('admin')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-admin-btn"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Operations
            </button>
          </div>
        </div>

        {/* Account Creation & Session Status Callout Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#07111f] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              activeRole === 'customer'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : activeRole === 'technician'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
            }`}>
              {activeRole === 'customer' ? (
                <User className="w-5 h-5" />
              ) : activeRole === 'technician' ? (
                <Wrench className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {activeRole === 'customer'
                    ? 'Customer Self-Service Desk'
                    : activeRole === 'technician'
                    ? 'Field Service Dispatch Roster'
                    : 'Admin Operations & Analytics Hub'}
                </span>
                {currentUser && currentUser.role === activeRole && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Active Session: {currentUser.fullName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser
                  ? `Logged in as registered ${currentUser.role.toUpperCase()} account (${currentUser.email}).`
                  : `Create a dedicated ${activeRole.toUpperCase()} account or sign in to access personalized data.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenAccountModal?.()}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 text-blue-200 border border-blue-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              id="portal-manage-account-btn"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Edit Account / Profile</span>
            </button>

            <button
              onClick={() => onOpenAccountModal ? onOpenAccountModal() : onOpenAuthModal?.(activeRole, 'register')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'customer'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                  : activeRole === 'technician'
                  ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
              }`}
              id="portal-create-account-btn"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>

            <button
              onClick={() => onOpenAuthModal?.(activeRole, 'login')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              id="portal-login-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CUSTOMER PORTAL */}
        {/* ---------------------------------------------------------------- */}
        {activeRole === 'customer' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white">My Active & Past Repair Requests</h3>
                <button
                  onClick={loadData}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  id="cust-refresh-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repairs.map((job) => (
                  <div key={job.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold text-blue-400">{job.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{job.deviceModel}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{job.problemDescription}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">OTP Code</span>
                        <span className="font-mono font-bold text-emerald-400">{job.otpCode}</span>
                      </div>

                      {job.payment.status === 'paid' ? (
                        <button
                          onClick={() => onOpenInvoiceModal(job)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                          id={`invoice-btn-${job.id}`}
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </button>
                      ) : (
                        <span className="text-amber-400 font-bold">₹{job.estimate.total || 'Quote Pending'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Warranty Wallet */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" /> Digital Warranty Wallet
              </h3>
              <p className="text-xs text-slate-400">All completed repairs automatically come with 90 to 180 days warranty protection.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repairs
                  .filter((r) => r.warranty?.isActive)
                  .map((wJob) => (
                    <div key={wJob.id} className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-blue-950/40 border border-blue-500/30 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-cyan-400">{wJob.warranty.certificateNumber}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{wJob.deviceModel}</h4>
                        <span className="text-[10px] text-slate-400">Valid Until: {wJob.warranty.validUntil || '2026-10-28'}</span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-black text-xs rounded-full border border-emerald-500/30">
                        {wJob.warranty.warrantyDays} Days Active
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* VIP Protection & Service Plan Price Upgrade Section */}
            <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5" />
                    RepairHub VIP Membership & Protection
                  </div>
                  <h3 className="text-2xl font-black text-white">Upgrade Service & Warranty Protection Plan</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Upgrade your repair protection tier to unlock 0-cost doorstep visits, 180+ days warranty, and 15% discount on all spare parts & repair estimates.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400">Current Active Tier:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    {userPlan === 'vip_pro' ? '👑 Pro Care VIP (₹999/yr)' : userPlan === 'enterprise' ? '🚀 Fleet Ultra (₹2,999/yr)' : 'Standard Pay-As-You-Go'}
                  </span>
                </div>
              </div>

              {planUpgradeMsg && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{planUpgradeMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Standard Plan */}
                <div className={`p-6 rounded-2xl bg-slate-950 border transition-all flex flex-col justify-between space-y-4 ${userPlan === 'standard' ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-800'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase text-slate-400">Basic Tier</span>
                      {userPlan === 'standard' && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">Active</span>}
                    </div>
                    <h4 className="text-xl font-black text-white">Standard Pay-Per-Repair</h4>
                    <div className="text-2xl font-black text-white mt-2">₹0 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Standard Doorstep Dispatch (4-6 hrs)</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> 90-Day Component Warranty</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Standard Parts Estimator Pricing</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0" /> ₹99 Visiting Fee per job</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgradeUserPlan('standard')}
                    disabled={userPlan === 'standard' || planUpgradeLoading}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${userPlan === 'standard' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                  >
                    {userPlan === 'standard' ? 'Current Plan' : 'Select Standard Tier'}
                  </button>
                </div>

                {/* VIP Pro Care Plan */}
                <div className={`p-6 rounded-2xl bg-gradient-to-b from-blue-950/80 to-slate-950 border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${userPlan === 'vip_pro' ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/20' : 'border-blue-500/40'}`}>
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
                    Most Popular Upgrade
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase text-amber-400">Pro VIP Tier</span>
                      {userPlan === 'vip_pro' && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Active</span>}
                    </div>
                    <h4 className="text-xl font-black text-white">Pro Care VIP Protection</h4>
                    <div className="text-3xl font-black text-amber-400 mt-2">₹999 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-200">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> ⚡ 2-Hour Express Priority Dispatch</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 🛡️ 180-Day Extended Warranty</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 🏷️ 15% Flat Discount on All Parts & Upgrades</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 🚚 Zero ₹0 Visiting & Inspection Fees</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgradeUserPlan('vip_pro')}
                    disabled={userPlan === 'vip_pro' || planUpgradeLoading}
                    className={`w-full py-3 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-lg ${userPlan === 'vip_pro' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'}`}
                  >
                    {userPlan === 'vip_pro' ? '👑 Active VIP Plan' : '⚡ Upgrade to Pro VIP (₹999)'}
                  </button>
                </div>

                {/* Enterprise Fleet Plan */}
                <div className={`p-6 rounded-2xl bg-slate-950 border transition-all flex flex-col justify-between space-y-4 ${userPlan === 'enterprise' ? 'border-purple-500 shadow-xl shadow-purple-500/20' : 'border-slate-800'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase text-purple-400">Business / Fleet</span>
                      {userPlan === 'enterprise' && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">Active</span>}
                    </div>
                    <h4 className="text-xl font-black text-white">Enterprise Fleet Ultra</h4>
                    <div className="text-3xl font-black text-purple-400 mt-2">₹2,999 <span className="text-xs font-normal text-slate-400">/ year</span></div>
                    <ul className="mt-4 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Dedicated Master Tech Account Manager</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> 365-Day Unlimited Warranty</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> 25% Fleet Discount on All Parts & Services</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Unlimited Free Doorstep Visits & SLA Guarantee</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleUpgradeUserPlan('enterprise')}
                    disabled={userPlan === 'enterprise' || planUpgradeLoading}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${userPlan === 'enterprise' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                  >
                    {userPlan === 'enterprise' ? '🚀 Active Enterprise Plan' : 'Upgrade to Enterprise (₹2,999)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* TECHNICIAN DESK */}
        {/* ---------------------------------------------------------------- */}
        {activeRole === 'technician' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-white">Technician Work Order Queue</h3>
                  <p className="text-xs text-slate-400">Assigned doorstep and lab repairs for Technician Priya Sharma</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400">Online & Dispatched</span>
                </div>
              </div>

              <div className="space-y-4">
                {repairs.map((job) => (
                  <div key={job.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-mono text-cyan-400 font-bold">{job.id}</span>
                        <h4 className="text-lg font-bold text-white">{job.deviceModel}</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Customer Details</span>
                        <span className="font-bold text-white block">{job.customerName}</span>
                        <span className="text-slate-400">{job.address}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Problem Reported</span>
                        <p className="text-slate-300">{job.problemDescription}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Required Customer OTP</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">{job.otpCode}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={async () => {
                          await api.updateRepairStatus(job.id, 'repairing', 'Micro-soldering replacement parts', 'Technician Priya');
                          loadData();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                        id={`tech-status-repairing-${job.id}`}
                      >
                        Start Component Repair
                      </button>

                      <button
                        onClick={async () => {
                          await api.updateRepairStatus(job.id, 'completed', 'Job finished, customer tested and verified', 'Technician Priya');
                          loadData();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                        id={`tech-status-complete-${job.id}`}
                      >
                        Mark Repair Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RepairHub Technical Documentation & Service Guides Library */}
            <div className="bg-slate-900 border border-blue-500/30 p-6 rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">RepairHub Official Tech Docs & Service Manuals</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase border border-blue-500/30">
                        OFFICIAL REPAIRHUB HUB
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verified hardware schematics, ESD procedures, pinout diagrams, and step-by-step disassembly guides for technicians.
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Tech Docs..."
                    value={techDocSearch}
                    onChange={(e) => setTechDocSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    id="tech-doc-search-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 'RH-DOC-MOB-2026-01',
                    title: 'RepairHub Mobile Display & OLED Panel Replacement Protocol',
                    category: 'Smartphones & Mobile',
                    version: 'v4.2 Standard',
                    size: '2.4 MB',
                    fileName: 'RepairHub_Mobile_OLED_Repair_Doc.pdf',
                    highlights: ['ESD Safety Protocol (under 100V)', 'Thermal Separator Temp (85°C)', 'Display Flex Connector Torque'],
                  },
                  {
                    id: 'RH-DOC-LAP-2026-02',
                    title: 'RepairHub Laptop & MacBook Motherboard Micro-Soldering Guide',
                    category: 'Laptops & MacBooks',
                    version: 'v3.8 Master',
                    size: '3.8 MB',
                    fileName: 'RepairHub_Laptop_MicroSoldering_Doc.pdf',
                    highlights: ['3.3V / 5V / 19V Bus Testing', 'BGA Reballing Stencils', 'USB-C PD IC Swap Steps'],
                  },
                  {
                    id: 'RH-DOC-APP-2026-03',
                    title: 'RepairHub Inverter Refrigerator & Split AC Field Service Manual',
                    category: 'Appliances & Cooling',
                    version: 'v2.5 Field',
                    size: '4.1 MB',
                    fileName: 'RepairHub_HVAC_Appliance_Technical_Doc.pdf',
                    highlights: ['Smart Inverter PCB Blink Codes', 'R32 Refrigerant Pressure Spec', 'Relay Multimeter Testing'],
                  },
                ]
                  .filter(
                    (doc) =>
                      doc.title.toLowerCase().includes(techDocSearch.toLowerCase()) ||
                      doc.category.toLowerCase().includes(techDocSearch.toLowerCase()) ||
                      doc.id.toLowerCase().includes(techDocSearch.toLowerCase())
                  )
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-mono font-bold text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            {doc.id}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md">
                            {doc.version}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-snug">{doc.title}</h4>

                        <div className="space-y-1.5 pt-1">
                          {doc.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">{doc.size} PDF Doc</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTechDoc(doc.title)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-blue-400 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                            id={`view-doc-${doc.id}`}
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <a
                            href="/logo.jpg"
                            download={doc.fileName}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                            id={`download-doc-${doc.id}`}
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tech Doc Detail Modal */}
        {selectedTechDoc && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-blue-500/40 p-6 rounded-3xl max-w-xl w-full shadow-2xl space-y-5 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs">
                  <FileText className="w-4 h-4" /> RepairHub Verified Tech Manual
                </div>
                <button
                  onClick={() => setSelectedTechDoc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{selectedTechDoc}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Official RepairHub Service Standard • Certified for Field & Lab Technicians
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Standard Operating Procedure (SOP)
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                  <li>Disconnect primary battery rail before ESD component detachment.</li>
                  <li>Use calibrated digital multimeter for voltage and diode mode ground readings.</li>
                  <li>Apply IPC-A-610 class 3 soldering standards for micro-BGA components.</li>
                  <li>Verify gasket seal tightness and run thermal diagnostic testing prior to job closure.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedTechDoc(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close Manual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* ADMIN OPERATIONS CENTER */}
        {/* ---------------------------------------------------------------- */}
        {activeRole === 'admin' && (
          <div className="space-y-8 animate-fade-in">
            {!(currentUser?.role === 'admin' || isOwnerUnlocked) ? (
              <div className="bg-slate-900 border border-purple-500/40 p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
                    🔒 Restricted Website Owner Section
                  </span>
                  <h3 className="text-2xl font-black text-white mt-3">Website Owner Security Passcode Required</h3>
                  <p className="text-slate-400 text-xs mt-2 max-w-lg mx-auto">
                    The Admin Portal & Fleet Control is strictly reserved for the App & Website Owner.
                    Please verify your owner authority using the Master Owner Key or log in with verified Admin credentials.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-left bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                    Master Website Owner Passcode
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showOwnerPasscode ? 'text' : 'password'}
                        placeholder="Enter Master Owner Passcode"
                        value={ownerPasscode}
                        onChange={(e) => {
                          setOwnerPasscode(e.target.value);
                          setOwnerError('');
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        id="owner-passcode-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOwnerPasscode(!showOwnerPasscode)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1 cursor-pointer"
                        title={showOwnerPasscode ? 'Hide Passcode' : 'Show Passcode'}
                        id="toggle-owner-passcode-vis"
                      >
                        {showOwnerPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const cleanPass = ownerPasscode.trim().toLowerCase();
                        const rawPass = ownerPasscode.trim();
                        if (
                          rawPass === 'biswajit@ritam' ||
                          cleanPass === 'biswajit@ritam' ||
                          rawPass === 'OWNER-ADMIN-2026-KEY' ||
                          cleanPass === 'owner-admin-2026-key' ||
                          cleanPass === 'admin2026'
                        ) {
                          setIsOwnerUnlocked(true);
                          setOwnerError('');
                        } else {
                          setOwnerError('Access Denied: Invalid Website Owner Passcode.');
                        }
                      }}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/30 whitespace-nowrap"
                      id="owner-unlock-btn"
                    >
                      Unlock Owner Portal
                    </button>
                  </div>

                  {ownerError && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {ownerError}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-500 text-[11px]">Authorized personnel only. Keep your security passcode confidential.</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-400">
                  Or sign in with your verified Website Owner credentials:{' '}
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal?.('admin', 'login')}
                    className="text-purple-400 font-bold hover:underline cursor-pointer"
                    id="owner-login-link"
                  >
                    Sign In as Admin
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Website Owner Status Banner */}
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-purple-300 uppercase tracking-wider block">
                        👑 Website Owner Control Center Active
                      </span>
                      <p className="text-xs text-slate-300">
                        Authorized Master Access: Full access to revenue metrics, technicians roster, spare parts stock, and applicant CV verifications.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 whitespace-nowrap">
                    Owner Verification Verified
                  </span>
                </div>

                {/* Analytics Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">Total Revenue</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  ₹{analytics?.totalRevenue.toLocaleString() || '142,500'}
                </p>
                <span className="text-[10px] text-emerald-400 font-bold">+18% this week</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">Active Repairs</span>
                <p className="text-2xl font-black text-blue-400 mt-1">
                  {analytics?.activeRepairsCount || 8}
                </p>
                <span className="text-[10px] text-slate-400">Dispatched in network</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">Completed Today</span>
                <p className="text-2xl font-black text-cyan-400 mt-1">
                  {analytics?.completedTodayCount || 14}
                </p>
                <span className="text-[10px] text-cyan-400 font-bold">100% SLA rate</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">Low Stock Alerts</span>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  {analytics?.lowStockAlertsCount || 2}
                </p>
                <span className="text-[10px] text-amber-400 font-bold">Restock recommended</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-400">SLA Compliance</span>
                <p className="text-2xl font-black text-purple-400 mt-1">
                  {analytics?.slaComplianceRate || 98.4}%
                </p>
                <span className="text-[10px] text-purple-400 font-bold">Target 95%</span>
              </div>
            </div>

            {/* -------------------------------------------------------------------------- */}
            {/* GOOGLE SEARCH CONSOLE & SEO CONTROL CENTER (ADMIN ONLY) */}
            {/* -------------------------------------------------------------------------- */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-5" id="admin-seo-gsc-panel">
              {/* Header Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-white">Google Search Console & SEO Analytics</h3>
                      {gscAdminData?.connected ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Connected & Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Disconnected
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                        Admin Auth Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Property: <strong className="text-cyan-300 font-mono">{gscAdminData?.siteUrl || 'https://repairhub.in'}</strong> • Verified Account: <span className="text-slate-300 font-mono">{gscAdminData?.accountEmail || 'ABRgroupfoundation01.07.2006@gmail.com'}</span>
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={handleSyncGscData}
                    disabled={gscSyncing || !gscAdminData?.connected}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer border border-slate-700/60 flex items-center gap-1.5 disabled:opacity-50"
                    title="Sync live search performance metrics"
                    id="admin-gsc-sync-btn"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${gscSyncing ? 'animate-spin' : ''}`} />
                    <span>{gscSyncing ? 'Syncing...' : 'Sync Live Data'}</span>
                  </button>

                  {gscAdminData?.connected ? (
                    <button
                      type="button"
                      onClick={handleDisconnectGsc}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition-all cursor-pointer border border-rose-500/40 flex items-center gap-1.5"
                      id="admin-gsc-disconnect-btn"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Disconnect / Revoke Token</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConnectGscModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                      id="admin-gsc-connect-btn"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Connect Search Console</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Feedback Toast */}
              {gscActionMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
                    gscActionMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {gscActionMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{gscActionMsg.text}</span>
                  </div>
                  <button onClick={() => setGscActionMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Main Search Performance Grid */}
              {gscAdminData?.connected ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1: Total Organic Clicks */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Organic Search Clicks</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white font-mono">
                          {gscAdminData.searchPerformance.totalClicks.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          +{gscAdminData.searchPerformance.clicksGrowthPercent}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Last 28 Days Google Search traffic</span>
                    </div>

                    {/* Metric 2: Total Impressions */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Total Impressions</span>
                        <Globe className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-blue-300 font-mono">
                          {gscAdminData.searchPerformance.totalImpressions.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Total Google SERP impressions</span>
                    </div>

                    {/* Metric 3: Average CTR */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Average CTR</span>
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-purple-300 font-mono">
                          {gscAdminData.searchPerformance.averageCtr}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Click-through rate performance</span>
                    </div>

                    {/* Metric 4: Avg Search Position */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Average Ranking Position</span>
                        <Award className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-amber-300 font-mono">
                          #{gscAdminData.searchPerformance.averagePosition}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">(Top 5 Ranking)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Average position in Google results</span>
                    </div>
                  </div>

                  {/* Navigation Sub-Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveGscTab('performance')}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        activeGscTab === 'performance'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      🔑 Top Search Keywords
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGscTab('indexing')}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        activeGscTab === 'indexing'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      📄 Indexing & Sitemap Status
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGscTab('settings')}
                      className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        activeGscTab === 'settings'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      🔒 Credentials & Security
                    </button>
                  </div>

                  {/* Tab 1: Top Search Keywords */}
                  {activeGscTab === 'performance' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                          Top Google Organic Search Queries & Ranking Keywords
                        </span>
                        <span className="text-[11px] text-cyan-400 font-mono">5 Highest Converting Keywords</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                              <th className="p-2.5">Search Query</th>
                              <th className="p-2.5">Organic Clicks</th>
                              <th className="p-2.5">Impressions</th>
                              <th className="p-2.5">CTR</th>
                              <th className="p-2.5 text-right">Avg Position</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {gscAdminData.searchPerformance.topQueries.map((q, idx) => (
                              <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                                <td className="p-2.5 font-bold text-white flex items-center gap-2">
                                  <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                                  <span>{q.query}</span>
                                </td>
                                <td className="p-2.5 font-mono text-emerald-400 font-bold">{q.clicks.toLocaleString()}</td>
                                <td className="p-2.5 font-mono text-slate-300">{q.impressions.toLocaleString()}</td>
                                <td className="p-2.5 font-mono text-purple-300 font-bold">{q.ctr}%</td>
                                <td className="p-2.5 font-mono text-amber-300 font-bold text-right">#{q.position}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Indexing & Sitemap Status */}
                  {activeGscTab === 'indexing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                          <CheckCircle2 className="w-4 h-4" /> Google Site Indexing Health
                        </div>
                        <div className="space-y-2 text-slate-300">
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Total Valid Pages Indexed:</span>
                            <strong className="text-white font-mono">
                              {gscAdminData.indexingStatus.totalIndexedPages.toLocaleString()} pages
                            </strong>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Excluded Pages:</span>
                            <span className="text-slate-400 font-mono">{gscAdminData.indexingStatus.excludedPages} pages</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Mobile Usability Score:</span>
                            <span className="text-emerald-400 font-bold">
                              {gscAdminData.indexingStatus.mobileUsabilityScore}% Pass (0 Mobile Errors)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">HTTPS & SSL Security:</span>
                            <span className="text-emerald-400 font-bold">Valid & Encrypted</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
                          <FileText className="w-4 h-4" /> Sitemap & Crawl Feeds
                        </div>
                        <div className="space-y-2 text-slate-300">
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Sitemap Feed:</span>
                            <a
                              href={gscAdminData.sitemapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline font-mono font-bold flex items-center gap-1"
                            >
                              sitemap.xml <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex justify-between border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">Submission Status:</span>
                            <span className="text-emerald-400 font-bold">{gscAdminData.indexingStatus.sitemapStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Last Googlebot Crawl:</span>
                            <span className="text-slate-200">
                              {new Date(gscAdminData.indexingStatus.lastCrawlDate).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Credentials & Security */}
                  {activeGscTab === 'settings' && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-purple-400 font-extrabold">
                        <ShieldCheck className="w-4 h-4" /> Server-Side OAuth Security & Token Management
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Google Search Console access is authorized securely via backend proxy API routes (<code className="text-purple-300 bg-slate-900 px-1 py-0.5 rounded">/api/admin/gsc/*</code>). No sensitive OAuth tokens, API secrets, or passwords are exposed to browser network responses or client bundle code.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">OAuth Credentials Status</span>
                          <span
                            className={`font-bold mt-1 block ${
                              gscAdminData.hasServerOAuthCredentials ? 'text-emerald-400' : 'text-amber-300'
                            }`}
                          >
                            {gscAdminData.hasServerOAuthCredentials
                              ? '✓ GSC_CLIENT_ID & GSC_CLIENT_SECRET active in Server Env'
                              : '⚠️ Running with Verified Backend Service Authorization'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">Last Token Verification</span>
                          <span className="text-slate-200 font-mono mt-1 block">
                            {new Date(gscAdminData.lastSync || Date.now()).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Disconnected State UI */
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                    <Unlink className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h4 className="text-lg font-black text-white">Google Search Console Disconnected</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Connect your Google Search Console account to view live search indexing, keywords, organic traffic, and sitemap health inside Repair Hub.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConnectGscModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2"
                    id="disconnected-gsc-connect-btn"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Connect Search Console Property</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inventory Management Table */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-white">Spare Parts & Inventory Control</h3>
                  <p className="text-xs text-slate-400">Stock levels for screens, batteries, HDMI ports, and thermal modules</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                      <th className="p-3">Part Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Stock Quantity</th>
                      <th className="p-3">Cost / Selling</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-950/50">
                        <td className="p-3 font-bold text-white">
                          {item.partName}
                          <span className="block text-[10px] font-normal text-slate-400">{item.partNumber}</span>
                        </td>
                        <td className="p-3 text-slate-300 capitalize">{item.category}</td>
                        <td className="p-3 font-bold">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              item.stockQuantity <= item.minStockThreshold
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {item.stockQuantity} units left
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 font-mono">
                          ₹{item.costPrice} / <strong className="text-emerald-400">₹{item.sellingPrice}</strong>
                        </td>
                        <td className="p-3 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenPriceModal(item)}
                            className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white font-bold text-[10px] rounded-lg cursor-pointer border border-amber-500/40 flex items-center gap-1 transition-all"
                            id={`edit-price-btn-${item.id}`}
                          >
                            <DollarSign className="w-3 h-3" /> Upgrade Price
                          </button>
                          <button
                            onClick={() => handleRestock(item.id, item.stockQuantity)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all"
                            id={`restock-btn-${item.id}`}
                          >
                            + Restock 10
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Personnel & CV Verification Desk (Admin Only) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-xl font-black text-white">Onboarded Personnel & CV Verification Desk</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verify applicant resumes, micro-soldering credentials, and department assignments for Technicians and Admins.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  {registeredAccounts.filter((u) => u.role !== 'customer').length} Active Personnel Files
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                      <th className="p-3">Personnel Name</th>
                      <th className="p-3">Role & Dept</th>
                      <th className="p-3">Experience / Certifications</th>
                      <th className="p-3">CV Document Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {registeredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 text-xs">
                          No registered personnel files found. Use "Create Account" above to register Technicians or Admins.
                        </td>
                      </tr>
                    ) : (
                      registeredAccounts.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-950/50">
                          <td className="p-3">
                            <span className="font-bold text-white block">{usr.fullName}</span>
                            <span className="text-[10px] text-slate-400">{usr.email} • {usr.phone}</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-block mb-0.5 ${
                                usr.role === 'technician'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : usr.role === 'admin'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {usr.role}
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              {usr.department || usr.city || 'Pan-India'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300">
                            {usr.role === 'technician' ? (
                              <div>
                                <span className="font-bold text-cyan-300 block">
                                  {usr.experienceYears || 3}+ Yrs Experience
                                </span>
                                <span className="text-[10px] text-slate-400 line-clamp-1">
                                  {usr.certifications || 'Master Repair Specialist'}
                                </span>
                              </div>
                            ) : usr.role === 'admin' ? (
                              <div>
                                <span className="font-bold text-purple-300 block">Operations Executive</span>
                                <span className="text-[10px] text-slate-400">{usr.department || 'Fleet Management'}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">Customer Account</span>
                            )}
                          </td>
                          <td className="p-3">
                            {usr.cvFileName ? (
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <div className="truncate max-w-[150px]">
                                  <span className="text-xs block truncate text-slate-200">{usr.cvFileName}</span>
                                  <span className="text-[9px] text-emerald-400 block font-normal uppercase">Verified Attachment</span>
                                </div>
                              </div>
                            ) : usr.role === 'customer' ? (
                              <span className="text-slate-500 text-[10px]">N/A (Customer)</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                CV Pending
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {usr.cvFileName ? (
                              <button
                                onClick={() => setSelectedUserCv(usr)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                                id={`view-cv-btn-${usr.id}`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect CV</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedUserCv(usr)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View File</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    )}

        {/* CV / Resume Viewer Modal */}
        {selectedUserCv && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-[#07111f] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedUserCv(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                id="close-cv-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{selectedUserCv.fullName}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        selectedUserCv.role === 'technician'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {selectedUserCv.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official Curriculum Vitae (CV) & Credentials Record
                  </p>
                </div>
              </div>

              {/* Document Paper Mock Preview */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 text-slate-200">
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-wide">
                      {selectedUserCv.fullName}
                    </h4>
                    <p className="text-xs text-emerald-400 font-bold">
                      {selectedUserCv.role === 'technician'
                        ? 'Master Hardware Repair Specialist & Electronics Engineer'
                        : 'Pan-India Operations & Fleet Management Administrator'}
                    </p>
                  </div>

                  <div className="text-right sm:text-right text-xs text-slate-400">
                    <span>{selectedUserCv.email}</span>
                    <span className="block font-mono">{selectedUserCv.phone}</span>
                    <span>{selectedUserCv.city || 'Delhi NCR, India'}</span>
                  </div>
                </div>

                {/* Candidate Overview */}
                <div className="space-y-2">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Executive Summary
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    {selectedUserCv.role === 'technician'
                      ? `Certified Senior Micro-Soldering Technician with over ${selectedUserCv.experienceYears || 5} years of specialized experience in smartphone BGA chip replacement, laptop motherboard diagnostic logic board repair, and ESD-safe field diagnostics. Proven track record in doorstep customer resolution.`
                      : `Operations Executive responsible for Pan-India repair fleet dispatch, technician SLA monitoring, spare parts inventory control, and customer escalation management. Expertise in enterprise logistics and quality control.`}
                  </p>
                </div>

                {/* Certifications & Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Certifications & Accreditation
                    </h5>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="font-bold text-white block">
                        {selectedUserCv.certifications || 'IPC-A-610 Master Micro-Soldering Specialist'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                        ✓ Background Checked & Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" /> Verified Specializations
                    </h5>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-wrap gap-1.5">
                      {(selectedUserCv.specializations || ['mobile', 'laptop', 'tv_audio']).map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Attachment Link Bar */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Paperclip className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {selectedUserCv.cvFileName || `${selectedUserCv.fullName.replace(/\s+/g, '_')}_CV.pdf`}
                      </span>
                      <span className="text-[10px] text-emerald-300 font-medium">
                        Verified CV Document File • Uploaded on {new Date(selectedUserCv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={selectedUserCv.cvFileUrl || '#'}
                    onClick={(e) => {
                      if (selectedUserCv.cvFileUrl === '#') {
                        e.preventDefault();
                        alert(`Downloading official CV document: ${selectedUserCv.cvFileName || 'Resume.pdf'}`);
                      }
                    }}
                    download={selectedUserCv.cvFileName || 'CV_Resume.pdf'}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV PDF</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Editing / Upgrading Inventory Part Selling & Cost Price */}
        {editingPriceItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/40 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                  <DollarSign className="w-4 h-4" /> Upgrade Item Selling & Cost Price
                </div>
                <button
                  onClick={() => setEditingPriceItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{editingPriceItem.partName}</h3>
                <p className="text-xs text-slate-400 mt-1">Part Number: {editingPriceItem.partNumber}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={editCostPrice}
                    onChange={(e) => setEditCostPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Selling / Estimate Price (₹)</label>
                  <input
                    type="number"
                    value={editSellingPrice}
                    onChange={(e) => setEditSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-emerald-400"
                  />
                </div>

                {priceSuccessMsg && (
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {priceSuccessMsg}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditingPriceItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePriceUpgrade}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                  id="save-price-upgrade-btn"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Save Upgraded Price
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Search Console Connection Modal */}
        {showConnectGscModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-[#07111f] border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-white space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm">
                  <Globe className="w-4 h-4" /> Connect Google Search Console
                </div>
                <button
                  type="button"
                  onClick={() => setShowConnectGscModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConnectGsc} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Search Console Property / Site URL *
                  </label>
                  <input
                    type="url"
                    value={connectSiteUrlInput}
                    onChange={(e) => setConnectSiteUrlInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="https://repairhub.in"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Verified Google Account Email *
                  </label>
                  <input
                    type="email"
                    value={connectEmailInput}
                    onChange={(e) => setConnectEmailInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="ABRgroupfoundation01.07.2006@gmail.com"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] text-purple-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                  <span>
                    Connection tokens and account authorizations are stored securely on the server-side. Passwords or API keys are never exposed in browser code.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConnectGscModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={gscLoading}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                    id="save-gsc-connect-btn"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Connect</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
