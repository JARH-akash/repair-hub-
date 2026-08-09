import React, { useState, useEffect } from 'react';
import { Search, Globe, ExternalLink, Copy, Check, FileText, ShieldCheck, X, Sparkles, Code, CheckCircle2, Mail } from 'lucide-react';
import { api } from '../lib/api';

interface GSCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GSCModal: React.FC<GSCModalProps> = ({ isOpen, onClose }) => {
  const [gscData, setGscData] = useState<{
    accountEmail: string;
    customDomain: string;
    currentHostUrl: string;
    siteUrl: string;
    sitemapUrl: string;
    customSitemapUrl: string;
    robotsUrl: string;
    verificationHtmlUrl: string;
    verificationMetaTag: string;
    urls: {
      welcome: string;
      dashboard: string;
      sitemaps: string;
      inspectUrl: string;
    };
    customDomainUrls: {
      welcome: string;
      dashboard: string;
      sitemaps: string;
      inspectUrl: string;
    };
    instructions: string[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<'custom' | 'app'>('custom');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadGSCData();
    }
  }, [isOpen]);

  const loadGSCData = async () => {
    setLoading(true);
    try {
      const data = await api.getGSCInfo();
      setGscData(data);
    } catch (err) {
      console.error('Failed to load GSC data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

  const accountEmail = gscData?.accountEmail || 'ABRgroupfoundation01.07.2006@gmail.com';
  const customDomain = 'https://repairhub.com';
  const currentHostUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-mvtzw2zav4ge5lbtl2v2z5-548341783487.asia-southeast1.run.app';
  
  const activeDomain = selectedTarget === 'custom' ? customDomain : (gscData?.siteUrl || currentHostUrl);
  const activeSitemap = `${activeDomain}/sitemap.xml`;
  const activeRobots = `${activeDomain}/robots.txt`;

  const welcomeGscUrl = `https://search.google.com/search-console/welcome?resource_id=${encodeURIComponent(activeDomain)}`;
  const sitemapsGscUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(activeDomain)}`;
  const dashboardGscUrl = `https://search.google.com/search-console?resource_id=${encodeURIComponent(activeDomain)}`;
  const inspectGscUrl = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(activeDomain)}&id=${encodeURIComponent(activeDomain)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-blue-500/40 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-fade-in text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> SEO & Google Search Console Account Portal
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">Google Search Console Indexing Console</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Account & Target Domain Selector Banner */}
          <div className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-indigo-950/50 p-5 rounded-2xl border border-blue-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-300">Registered Search Console Account Email:</span>
              </div>
              <span className="font-mono text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-xl font-extrabold">
                {accountEmail}
              </span>
            </div>

            {/* Domain Switcher */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Select Active Property Target URL:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTarget('custom')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedTarget === 'custom'
                      ? 'bg-blue-600/20 border-blue-400 ring-2 ring-blue-500/30 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-blue-300">Production Website Domain</span>
                    {selectedTarget === 'custom' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <span className="font-mono text-sm font-black text-white mt-1">https://repairhub.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTarget('app')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedTarget === 'app'
                      ? 'bg-blue-600/20 border-blue-400 ring-2 ring-blue-500/30 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-cyan-300">Live Application / Preview URL</span>
                    {selectedTarget === 'app' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-200 mt-1 truncate max-w-full">
                    {currentHostUrl}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Action Google Search Console Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={welcomeGscUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                id="open-gsc-add-property-btn"
              >
                <Search className="w-4 h-4" /> Add Property in Google Search Console <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={sitemapsGscUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                id="open-gsc-sitemap-btn"
              >
                <FileText className="w-4 h-4" /> Submit Sitemap to Search Console <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={dashboardGscUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                id="open-gsc-dashboard-btn"
              >
                <Globe className="w-4 h-4" /> Open Search Console Dashboard <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={inspectGscUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                id="open-gsc-inspect-btn"
              >
                <ShieldCheck className="w-4 h-4" /> Request URL Indexing <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sitemaps & Robots.txt Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" /> SEO Crawling & Indexing Feeds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sitemap URL */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">XML Sitemap URL</span>
                  <button
                    onClick={() => copyToClipboard(activeSitemap, 'sitemap')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'sitemap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'sitemap' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-400 bg-slate-900 p-2 rounded-xl border border-slate-800 truncate">
                  {activeSitemap}
                </div>
                <a
                  href={`${currentHostUrl}/sitemap.xml`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-semibold"
                >
                  Live View sitemap.xml <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Robots.txt URL */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Robots Directive URL</span>
                  <button
                    onClick={() => copyToClipboard(activeRobots, 'robots')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'robots' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'robots' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-xs text-cyan-400 bg-slate-900 p-2 rounded-xl border border-slate-800 truncate">
                  {activeRobots}
                </div>
                <a
                  href={`${currentHostUrl}/robots.txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-semibold"
                >
                  Live View robots.txt <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Ownership Verification Methods */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-amber-400" /> Property Verification Tokens
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-300">Method 1: HTML Meta Tag</span>
                  <button
                    onClick={() => copyToClipboard(`<meta name="google-site-verification" content="S87TFkF-tOtIrRf0W_JgMAKcMGQojkTKApXFXIbPNaA" />`, 'metatag')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'metatag' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'metatag' ? 'Copied Tag!' : 'Copy Tag'}
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-amber-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 overflow-x-auto select-all">
                  {`<meta name="google-site-verification" content="S87TFkF-tOtIrRf0W_JgMAKcMGQojkTKApXFXIbPNaA" />`}
                </pre>
              </div>

              <div className="pt-2 border-t border-slate-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-300">Method 2: HTML Verification File (googlef78904b5f55d64dd.html)</span>
                  <a
                    href={`${currentHostUrl}/googlef78904b5f55d64dd.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                  >
                    Test Verification File <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  Verification File URL: <span className="text-emerald-400">{activeDomain}/googlef78904b5f55d64dd.html</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Step Guide */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Search Console Setup Instructions for <span className="text-emerald-300">{accountEmail}</span>:
            </h4>
            <ol className="text-xs text-slate-300 space-y-1.5 pl-4 list-decimal leading-relaxed">
              <li>Open Google Search Console and sign in with <strong>{accountEmail}</strong>.</li>
              <li>Click <strong>Add Property</strong> and choose <strong>URL Prefix</strong>.</li>
              <li>Enter your website URL: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">{activeDomain}</code></li>
              <li>Choose <strong>HTML Tag</strong> or <strong>HTML File</strong> verification method and click <strong>Verify</strong>.</li>
              <li>Go to <strong>Sitemaps</strong> in Search Console and submit: <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">sitemap.xml</code></li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-mono">
            Owner Account: <strong className="text-emerald-400">{accountEmail}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold rounded-xl cursor-pointer transition-all"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
