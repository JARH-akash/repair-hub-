import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Laptop,
  Tablet,
  Tv,
  Gamepad2,
  Watch,
  Home,
  Snowflake,
  Wind,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Wrench,
  ShieldCheck,
  Copy,
  ArrowRight,
} from 'lucide-react';
import { api } from '../lib/api';
import { DeviceCategory, RepairJob, ServiceMode } from '../types';

interface BookingSectionProps {
  initialDeviceModel?: string;
  initialProblem?: string;
  onBookingSuccess: (job: RepairJob) => void;
}

const CATEGORIES: { id: DeviceCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'mobile', label: 'Mobile Phone', icon: Smartphone },
  { id: 'laptop', label: 'Laptop / Mac', icon: Laptop },
  { id: 'tablet', label: 'Tablet / iPad', icon: Tablet },
  { id: 'fridge', label: 'Refrigerator / Fridge', icon: Snowflake },
  { id: 'ac', label: 'Air Conditioner (AC)', icon: Wind },
  { id: 'tv_audio', label: 'TV & Audio', icon: Tv },
  { id: 'console', label: 'Gaming Console', icon: Gamepad2 },
  { id: 'wearable', label: 'Smartwatch', icon: Watch },
  { id: 'appliance', label: 'Home Appliance', icon: Home },
];

const SERVICE_MODES: { id: ServiceMode; label: string; desc: string }[] = [
  { id: 'doorstep', label: 'Doorstep Home Visit', desc: 'Technician arrives at your home or office with mobile repair kit.' },
  { id: 'pickup_drop', label: 'Express Pickup & Drop', desc: 'Courier picks up device, repairs at central lab, and returns.' },
  { id: 'walk_in', label: 'Store Walk-In', desc: 'Visit nearest certified RepairHub service hub.' },
  { id: 'business_fleet', label: 'Business / Fleet Repair', desc: 'Bulk device maintenance and SLA support for teams.' },
];

