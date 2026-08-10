import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import officialLogo from '../assets/images/repairhub_official_logo_1785558519209.jpg';

interface LogoProps {
  className?: string;
  imgClassName?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showEst?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  imgClassName = 'w-full h-full object-cover',
  showText = true,
  size = 'md',
  showEst = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} overflow-hidden border border-blue-500/40 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 relative group`}
      >
        {!imgError ? (
          <img
            src={officialLogo}
            alt="RepairHub Official Logo Est. 2026"
            className={imgClassName}
            onError={(e) => {
              if (e.currentTarget.src !== '/logo.jpg') {
                e.currentTarget.src = '/logo.jpg';
              } else if (e.currentTarget.src !== '/logo.png') {
                e.currentTarget.src = '/logo.png';
              } else {
                setImgError(true);
              }
            }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
            <Wrench className={`${iconSizes[size]} transform group-hover:rotate-12 transition-transform`} />
          </div>
        )}
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-white block leading-none">
              Repair<span className="text-blue-400">Hub</span>
            </span>
            {showEst && (
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[9px] font-extrabold uppercase text-blue-400 tracking-wider">
                Est. 2026
              </span>
            )}
          </div>
          {showEst && (
            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 tracking-wider uppercase">
              Est. 2026 • Doorstep Repair
            </span>
          )}
        </div>
      )}
    </div>
  );
};
