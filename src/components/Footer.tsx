import React from 'react';
import { Wrench, ShieldCheck, Phone, Mail, MapPin, Sparkles, Heart, Search, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAIDiagnostics: () => void;
  onOpenGSCModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAIDiagnostics, onOpenGSCModal }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#020816] border-t border-slate-800 text-slate-400 text-xs py-12 sm:py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {t('footer.tagline')}
            </p>

            <div className="flex flex-col gap-2 text-slate-300 font-semibold pt-1">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> +91 7866911678</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> ABRgroupfoundation01.07.2026@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-normal">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong className="text-emerald-400 font-semibold">Available:</strong> <span className="text-white font-medium">9:00 AM – 10:00 PM (IST), Monday – Sunday</span></span>
              </div>
            </div>
          </div>

          {/* Repairs Col */}
          <div>
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-3">Devices We Repair</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigateSection('book')} className="hover:text-white cursor-pointer">iPhone & Android Screens</button></li>
              <li><button onClick={() => onNavigateSection('book')} className="hover:text-white cursor-pointer">MacBook & Laptop Batteries</button></li>
              <li><button onClick={() => onNavigateSection('book')} className="hover:text-white cursor-pointer">PS5 / Xbox Micro-Soldering</button></li>
              <li><button onClick={() => onNavigateSection('book')} className="hover:text-white cursor-pointer">iPad & Tablet Charging Ports</button></li>
              <li><button onClick={() => onNavigateSection('book')} className="hover:text-white cursor-pointer">Smart TV & Speaker Boards</button></li>
            </ul>
          </div>

          {/* Features Col */}
          <div>
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-3">Platform Features</h4>
            <ul className="space-y-2">
              <li><button onClick={onOpenAIDiagnostics} className="hover:text-blue-300 text-blue-400 font-bold flex items-center gap-1 cursor-pointer"><Sparkles className="w-3 h-3" /> Gemini AI Diagnostics</button></li>
              {onOpenGSCModal && (
                <li><button onClick={onOpenGSCModal} className="hover:text-cyan-300 text-cyan-400 font-bold flex items-center gap-1 cursor-pointer" id="footer-gsc-btn"><Search className="w-3 h-3 text-cyan-400" /> Google Search Console & SEO</button></li>
              )}
              <li><button onClick={() => onNavigateSection('tracking')} className="hover:text-white cursor-pointer">Live Technician Map</button></li>
              <li><button onClick={() => onNavigateSection('portals')} className="hover:text-white cursor-pointer">Customer Warranty Wallet</button></li>
              <li><button onClick={() => onNavigateSection('portals')} className="hover:text-white cursor-pointer">Technician Dispatch Desk</button></li>
              <li><button onClick={() => onNavigateSection('portals')} className="hover:text-white cursor-pointer">Admin Operations Analytics</button></li>
            </ul>
          </div>

          {/* Coverage Col */}
          <div>
            <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-3">{t('footer.coverageTitle')}</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-blue-400 font-bold"><MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> All Over India (500+ Cities)</li>
              <li className="flex items-center gap-1.5 text-slate-300"><MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> Delhi NCR, Mumbai & Pune</li>
              <li className="flex items-center gap-1.5 text-slate-300"><MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> Bengaluru, Chennai & Hyderabad</li>
              <li className="flex items-center gap-1.5 text-slate-300"><MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> Kolkata, Jaipur, Lucknow & Pan-India</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits and Legal Section */}
        <div className="pt-8 border-t border-slate-800/80 space-y-6">
          {/* Glassmorphic Credit Card */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 text-center shadow-xl shadow-blue-950/20 max-w-2xl mx-auto transition-all duration-300 hover:border-slate-700/80">
            {/* Credits layout */}
            <div className="flex flex-col items-center justify-center gap-2.5 text-center">
              {/* First line: Primary highlight */}
              <p className="text-[16px] font-bold text-blue-400 tracking-tight">
                Website Developed by Akash Samanta
              </p>

              {/* Second line: Remaining credits separated by bullet points */}
              <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-slate-400">
                <span className="text-[13px]">Logo & Advertisement by Biswajit Mandi</span>
                <span className="text-slate-600 select-none">•</span>
                <span className="text-[13px]">Ideas, Helpline by Ritam Dutta</span>
                <span className="text-slate-600 select-none">•</span>
                <span className="text-[18px] font-medium">Funded by ABR Group</span>
              </div>
            </div>

            {/* Copyright Notice */}
            <div className="pt-4 text-xs text-slate-500 font-normal border-t border-slate-800/60 max-w-xs mx-auto mt-4">
              © 2026 Repair Hub. All Rights Reserved.
            </div>
          </div>

          {/* Legal Links & Tagline */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 pt-2 px-2">
            <p>Certified Pan-India Electronics Repair & Technician Network Engine.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">SLA Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
