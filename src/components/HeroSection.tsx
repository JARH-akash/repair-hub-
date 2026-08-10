import React from 'react';
import { Sparkles, Clock, ShieldCheck, Headphones, Wrench, CheckCircle2, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import officialLogo from '../assets/images/repairhub_official_logo_1785558519209.jpg';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onOpenTracking: (code?: string) => void;
  onOpenAIDiagnostic: () => void;
  onOpenAuthModal?: (role?: UserRole, mode?: 'login' | 'register') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenTracking,
  onOpenAIDiagnostic,
  onOpenAuthModal,
}) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#020816] via-[#07111f] to-[#020816] text-white py-12 sm:py-16 lg:py-20 border-b border-slate-800">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white">
              {t('hero.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">{t('hero.title2')}</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.desc')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                id="hero-book-btn"
              >
                <span>Book a Repair</span>
              </button>

              <button
                onClick={() => onOpenTracking()}
                className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-base rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-track-btn"
              >
                <span>Track a Job</span>
              </button>
            </div>

            {/* Quick Role Preview Cards matching Screenshot */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/50 transition-all text-left group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors">
                      Customer Portal
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Doorstep Service
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mb-3">
                    Book repairs, approve estimates, track visits, download invoices, and manage warranties.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => onOpenAuthModal?.('customer', 'register')}
                    className="flex-1 py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" /> Create Account
                  </button>
                  <button
                    onClick={() => onOpenAuthModal?.('customer', 'login')}
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <LogIn className="w-3 h-3" /> Login
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/50 transition-all text-left group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                      Technician Desk
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Field Roster
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mb-3">
                    Accept jobs, navigate to customers, update diagnostics, reserve parts, and close work orders.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => onOpenAuthModal?.('technician', 'register')}
                    className="flex-1 py-1.5 px-2 bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" /> Register Tech
                  </button>
                  <button
                    onClick={() => onOpenAuthModal?.('technician', 'login')}
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <LogIn className="w-3 h-3" /> Login
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Highlights Stats Ticker */}
            <div className="pt-2 grid grid-cols-3 gap-3 border-t border-slate-800/80 max-w-2xl mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left">
                <div className="flex items-center gap-1 text-white font-extrabold text-base">
                  <span>45 min</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">quick diagnostics</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left">
                <div className="flex items-center gap-1 text-white font-extrabold text-base">
                  <span>90 day</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">warranty</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-left">
                <div className="flex items-center gap-1 text-white font-extrabold text-base">
                  <span>24/7</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">repair support</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Asset Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden border border-blue-500/40 bg-slate-950 shadow-2xl shadow-blue-500/25 group p-3">
              <img
                src={officialLogo}
                alt="RepairHub Official Logo"
                className="w-full h-auto object-contain rounded-2xl transform group-hover:scale-102 transition-transform duration-500 bg-black"
                onError={(e) => {
                  if (e.currentTarget.src !== '/logo.jpg') {
                    e.currentTarget.src = '/logo.jpg';
                  } else if (e.currentTarget.src !== '/logo.png') {
                    e.currentTarget.src = '/logo.png';
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

