import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  ShieldCheck,
  Wrench,
  AlertCircle,
  FileText,
  DollarSign,
  Loader2,
  QrCode,
  MapPin,
  Star,
  UserCheck,
} from 'lucide-react';
import { api } from '../lib/api';
import { RepairJob, RepairStatus } from '../types';

interface TrackingSectionProps {
  initialTrackingCode?: string;
  onOpenInvoiceModal: (job: RepairJob) => void;
}

const STATUS_STEPS: { id: RepairStatus; label: string; desc: string }[] = [
  { id: 'booked', label: 'Booked', desc: 'Job card registered' },
  { id: 'assigned', label: 'Assigned', desc: 'Technician assigned' },
  { id: 'en_route', label: 'En Route', desc: 'Technician traveling' },
  { id: 'diagnosing', label: 'Diagnosis', desc: 'On-site check' },
  { id: 'estimate_pending', label: 'Estimate', desc: 'Quote generated' },
  { id: 'approved', label: 'Approved', desc: 'Quote accepted' },
  { id: 'repairing', label: 'Repairing', desc: 'Part installation' },
  { id: 'qc_testing', label: 'QC Check', desc: 'Diagnostics & test' },
  { id: 'completed', label: 'Completed', desc: 'Invoiced & delivered' },
];

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  initialTrackingCode = '',
  onOpenInvoiceModal,
}) => {
  const [searchInput, setSearchInput] = useState(initialTrackingCode || 'RH-2026-1042');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<RepairJob | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  const fetchJobDetails = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await api.getRepairs({ trackingCode: code });
      if (results && results.length > 0) {
        setJob(results[0]);
      } else {
        // Try fetching by exact ID
        try {
          const singleJob = await api.getRepairById(code);
          setJob(singleJob);
        } catch {
          setError(`No repair job found matching code "${code}". Try "RH-2026-1042".`);
          setJob(null);
        }
      }
    } catch (err: any) {
      console.warn('Tracking Lookup Notice:', err);
      setError('Unable to retrieve tracking details right now. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingCode) {
      setSearchInput(initialTrackingCode);
      fetchJobDetails(initialTrackingCode);
    } else {
      fetchJobDetails('RH-2026-1042');
    }
  }, [initialTrackingCode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchJobDetails(searchInput.trim());
    }
  };

  const handleApproveEstimate = async () => {
    if (!job) return;
    try {
      const res = await api.approveEstimate(job.id);
      setJob(res.job);
    } catch (err: any) {
      alert(err?.message || 'Failed to approve estimate.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !otpInput.trim()) return;
    try {
      const res = await api.verifyOtp(job.id, otpInput.trim());
      setJob(res.job);
      setOtpSuccess(true);
    } catch (err: any) {
      alert(err?.message || 'Invalid OTP code.');
    }
  };

  const handlePayNow = async () => {
    if (!job) return;
    try {
      const res = await api.processPayment(job.id, 'upi');
      setJob(res.job);
    } catch (err: any) {
      alert(err?.message || 'Payment processing error.');
    }
  };

  const getStepIndex = (status: RepairStatus) => {
    return STATUS_STEPS.findIndex((s) => s.id === status);
  };

  const currentStepIdx = job ? getStepIndex(job.status) : 0;

  return (
    <section id="tracking" className="py-12 sm:py-16 lg:py-20 bg-[#07111f] text-white border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Live Technician & Job Tracker
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Track Repair Status & Technician Location
          </h2>
          <p className="text-slate-300 text-base">
            Enter your Job ID or Tracking Code to see live technician ETA, inspect diagnostic photos, approve quotes, verify arrival OTPs, and download invoices.
          </p>
        </div>

        {/* Lookup Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mb-10 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Job ID (RH-2026-1042) or Tracking Code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              id="tracking-search-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-colors cursor-pointer flex items-center gap-2"
            id="tracking-search-btn"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track Job'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold mb-8">
            {error}
          </div>
        )}

        {job && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Overview Bar */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {job.deviceCategory}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-medium text-slate-400">Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-black text-white">{job.deviceModel}</h3>
                <p className="text-xs text-slate-300 font-medium">Customer: {job.customerName} ({job.customerPhone})</p>
                <p className="text-xs text-slate-400">Address: {job.address}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tracking ID</span>
                  <span className="text-sm font-black text-cyan-400">{job.trackingCode}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">On-Site OTP</span>
                  <span className="text-sm font-black text-emerald-400">{job.otpCode}</span>
                </div>

                {job.payment.status === 'paid' ? (
                  <button
                    onClick={() => onOpenInvoiceModal(job)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                    id="download-invoice-btn"
                  >
                    <FileText className="w-4 h-4" />
                    Download Invoice
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs uppercase">
                    Payment Pending
                  </span>
                )}
              </div>
            </div>

            {/* Visual Progress Stepper */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl overflow-x-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Repair Status Timeline
              </h4>

              <div className="flex items-center justify-between min-w-[700px] relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 -z-0" />

                {STATUS_STEPS.map((step, idx) => {
                  const isDone = currentStepIdx > idx;
                  const isActive = currentStepIdx === idx;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center text-center max-w-[80px]">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                            : isActive
                            ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 animate-pulse font-black'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span className={`text-xs font-bold mt-2 ${isActive ? 'text-cyan-400' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Grid: Left Technician Map / OTP / Estimate, Right History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Technician GPS & Action Drawers */}
              <div className="lg:col-span-7 space-y-6">
                {/* Technician GPS Card */}
                {job.technicianName && (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl">
                          <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{job.technicianName}</h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9 • Certified ESD Technician
                          </span>
                        </div>
                      </div>

                      <a
                        href={`tel:${job.technicianPhone}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                        id="call-tech-btn"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Tech
                      </a>
                    </div>

                    {/* Interactive Map Visual Simulation */}
                    <div className="relative h-48 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                      {/* Grid background simulation */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                      {/* Route Path line SVG */}
                      <svg className="absolute inset-0 w-full h-full text-cyan-500/30" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6">
                        <line x1="20%" y1="70%" x2="75%" y2="35%" />
                      </svg>

                      {/* Tech Marker */}
                      <div className="absolute left-[20%] top-[65%] transform -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/50 mx-auto">
                          <Navigation className="w-4 h-4 transform rotate-45" />
                        </div>
                        <span className="text-[10px] font-bold text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-cyan-800 mt-1 inline-block">
                          Priya (En Route)
                        </span>
                      </div>

                      {/* Customer Destination Marker */}
                      <div className="absolute left-[75%] top-[30%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-black shadow-lg mx-auto">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-200 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800 mt-1 inline-block">
                          Your Doorstep
                        </span>
                      </div>

                      {/* ETA Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs font-extrabold text-cyan-300 flex items-center gap-1.5 shadow">
                        <Clock className="w-3.5 h-3.5 animate-spin" /> ETA: {job.technicianEtaMinutes || 15} Mins
                      </div>
                    </div>
                  </div>
                )}

                {/* Estimate Approval Drawer (If Pending) */}
                {job.estimate.items.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-base font-extrabold text-white">Itemized Repair Estimate</h4>
                        <p className="text-xs text-slate-400">Parts and labor quote for this work order</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          job.estimate.approved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {job.estimate.approved ? 'Approved' : 'Approval Required'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {job.estimate.items.map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-200">{item.description}</span>
                            <span className="block text-[10px] text-slate-400">Qty: {item.quantity}</span>
                          </div>
                          <span className="font-black text-slate-100">₹{item.total.toLocaleString()}</span>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black">
                        <span className="text-slate-300">Total (Incl. Tax)</span>
                        <span className="text-emerald-400 text-lg">₹{job.estimate.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {!job.estimate.approved && (
                      <button
                        onClick={handleApproveEstimate}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition-colors cursor-pointer"
                        id="approve-estimate-btn"
                      >
                        Approve Quote & Start Repair
                      </button>
                    )}
                  </div>
                )}

                {/* On-Site Verification OTP Box */}
                {job.status === 'en_route' || job.status === 'diagnosing' ? (
                  <div className="bg-slate-900 border border-cyan-500/40 p-6 rounded-3xl shadow-xl space-y-3">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-cyan-400" /> Verify Customer On-Site Arrival
                    </h4>
                    <p className="text-xs text-slate-300">
                      When technician arrives, share your OTP code <strong className="text-emerald-400">{job.otpCode}</strong> or verify here:
                    </p>
                    <form onSubmit={handleVerifyOtp} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP..."
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold"
                        id="otp-verify-input"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                        id="otp-verify-btn"
                      >
                        Verify Code
                      </button>
                    </form>
                  </div>
                ) : null}

                {/* Pay Balance Button */}
                {job.estimate.approved && job.payment.status === 'pending' && (
                  <button
                    onClick={handlePayNow}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    id="pay-now-btn"
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>Pay Balance ₹{job.estimate.total.toLocaleString()} via UPI / Card</span>
                  </button>
                )}
              </div>

              {/* Right Column: Status Log History */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
                  Job Activity Audit Log
                </h4>

                <div className="space-y-4">
                  {job.statusHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs border-l-2 border-cyan-500 pl-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white capitalize">{item.status.replace('_', ' ')}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{item.note}</p>
                        <span className="text-[10px] text-slate-500 font-semibold">By: {item.updatedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
