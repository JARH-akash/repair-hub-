import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Briefcase,
  RefreshCw,
  LogOut,
  UserPlus,
  FileText,
  UploadCloud,
  Save,
  Sparkles,
  Building,
  Key,
  Shield,
  Clock,
  Edit3,
} from 'lucide-react';
import { api } from '../lib/api';
import { UserAccount, UserRole } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onLogout: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'register'>('profile');

  // Edit Profile Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Bimal Samanta');
  const [email, setEmail] = useState(currentUser?.email || 'ABRgroupfoundation01.07.2026@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [city, setCity] = useState(currentUser?.city || 'Kolkata');
  const [address, setAddress] = useState(
    currentUser?.address || 'Sector 5, Salt Lake, Kolkata, West Bengal'
  );
  const [newPassword, setNewPassword] = useState('');
  const [is2FA, setIs2FA] = useState(currentUser?.is2FAEnabled || false);

  // New Account Registration State
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regFullName, setRegFullName] = useState('Bimal Samanta');
  const [regEmail, setRegEmail] = useState('ABRgroupfoundation01.07.2026@gmail.com');
  const [regPhone, setRegPhone] = useState('+91 98765 43210');
  const [regCity, setRegCity] = useState('Kolkata');
  const [regAddress, setRegAddress] = useState('Sector 5, Salt Lake, Kolkata, West Bengal');
  const [regPassword, setRegPassword] = useState('');
  const [regSpecializations, setRegSpecializations] = useState<string[]>(['mobile', 'laptop']);
  const [regExpYears, setRegExpYears] = useState(4);
  const [regCerts, setRegCerts] = useState('ESD-Safe Certified Micro-Soldering Specialist');
  const [regDept, setRegDept] = useState('Pan-India Fleet & Customer Operations');
  const [regSecurityKey, setRegSecurityKey] = useState('');
  const [regCvName, setRegCvName] = useState('RepairHub_Personnel_Doc.pdf');

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || 'Bimal Samanta');
      setEmail(currentUser.email || 'ABRgroupfoundation01.07.2026@gmail.com');
      setPhone(currentUser.phone || '+91 98765 43210');
      setCity(currentUser.city || 'Kolkata');
      setAddress(currentUser.address || 'Sector 5, Salt Lake, Kolkata, West Bengal');
      setIs2FA(!!currentUser.is2FAEnabled);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Full name, email address, and phone number are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.updateUserProfile({
        id: currentUser?.id || 'USR-CUST-101',
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        password: newPassword.trim() || undefined,
        is2FAEnabled: is2FA,
      });

      if (res.user) {
        onUpdateUser(res.user);
        setSuccessMsg('Account profile details and email updated successfully!');
        setNewPassword('');
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating account profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (role: UserRole) => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const demoEmails: Record<UserRole, string> = {
        customer: 'ABRgroupfoundation01.07.2026@gmail.com',
        technician: 'rahul.tech@repairhub.in',
        admin: 'admin@repairhub.in',
        developer: 'dev.lead@repairhub.in',
      };

      const res = await api.loginAccount({
        email: demoEmails[role],
        role,
      });

      if (res.user) {
        onLoginSuccess(res.user);
        setSuccessMsg(`Switched to ${res.user.fullName} (${res.user.role.toUpperCase()})`);
        setTimeout(() => {
          setSuccessMsg('');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to switch account.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMsg('Please fill in required registration details (Name, Email, Phone).');
      setLoading(false);
      return;
    }

    try {
      const res = await api.registerAccount({
        role: regRole,
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim(),
        city: regCity.trim(),
        address: regAddress.trim(),
        password: regPassword.trim() || 'default123',
        specializations: regSpecializations,
        experienceYears: regExpYears,
        certifications: regCerts,
        department: regDept,
        adminSecurityKey: regSecurityKey,
        cvFileName: regCvName,
      });

      if (res.user) {
        onLoginSuccess(res.user);
        setSuccessMsg(`New ${regRole.toUpperCase()} account created for ${res.user.email}!`);
        setActiveTab('profile');
      } else {
        setErrorMsg('Could not register account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Account registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#07111f] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Account & Profile Section
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {currentUser?.role || 'User'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage your name, email, phone, credentials, and security preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            id="close-account-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-6 font-semibold text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            id="tab-edit-profile"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            id="tab-create-account"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* User Info Overview Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">{fullName || 'User Account'}</h3>
                  <p className="text-xs text-blue-400 font-mono">{email || 'ABRgroupfoundation01.07.2026@gmail.com'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-mono">
                  Account ID: {currentUser?.id || 'USR-CUST-101'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Active Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. ABR Group Foundation"
                  id="acc-fullname-input"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="ABRgroupfoundation01.07.2026@gmail.com"
                  id="acc-email-input"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="+91 98765 43210"
                  id="acc-phone-input"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" /> City / Region
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Kolkata, Delhi NCR, Mumbai"
                  id="acc-city-input"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Doorstep Service / Delivery Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter complete door/street address for technician home visits..."
                id="acc-address-textarea"
              />
            </div>

            {/* Change Password & Security Settings */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-cyan-400" /> Security & Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Update Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="Leave blank to keep existing"
                    id="acc-new-password"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">2FA Authentication</span>
                    <span className="text-[10px] text-slate-400 block">Require OTP verification</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={is2FA}
                    onChange={(e) => setIs2FA(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700 cursor-pointer"
                    id="acc-2fa-checkbox"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                id="acc-logout-btn"
              >
                <LogOut className="w-4 h-4" /> Log Out Account
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
                id="acc-save-profile-btn"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER NEW ACCOUNT */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Select Account Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'customer', label: 'Customer', icon: User },
                  { id: 'technician', label: 'Technician', icon: Wrench },
                  { id: 'admin', label: 'Admin', icon: ShieldCheck },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegRole(r.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        regRole === r.id
                          ? 'border-blue-500 bg-blue-600/20 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                      id={`reg-role-${r.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="e.g. ABR Group Foundation"
                  required
                  id="reg-fullname"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="ABRgroupfoundation01.07.2026@gmail.com"
                  required
                  id="reg-email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="+91 98765 43210"
                  required
                  id="reg-phone"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">City / Region</label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Kolkata / Delhi NCR"
                  id="reg-city"
                />
              </div>
            </div>

            {/* Admin Security Passcode */}
            {regRole === 'admin' && (
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <label className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Admin Security Passcode
                </label>
                <input
                  type="password"
                  value={regSecurityKey}
                  onChange={(e) => setRegSecurityKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-100 text-xs focus:outline-none"
                  placeholder="Enter Passcode (e.g. OWNER-ADMIN-2026-KEY)"
                  required
                  id="reg-admin-passcode"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
              id="reg-submit-btn"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create {regRole.toUpperCase()} Account</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
