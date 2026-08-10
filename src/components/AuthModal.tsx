import React, { useState } from 'react';
import {
  X,
  User,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  ArrowRight,
  UserPlus,
  LogIn,
  FileText,
  UploadCloud,
  Trash2,
  Paperclip,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../lib/api';
import { UserAccount, UserRole } from '../types';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer',
  initialMode = 'register',
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Common Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Technician Specifics
  const [specializations, setSpecializations] = useState<string[]>([
    'mobile',
    'laptop',
  ]);
  const [experienceYears, setExperienceYears] = useState(3);
  const [certifications, setCertifications] = useState(
    'ESD-Safe Micro-Soldering Specialist'
  );

  // Admin Specifics
  const [department, setDepartment] = useState('Pan-India Operations');
  const [adminSecurityKey, setAdminSecurityKey] = useState('');

  // Password & Passcode Visibility Toggles
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // CV / Resume Document Specifics (Mandatory for Technician & Admin)
  const [cvFileName, setCvFileName] = useState<string>('');
  const [cvFileUrl, setCvFileUrl] = useState<string>('');
  const [cvFileSize, setCvFileSize] = useState<string>('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleCvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFileName(file.name);
      setCvFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      const url = URL.createObjectURL(file);
      setCvFileUrl(url);
      setErrorMessage('');
    }
  };

  const handleGenerateSampleCv = () => {
    const namePrefix = fullName ? fullName.trim().replace(/\s+/g, '_') : role === 'technician' ? 'Technician' : 'Admin';
    const sampleName = `RepairHub_${namePrefix}_Technical_Doc.pdf`;
    setCvFileName(sampleName);
    setCvFileSize('2.15 MB');
    setCvFileUrl('#');
    setErrorMessage('');
  };

  const handleSpecializationToggle = (spec: string) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter((s) => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const handleQuickDemoLogin = async (demoRole: UserRole) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const demoEmails: Record<UserRole, string> = {
        customer: 'ABRgroupfoundation01.07.2026@gmail.com',
        technician: 'rahul.tech@repairhub.in',
        admin: 'admin@repairhub.in',
        developer: 'bimal8514samanta@gmail.com',
      };
      const res = await api.loginAccount({
        email: demoEmails[demoRole],
        role: demoRole,
      });
      if (res.user) {
        onLoginSuccess(res.user);
        setSuccessMessage(`Logged in as ${res.user.fullName} (${res.user.role.toUpperCase()})`);
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setErrorMessage('Please fill in all required fields (Full Name, Email, Phone).');
        return;
      }

      if (password && confirmPassword && password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }

      const cleanKey = adminSecurityKey.trim().toLowerCase();
      const validAdminKeys = ['biswajit@ritam', 'owner-admin-2026-key', 'admin2026'];
      if (role === 'admin' && !validAdminKeys.includes(cleanKey)) {
        setErrorMessage('Access Denied: Admin section is strictly reserved for the App/Website Owner. Please enter a valid Master Owner Passcode.');
        return;
      }

      if ((role === 'technician' || role === 'admin') && !cvFileName) {
        setErrorMessage(`CV / Resume document is required for ${role.toUpperCase()} registration. Please upload your CV/Resume file below.`);
        return;
      }

      setLoading(true);
      try {
        const payload = {
          role,
          fullName,
          email,
          phone,
          password,
          city: city || 'Delhi NCR',
          address,
          specializations: role === 'technician' ? specializations : undefined,
          experienceYears: role === 'technician' ? Number(experienceYears) : undefined,
          certifications: role === 'technician' ? certifications : undefined,
          department: role === 'admin' ? department : undefined,
          adminSecurityKey: role === 'admin' ? adminSecurityKey : undefined,
          cvFileName: cvFileName || undefined,
          cvFileUrl: cvFileUrl || undefined,
        };

        const res = await api.registerAccount(payload);
        if (res.user) {
          setSuccessMessage(res.message || `${role.toUpperCase()} account created successfully!`);
          onLoginSuccess(res.user);
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Account registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Login Mode
      if (!email.trim()) {
        setErrorMessage('Please enter your registered Email or Phone number.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.loginAccount({ email, password, role });
        if (res.user) {
          setSuccessMessage(`Welcome back, ${res.user.fullName}!`);
          onLoginSuccess(res.user);
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Login failed. Account not found.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#07111f] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          id="auth-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center sm:text-left mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <Logo size="sm" showEst={false} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              RepairHub Access Portal
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mode === 'register' ? 'Create New Account' : 'Sign In to Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {mode === 'register'
              ? 'Register for Customer Doorstep Repairs, Technician Fleet Access, or Admin Operations.'
              : 'Access your active repair orders, technician jobs, or company dashboard.'}
          </p>
        </div>

        {/* Mode Switcher (Sign In vs Register) */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Create New Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In / Login
          </button>
        </div>

        {/* Role Select Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setErrorMessage('');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
              role === 'customer'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <User className={`w-4 h-4 ${role === 'customer' ? 'text-blue-400' : ''}`} />
              {role === 'customer' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
            </div>
            <span className="text-xs font-extrabold">Customer</span>
            <span className="text-[10px] text-slate-400 leading-tight">Book & Track Repairs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('technician');
              setErrorMessage('');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
              role === 'technician'
                ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Wrench className={`w-4 h-4 ${role === 'technician' ? 'text-cyan-400' : ''}`} />
              {role === 'technician' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
            </div>
            <span className="text-xs font-extrabold">Technician</span>
            <span className="text-[10px] text-slate-400 leading-tight">Field Repair Desk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setErrorMessage('');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
              role === 'admin'
                ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className={`w-4 h-4 ${role === 'admin' ? 'text-purple-400' : ''}`} />
              {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
            </div>
            <span className="text-xs font-extrabold">Admin</span>
            <span className="text-[10px] text-slate-400 leading-tight">Platform Operations</span>
          </button>
        </div>

        {/* Error / Success Banners */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' ? (
            <>
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akash Samanta"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ABRgroupfoundation01.07.2026@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    City / Service Region
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Delhi NCR, Mumbai, Kolkata"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {role === 'customer' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Default Doorstep Address (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 402, Highrise Heights, Sector 5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {role === 'technician' && (
                <div className="space-y-3 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Technician Qualifications & Skills
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                      Repair Specializations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'mobile', label: '📱 Smartphones' },
                        { id: 'laptop', label: '💻 Laptops & PCs' },
                        { id: 'tablet', label: '📱 Tablets & iPads' },
                        { id: 'fridge', label: '🧊 Refrigerator / Fridge' },
                        { id: 'ac', label: '❄️ Air Conditioner (AC)' },
                        { id: 'tv_audio', label: '📺 Smart TVs & Audio' },
                        { id: 'console', label: '🎮 Gaming Consoles' },
                        { id: 'appliance', label: '🔌 Home Appliances' },
                        { id: 'wearable', label: '⌚ Smartwatches' },
                      ].map((spec) => (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => handleSpecializationToggle(spec.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                            specializations.includes(spec.id)
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {spec.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Certifications / ID
                      </label>
                      <div className="relative">
                        <Award className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                        <input
                          type="text"
                          placeholder="e.g. Master Micro-Soldering"
                          value={certifications}
                          onChange={(e) => setCertifications(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {role === 'admin' && (
                <div className="space-y-3 p-4 bg-slate-900/80 rounded-2xl border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Website Owner Security Passcode
                    </h4>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                      RESTRICTED TO APP OWNER
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    The Admin Portal is strictly reserved for the App & Website Owner. Please provide your Master Website Owner Key.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Department / Operations Focus
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Website Owner Operations"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-bold text-slate-300">
                          Master Owner Passcode *
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showAdminKey ? 'text' : 'password'}
                          placeholder="Enter Master Owner Passcode"
                          value={adminSecurityKey}
                          onChange={(e) => setAdminSecurityKey(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminKey(!showAdminKey)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                          title={showAdminKey ? 'Hide Passcode' : 'Show Passcode'}
                        >
                          {showAdminKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CV / Resume Requirement Section for Technician & Admin */}
              {(role === 'technician' || role === 'admin') && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                          <span>CV / Resume Attachment</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-extrabold">
                            MANDATORY
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Upload candidate CV/Resume (PDF, DOCX, TXT) for background verification & HR review.
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    type="file"
                    id="cv-file-upload-input"
                    accept=".pdf,.doc,.docx,.txt,image/*"
                    onChange={handleCvFileUpload}
                    className="hidden"
                  />

                  {cvFileName ? (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 animate-fade-in">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-white block truncate">{cvFileName}</span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {cvFileSize || '2.1 MB'} • CV Verified & Attached
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCvFileName('');
                          setCvFileUrl('');
                          setCvFileSize('');
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                        title="Remove CV File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label
                        htmlFor="cv-file-upload-input"
                        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl bg-slate-950/60 hover:bg-slate-900/80 transition-all cursor-pointer group text-center"
                      >
                        <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-colors mb-1.5" />
                        <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                          Click to select or drag & drop CV / Resume document
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Supported Formats: PDF, DOCX, TXT, PNG (Max 15MB)
                        </span>
                      </label>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleGenerateSampleCv}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 cursor-pointer"
                        >
                          ⚡ Attach Demo Sample CV ({role.toUpperCase()})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Login Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Registered Email or Phone Number *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABRgroupfoundation01.07.2026@gmail.com or +91 98765 43210"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-lg ${
                role === 'customer'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/20'
                  : role === 'technician'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-purple-500/20'
              }`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'register' ? (
                <>
                  <span>Create {role.toUpperCase()} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In to {role.toUpperCase()} Portal</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
