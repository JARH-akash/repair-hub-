import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Loader2,
  Camera,
  DollarSign,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../lib/api';
import { AIDiagnosticResult } from '../types';

interface AIDiagnosticSectionProps {
  onPreFillBooking: (deviceModel: string, problemDescription: string) => void;
}

const PRESET_SYMPTOMS = [
  { label: 'iPhone Screen Cracked / Unresponsive', model: 'iPhone 14 Pro', problem: 'Cracked screen after drop, touch unresponsive on top area.' },
  { label: 'MacBook Battery Drains / Overheats', model: 'MacBook Air M2', problem: 'Battery health degraded, lasts under 1 hour, trackpad gets hot.' },
  { label: 'Refrigerator / Fridge Not Cooling', model: 'LG Double Door Inverter Refrigerator', problem: 'Compressor humming sound, freezer cooling but main fridge compartment warm.' },
  { label: 'Split AC Water Dripping / Low Airflow', model: 'Daikin 1.5 Ton Inverter Split AC', problem: 'Water dripping indoors from blower unit, low cooling performance and coil icing.' },
  { label: 'PS5 No Display Output (HDMI)', model: 'PlayStation 5', problem: 'No video signal on TV screen, HDMI port pins damaged.' },
  { label: 'Samsung Phone Not Charging', model: 'Samsung Galaxy S23', problem: 'Type-C charging cable loose, phone does not detect charger.' },
  { label: 'Dell Laptop Liquid Damage', model: 'Dell XPS 15', problem: 'Accidental water splash on keyboard, laptop shuts off instantly.' },
];

export const AIDiagnosticSection: React.FC<AIDiagnosticSectionProps> = ({ onPreFillBooking }) => {
  const [deviceModel, setDeviceModel] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIDiagnosticResult | null>(null);

  const handleSelectPreset = (preset: typeof PRESET_SYMPTOMS[0]) => {
    setDeviceModel(preset.model);
    setProblemDescription(preset.problem);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnostics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceModel.trim() || !problemDescription.trim()) {
      setError('Please specify both device model and problem description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const diagResult = await api.diagnoseDevice({
        deviceModel: deviceModel.trim(),
        problemDescription: problemDescription.trim(),
        issuePhotoBase64: photoBase64 || undefined,
      });
      setResult(diagResult);
    } catch (err: any) {
      console.error('AI Diagnosis Error:', err);
      setResult(null);
      setError(err?.message || 'AI Diagnostic service is unavailable. Please check API key configuration or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-diagnostics" className="py-12 sm:py-16 lg:py-20 bg-[#07111f] text-white border-b border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            AI Diagnostic Assistant (Gemini Powered)
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Instant Smart Hardware Diagnosis
          </h2>
          <p className="text-slate-300 text-base">
            Describe your electronics failure or select a symptom preset. Gemini AI analyzes component failure probability, estimates spare parts cost, and generates troubleshooting guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Diagnostic Input Form */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Quick Symptom Presets
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESET_SYMPTOMS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-700 text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                    id={`preset-btn-${idx}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleRunDiagnostics} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Device Category / Model *
                </label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 14 Pro, Dell XPS 15, PS5..."
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                  id="ai-device-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Symptoms & Problem Description *
                </label>
                <textarea
                  placeholder="Describe what happened: screen blank after drop, no audio output, overheating, water spill..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  id="ai-problem-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Attach Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 cursor-pointer flex items-center gap-2 transition-colors">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span>{photoBase64 ? 'Change Photo' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="ai-photo-input"
                    />
                  </label>
                  {photoBase64 && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Image Attached
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="ai-run-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Analyzing Circuit & Fault Probability...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Run Gemini AI Diagnostic</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Diagnostic Result Output Card */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="bg-slate-900 border border-blue-500/40 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in">
                {/* Result Top Banner */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                      Diagnostic Output
                    </span>
                    <h3 className="text-2xl font-black text-white">{result.deviceModel}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        result.severity === 'critical' || result.severity === 'high'
                          ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                          : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      }`}
                    >
                      Severity: {result.severity}
                    </span>
                  </div>
                </div>

                {/* Probable Causes with Probability Bars */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Probable Cause Breakdown
                  </h4>
                  <div className="space-y-3">
                    {result.probableCauses.map((cause, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span className="text-slate-100">{cause.issue}</span>
                          <span className="text-blue-400">{cause.probability}% Match</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${cause.probability}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400">{cause.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimated Cost & Parts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase">Estimated Repair Cost</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">
                      ₹{result.estimatedPriceRange.min.toLocaleString()} - ₹{result.estimatedPriceRange.max.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Includes OEM parts, ESD labor & 90-day warranty</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase">Recommended Spare Parts</span>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-200">
                      {result.recommendedParts.map((part, pidx) => (
                        <li key={pidx} className="flex justify-between items-center font-semibold">
                          <span>• {part.partName}</span>
                          <span className="text-slate-400">~₹{part.estimatedCost}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* DIY Troubleshooting */}
                {result.diyTroubleshootingSteps.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Initial Safe Self-Checks
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.diyTroubleshootingSteps.map((step, sidx) => (
                        <li key={sidx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Warning */}
                {result.safetyWarning && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Technician Safety Warning</strong>
                      {result.safetyWarning}
                    </div>
                  </div>
                )}

                {/* Pre-fill CTA */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => onPreFillBooking(result.deviceModel, `${result.symptomsAnalyzed} (AI Diagnosis: ${result.probableCauses[0]?.issue || 'Hardware Failure'})`)}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    id="ai-prefill-booking-btn"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Book Doorstep Repair With This Diagnosis</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 p-8 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Gemini AI Diagnostic Engine</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Provide your device details on the left and run analysis. AI will inspect possible component faults, generate cost estimates, and outline repair guidance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