export const BookingSection: React.FC<BookingSectionProps> = ({
  initialDeviceModel = '',
  initialProblem = '',
  onBookingSuccess,
}) => {
  const [category, setCategory] = useState<DeviceCategory>('mobile');
  const [deviceModel, setDeviceModel] = useState(initialDeviceModel);
  const [problem, setProblem] = useState(initialProblem);
  const [serviceMode, setServiceMode] = useState<ServiceMode>('doorstep');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [preferredSlot, setPreferredSlot] = useState('Morning: 9 AM - 12 PM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdJob, setCreatedJob] = useState<RepairJob | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (initialDeviceModel) setDeviceModel(initialDeviceModel);
    if (initialProblem) setProblem(initialProblem);
  }, [initialDeviceModel, initialProblem]);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`GPS Coords: (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) - India`);
        },
        () => {
          setAddress('Doorstep Service, Main Street, Metro Area, India');
        }
      );
    } else {
      setAddress('Main Street, Metro Area, India');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !deviceModel.trim() || !problem.trim() || !address.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: address.trim(),
        deviceCategory: category,
        deviceModel: deviceModel.trim(),
        problemDescription: problem.trim(),
        serviceMode,
        preferredDate,
        preferredTimeSlot: preferredSlot,
      });

      setCreatedJob(res.job);
      onBookingSuccess(res.job);
    } catch (err: any) {
      console.error('Booking Error:', err);
      setError(err?.message || 'Failed to submit repair booking. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <section id="book" className="py-12 sm:py-16 lg:py-20 bg-[#020816] text-white border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            Seamless Booking Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Book Doorstep Repair Service
          </h2>
          <p className="text-slate-300 text-base">
            Select your device category, describe the issue, choose a visit time slot, and track technician arrival in real time.
          </p>

          {/* Mandatory ₹99 Visiting & Diagnostic Fee Feature Callout Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Standard Policy</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-extrabold font-mono">
                    ₹99 Mandatory Visiting Fee
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                    100% Bill Adjusted
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Mandatory ₹99 Doorstep Visit & Hardware Diagnostic Fee
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Covers doorstep technician arrival, thorough multi-point hardware inspection, and transparent quote generation. <strong className="text-emerald-300">The entire ₹99 fee is 100% credited towards your final repair invoice</strong> when you approve the repair!
                </p>
              </div>
            </div>

            <div className="shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center w-full md:w-auto">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Visiting Fee</span>
              <span className="text-2xl font-black text-amber-400 font-mono block">₹99</span>
              <span className="text-[10px] text-emerald-400 font-semibold block">Adjusted in Repair Bill</span>
            </div>
          </div>
        </div>

        {createdJob ? (
          /* Confirmation Display Card */
          <div className="max-w-3xl mx-auto bg-slate-900 border border-emerald-500/50 p-8 rounded-3xl shadow-2xl space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Repair Request Confirmed
              </span>
              <h3 className="text-3xl font-black text-white mt-1">Booking #{createdJob.id}</h3>
              <p className="text-slate-300 text-sm mt-1">
                Your repair job has been registered and auto-dispatched to certified technicians.
              </p>
            </div>

            {/* Mandatory ₹99 Fee Confirmation Badge */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Mandatory Visiting & Diagnostic Fee</h4>
                  <p className="text-xs text-slate-300 mt-0.5">₹99 visiting fee registered. Pay upon technician arrival or adjust against final repair invoice.</p>
                </div>
              </div>
              <span className="text-lg font-black text-amber-400 font-mono shrink-0">₹99</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase">Tracking Code</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-black text-blue-400">{createdJob.trackingCode}</span>
                  <button
                    onClick={() => handleCopyTracking(createdJob.trackingCode)}
                    className="p-1 hover:text-white text-slate-400 cursor-pointer"
                    title="Copy tracking code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedTracking && <span className="text-[10px] text-emerald-400">Copied!</span>}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase">Verification OTP</span>
                <span className="block text-2xl font-black text-cyan-400 mt-1">{createdJob.otpCode}</span>
                <span className="text-[10px] text-slate-400">Share with technician on arrival</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase">Status</span>
                <span className="block text-base font-bold text-amber-400 capitalize mt-1">
                  {createdJob.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {createdJob.technicianName ? `Assigned to ${createdJob.technicianName}` : 'Assigning technician...'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setCreatedJob(null)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Book Another Device
              </button>
            </div>
          </div>
        ) : (
          /* Main Booking Form */
          <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8">
            {/* Step 1: Device Category Selection */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-blue-400 mb-3">
                1. Select Device Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      id={`cat-btn-${cat.id}`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-center">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Device Model & Problem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Exact Device Model *
                </label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 14 Pro, MacBook Air M2, Dell XPS 15..."
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-device-model-input"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Service Mode
                </label>
                <select
                  value={serviceMode}
                  onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-service-mode-select"
                >
                  {SERVICE_MODES.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Describe Problem / Symptoms *
                </label>
                <textarea
                  placeholder="Screen cracked, touch un-responsive, battery drains fast, charging port loose..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  id="booking-problem-input"
                />
              </div>
            </div>

            {/* Step 3: Date, Time & Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Preferred Visit Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-date-input"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Time Slot
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-time-slot-select"
                >
                  <option>Morning: 9 AM - 12 PM</option>
                  <option>Afternoon: 12 PM - 4 PM</option>
                  <option>Evening: 4 PM - 8 PM</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    Service Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    id="booking-gps-btn"
                  >
                    <MapPin className="w-3 h-3" /> Use GPS Location
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Flat/House No., Building, Area, City, State, Pin Code (Available All Over India)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-address-input"
                />
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-name-input"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-phone-input"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  id="booking-email-input"
                />
              </div>
            </div>

            {/* Mandatory Booking Fee Summary Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Mandatory Visiting & Diagnostic Fee Breakdown
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  Mandatory Policy
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Doorstep Certified Technician Visit & Inspection:</span>
                  <span className="font-bold text-white font-mono">₹99</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>On-site Multi-point Hardware Diagnostic Check:</span>
                  <span className="text-emerald-400 font-medium">Included</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Final Invoice Adjustment Guarantee:</span>
                  <span className="text-emerald-400 font-medium">-₹99 (100% Credited)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200">Mandatory Initial Booking Fee:</span>
                  <p className="text-[11px] text-slate-400">Payable on technician arrival • Fully credited into repair bill</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-amber-400 font-mono">₹99</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="booking-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering Booking & Dispatching Technician...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm Doorstep Repair Request (₹99 Mandatory Visiting Fee)</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
