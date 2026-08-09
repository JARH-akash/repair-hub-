import React, { useState } from 'react';
import {
  Wrench,
  Search,
  User,
  ShieldCheck,
  Cpu,
  Menu,
  X,
  Sparkles,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { useLanguage, Language } from '../context/LanguageContext';
import { UserPlus, LogOut } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenTracking: (trackingCode: string) => void;
  onOpenAIDiagnostics: () => void;
  onNavigateSection: (sectionId: string) => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (role?: UserRole, mode?: 'login' | 'register') => void;
  onOpenAccountModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onSelectRole,
  onOpenTracking,
  onOpenAIDiagnostics,
  onNavigateSection,
  currentUser,
  onOpenAuthModal,
  onOpenAccountModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  const languagesList: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      onOpenTracking(searchCode.trim());
      setSearchCode('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#020816]/90 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[72px] flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('home');
          }}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 shrink-0"
          id="brand-logo"
        >
          <Logo showText={false} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight">
                Repair<span className="text-blue-400">Hub</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[9px] font-extrabold uppercase text-blue-400 tracking-wider">
                Est. 2026
              </span>
            </div>
            <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {t('nav.certifiedTag')} • Est. 2026
            </span>
          </div>
        </a>

        {/* Quick Search Tracking Input */}
        <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative max-w-xs w-full">
          <input
            type="text"
            placeholder={t('nav.trackPlaceholder')}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            id="header-track-input"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1 px-2 py-0.5 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer"
            id="header-track-submit-btn"
          >
            {t('nav.trackBtn')}
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-300">
          <button
            onClick={() => onNavigateSection('services')}
            className="hover:text-white transition-colors cursor-pointer"
            id="nav-services-btn"
          >
            {t('nav.services')}
          </button>
          <button
            onClick={() => onNavigateSection('process')}
            className="hover:text-white transition-colors cursor-pointer"
            id="nav-process-btn"
          >
            {t('nav.process')}
          </button>
          <button
            onClick={() => onNavigateSection('book')}
            className="hover:text-white transition-colors cursor-pointer"
            id="nav-book-btn"
          >
            Book
          </button>
          <button
            onClick={() => onNavigateSection('tracking')}
            className="hover:text-white transition-colors cursor-pointer"
            id="nav-tracking-btn"
          >
            Tracking
          </button>
          <button
            onClick={() => onNavigateSection('portals')}
            className="hover:text-white transition-colors cursor-pointer"
            id="nav-portals-btn"
          >
            {t('nav.portals')}
          </button>
          <button
            onClick={() => onNavigateSection('ai-diagnostics')}
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-blue-300 font-bold"
            id="nav-ai-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            {t('nav.aiDiagnostics')}
          </button>
        </nav>

        {/* Language Switcher + Role Switcher & Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          
          {/* Desktop Language Dropdown Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none"
              id="language-switcher-btn"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Select Language
                </div>
                {languagesList.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      language === item.code
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    id={`lang-select-${item.code}`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.nativeName}</span>
                    </span>
                    <span className="text-[10px] opacity-75 font-mono uppercase">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth & Login Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAccountModal}
                title="Account & Profile Settings"
                className="px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-xs font-extrabold text-blue-300 flex items-center gap-1.5 transition-all cursor-pointer group"
                id="header-user-account-btn"
              >
                <User className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="truncate max-w-[120px]">{currentUser.fullName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-600 text-white uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </button>

              <button
                onClick={onOpenAccountModal}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                id="header-account-settings-btn"
              >
                <span>Edit Profile</span>
              </button>

              <button
                onClick={onLogout}
                title="Log Out Account"
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                id="header-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onSelectRole('customer');
                  onOpenAuthModal?.('customer', 'login');
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                id="role-customer-btn"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden xl:inline">Customer</span>
                <span>Login</span>
              </button>

              <button
                onClick={() => {
                  onSelectRole('technician');
                  onOpenAuthModal?.('technician', 'login');
                }}
                className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                id="role-tech-btn"
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Technician</span>
                <span>Login</span>
              </button>

              <button
                onClick={() => onOpenAccountModal?.()}
                className="px-3 py-1.5 rounded-xl border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-extrabold text-purple-300 transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap"
                id="header-create-account-btn"
              >
                <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Book Repair CTA */}
          <button
            onClick={() => onNavigateSection('book')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            id="header-book-cta"
          >
            {t('nav.bookRepair')}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle mobile menu"
          id="mobile-menu-toggle-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-4">
          
          {/* Mobile Language Selection Bar */}
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Language / भाषा:</span>
            </div>
            <div className="flex items-center gap-1">
              {languagesList.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    language === item.code
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  id={`mobile-lang-select-${item.code}`}
                >
                  {item.nativeName}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full">
            <input
              type="text"
              placeholder={t('nav.trackPlaceholder')}
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white"
              id="mobile-track-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded"
              id="mobile-track-btn"
            >
              {t('nav.trackBtn')}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onNavigateSection('services');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 text-left"
              id="mobile-nav-services"
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => {
                onOpenAIDiagnostics();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-sm font-bold text-blue-300 text-left flex items-center gap-1.5"
              id="mobile-nav-ai"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              {t('nav.aiDiagnostics')}
            </button>
            <button
              onClick={() => {
                onNavigateSection('process');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 text-left"
              id="mobile-nav-process"
            >
              {t('nav.process')}
            </button>
            <button
              onClick={() => {
                onNavigateSection('portals');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-200 text-left"
              id="mobile-nav-portals"
            >
              {t('nav.portals')}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Switch Portal Workspace</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onSelectRole('customer');
                  onNavigateSection('portals');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-1 text-xs font-bold rounded-lg border text-center ${
                  activeRole === 'customer'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                id="mobile-role-cust"
              >
                {t('nav.customer')}
              </button>
              <button
                onClick={() => {
                  onSelectRole('technician');
                  onNavigateSection('portals');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-1 text-xs font-bold rounded-lg border text-center ${
                  activeRole === 'technician'
                    ? 'bg-cyan-600 border-cyan-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                id="mobile-role-tech"
              >
                {t('nav.technician')}
              </button>
              <button
                onClick={() => {
                  onSelectRole('admin');
                  onNavigateSection('portals');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-1 text-xs font-bold rounded-lg border text-center ${
                  activeRole === 'admin'
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
                id="mobile-role-admin"
              >
                {t('nav.admin')}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onNavigateSection('book');
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow text-center cursor-pointer"
            id="mobile-book-cta"
          >
            {t('nav.bookRepair')}
          </button>
        </div>
      )}
    </header>
  );
};

