import React, { useState } from 'react';
import { Headphones, MessageSquare, Clock, ShieldCheck, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

export const SupportSection: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await api.createSupportTicket({
        customerEmail: customerEmail.trim() || 'ABRgroupfoundation01.07.2026@gmail.com',
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="process" className="py-12 sm:py-16 lg:py-20 bg-[#07111f] text-white border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Headphones className="w-3.5 h-3.5" />
            24/7 Support & Quality Guarantee
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Always-On Help & Repair SLA
          </h2>
          <p className="text-slate-300 text-base">
            Every repair follows our 4-step quality assurance protocol: Inspection, Quote Approval, Precision Component Soldering, and Post-Repair Calibration.
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 h-full flex flex-col justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-base shrink-0">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Book & Auto-Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select device and time slot. Nearest certified technician is dispatched with OEM spare parts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 h-full flex flex-col justify-start">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-black text-base shrink-0">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Live Diagnosis & Quote</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Technician verifies voltage & screen lines on-site. Itemized estimate is sent to your app for approval.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 h-full flex flex-col justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-black text-base shrink-0">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Precision ESD Repair</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Component installation using anti-static mats and torque-calibrated precision instruments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 h-full flex flex-col justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-base shrink-0">
              04
            </div>
            <h3 className="text-lg font-bold text-white">90-Day Warranty Start</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customer verifies touch & display quality, pays via UPI/Card, and digital warranty activates immediately.
            </p>
          </div>
        </div>

        {/* Support Ticket Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-xl font-black text-white">Submit Support Ticket</h3>
                <p className="text-xs text-slate-400">Have questions about warranty coverage or booking status?</p>
              </div>
            </div>
            <div className="text-xs text-slate-300 space-y-1 bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <p className="font-bold text-emerald-400">Direct Contact:</p>
              <p>📞 Phone: <span className="text-white font-mono">7866911678</span></p>
              <p>✉️ Email: <span className="text-white">ABRgroupfoundation01.07.2026@gmail.com</span></p>
              <p className="pt-0.5 text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong className="text-emerald-400 font-semibold">Available:</strong> <span className="text-white font-medium">9:00 AM – 10:00 PM (IST), Monday – Sunday</span></span>
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Support Ticket Submitted</h4>
              <p className="text-xs text-slate-300">Our customer success agent will respond shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-400 underline cursor-pointer"
              >
                Submit another query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Your Email Address..."
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  id="ticket-email-input"
                />
                <input
                  type="text"
                  placeholder="Subject (e.g. Warranty Claim)..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  id="ticket-subject-input"
                />
              </div>

              <textarea
                placeholder="Describe your query..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                id="ticket-message-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                id="ticket-submit-btn"
              >
                <Send className="w-4 h-4" /> Send Support Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
