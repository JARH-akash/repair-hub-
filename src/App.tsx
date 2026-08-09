import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AIDiagnosticSection } from './components/AIDiagnosticSection';
import { BookingSection } from './components/BookingSection';
import { TrackingSection } from './components/TrackingSection';
import { PortalTabs } from './components/PortalTabs';
import { SupportSection } from './components/SupportSection';
import { Footer } from './components/Footer';
import { InvoiceModal } from './components/InvoiceModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { DeveloperPanel } from './components/DeveloperPanel';
import { GSCModal } from './components/GSCModal';
import { RepairJob, UserAccount, UserRole } from './types';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [trackingCode, setTrackingCode] = useState<string>('RH-2026-1042');
  const [preFillModel, setPreFillModel] = useState<string>('');
  const [preFillProblem, setPreFillProblem] = useState<string>('');
  const [selectedInvoiceJob, setSelectedInvoiceJob] = useState<RepairJob | null>(null);

  // Google Search Console Modal State
  const [isGSCModalOpen, setIsGSCModalOpen] = useState<boolean>(false);

  // Hidden Developer Panel Modal State
  const [isDevPanelOpen, setIsDevPanelOpen] = useState<boolean>(false);

  // Authentication & Account State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<UserRole>('customer');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  useEffect(() => {
    // Remove any #developer hash or dev query param from URL if present
    const stripDevHash = () => {
      if (
        window.location.hash.includes('developer') ||
        window.location.hash.includes('dev') ||
        window.location.search.includes('developer=true') ||
        window.location.search.includes('dev=true')
      ) {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };
    stripDevHash();
    window.addEventListener('hashchange', stripDevHash);

    // Global Key Combination Listener for Developer Terminal ONLY via (Ctrl + Shift + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsDevPanelOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    try {
      const stored = localStorage.getItem('rh_user_account');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          setActiveRole(parsed.role);
        }
      }
    } catch (e) {
      console.warn('Could not parse stored user account', e);
    }

    return () => {
      window.removeEventListener('hashchange', stripDevHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenAuthModal = (role: UserRole = 'customer', mode: 'login' | 'register' = 'register') => {
    setAuthRole(role);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    try {
      localStorage.setItem('rh_user_account', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user account', e);
    }
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('rh_user_account', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Could not save updated user account', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rh_user_account');
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTracking = (code?: string) => {
    if (code) {
      setTrackingCode(code);
    }
    scrollToSection('tracking');
  };

  const handleOpenAIDiagnostics = () => {
    scrollToSection('ai-diagnostics');
  };

  const handlePreFillBooking = (deviceModel: string, problemDescription: string) => {
    setPreFillModel(deviceModel);
    setPreFillProblem(problemDescription);
    scrollToSection('book');
  };

  const handleBookingSuccess = (job: RepairJob) => {
    setTrackingCode(job.trackingCode);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#020816] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
        {/* Header */}
        <Header
          activeRole={activeRole}
          onSelectRole={setActiveRole}
          onOpenTracking={handleOpenTracking}
          onOpenAIDiagnostics={handleOpenAIDiagnostics}
          onNavigateSection={scrollToSection}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Sections */}
        <main id="home">
          {/* Hero Section */}
          <HeroSection
            onOpenBooking={() => scrollToSection('book')}
            onOpenTracking={() => scrollToSection('tracking')}
            onOpenAIDiagnostic={handleOpenAIDiagnostics}
            onOpenAuthModal={handleOpenAuthModal}
          />

          {/* AI Smart Hardware Diagnostics (Gemini Server-Side Powered) */}
          <AIDiagnosticSection onPreFillBooking={handlePreFillBooking} />

          {/* Booking Engine */}
          <BookingSection
            initialDeviceModel={preFillModel}
            initialProblem={preFillProblem}
            onBookingSuccess={handleBookingSuccess}
          />

          {/* Live Tracking & Technician Map */}
          <TrackingSection
            initialTrackingCode={trackingCode}
            onOpenInvoiceModal={setSelectedInvoiceJob}
          />

          {/* Multi-Role Workspace Portals (Customer, Tech, Admin) */}
          <PortalTabs
            activeRole={activeRole}
            onSelectRole={setActiveRole}
            onOpenInvoiceModal={setSelectedInvoiceJob}
            currentUser={currentUser}
            onOpenAuthModal={handleOpenAuthModal}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
          />

          {/* 24/7 Support & SLA */}
          <SupportSection />
        </main>

        {/* Footer */}
        <Footer
          onNavigateSection={scrollToSection}
          onOpenAIDiagnostics={handleOpenAIDiagnostics}
          onOpenGSCModal={() => setIsGSCModalOpen(true)}
        />

        {/* Google Search Console Modal */}
        <GSCModal
          isOpen={isGSCModalOpen}
          onClose={() => setIsGSCModalOpen(false)}
        />

        {/* Invoice Modal */}
        <InvoiceModal
          job={selectedInvoiceJob}
          onClose={() => setSelectedInvoiceJob(null)}
        />

        {/* Auth / Account Creation Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialRole={authRole}
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Centralized Account Management & Profile Edit Modal */}
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Hidden Tier 0 Developer Panel Overlay */}
        {isDevPanelOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
            <DeveloperPanel onClose={() => setIsDevPanelOpen(false)} />
          </div>
        )}
      </div>
    </LanguageProvider>
  );
}
