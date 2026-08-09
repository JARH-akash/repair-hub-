import React from 'react';
import { X, Printer, ShieldCheck, Download, CheckCircle2, FileText } from 'lucide-react';
import { RepairJob } from '../types';
import { Logo } from './Logo';

interface InvoiceModalProps {
  job: RepairJob | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-3xl shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
          id="invoice-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Logo size="md" showText={false} />
            <div>
              <span className="text-2xl font-black text-white">
                Repair<span className="text-blue-400">Hub</span>
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Certified Electronics Repair & Service Network
              </p>
              <p className="text-[11px] text-slate-500">GSTIN: 07AAAAA0000A1Z5 • ISO 9001:2015 Certified</p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Tax Invoice
            </span>
            <span className="block text-xs font-mono font-bold text-slate-300 mt-2">
              INV-{job.id.replace('RH-', '')}
            </span>
            <span className="text-[10px] text-slate-400 block">Date: {new Date(job.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Customer & Job Info */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Billed To</span>
            <strong className="text-white text-sm block">{job.customerName}</strong>
            <span className="text-slate-300 block">{job.customerPhone}</span>
            <span className="text-slate-400 block">{job.address}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase block text-[10px]">Repair Details</span>
            <strong className="text-white text-sm block">{job.deviceModel}</strong>
            <span className="text-slate-300 block">Job ID: {job.id}</span>
            <span className="text-slate-400 block">Serial: {job.serialNumber || 'SN-VERIFIED-OK'}</span>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400 block">Service & Parts Itemization</span>
          <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 text-xs">
            {job.estimate.items.length > 0 ? (
              job.estimate.items.map((item) => (
                <div key={item.id} className="p-3 bg-slate-950 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-100">{item.description}</span>
                    <span className="block text-[10px] text-slate-400">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-white">₹{item.total.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-slate-950 flex justify-between items-center">
                <span>Doorstep Inspection & Component Repair Service</span>
                <span className="font-mono font-bold text-white">₹1,500</span>
              </div>
            )}
          </div>
        </div>

        {/* Totals & Tax Calculation */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>₹{(job.estimate.subtotal || job.payment.amount || 1500).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>GST Tax (18%)</span>
            <span>₹{(job.estimate.tax || Math.round((job.payment.amount || 1500) * 0.18)).toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
            <span>Total Paid (via {job.payment.method?.toUpperCase() || 'UPI'})</span>
            <span className="text-emerald-400">₹{(job.estimate.total || job.payment.amount || 1770).toLocaleString()}</span>
          </div>
        </div>

        {/* Warranty Seal */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-3 text-xs">
          <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
          <div>
            <strong className="block font-bold text-cyan-300">
              90-Day RepairHub Guarantee Certificate #{job.warranty.certificateNumber || 'WAR-2026-88910'}
            </strong>
            <p className="text-slate-400">
              Covers touch digitizer, display anomalies, and original replacement components.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer"
            id="print-invoice-btn"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
