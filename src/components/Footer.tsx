import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Lock, Search } from 'lucide-react';
import { ClinicInfo, ClinicWorkingHours } from '../types/clinic';

interface FooterProps {
  clinicInfo: ClinicInfo;
  workingHours: ClinicWorkingHours[];
  onOwnerClick: () => void;
  onBookClick: () => void;
  onLookupClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  clinicInfo,
  workingHours,
  onOwnerClick,
  onBookClick,
  onLookupClick
}) => {
  return (
    <footer id="location" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg font-display">
                W
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  WeMakeSmile
                </span>
                <span className="text-[10px] uppercase font-semibold text-teal-400 block -mt-1">
                  Dental Clinic & Hospital
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {clinicInfo.tagline} Professional dental care focused on your comfort, oral health and confident smile.
            </p>

            <div className="text-xs text-slate-400 space-y-1">
              <div>NABH Hospital Standard Protocol</div>
              <div className="font-mono text-[11px] text-slate-400">Reg: {clinicInfo.licenseNumber}</div>
              <div className="font-mono text-[11px] text-slate-400">GST: {clinicInfo.gstin}</div>
            </div>
          </div>

          {/* Col 2: Clinic Location & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display">
              Clinic Location
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  {clinicInfo.address}, {clinicInfo.landmark}, {clinicInfo.city}, {clinicInfo.state} {clinicInfo.pincode}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${clinicInfo.phonePrimary}`} className="hover:text-white font-mono">
                  {clinicInfo.phonePrimary}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${clinicInfo.email}`} className="hover:text-white">
                  {clinicInfo.email}
                </a>
              </div>

              <div className="pt-1 text-teal-400 font-mono text-[11px]">
                Emergency Helpline: {clinicInfo.emergencyPhone}
              </div>
            </div>
          </div>

          {/* Col 3: Working Hours (Asia/Kolkata) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Consultation Hours</span>
            </h4>

            <div className="space-y-1.5 text-xs font-mono text-slate-400">
              {workingHours.slice(0, 6).map((wh) => (
                <div key={wh.day} className="flex justify-between">
                  <span className="text-slate-500">{wh.day.slice(0, 3)}:</span>
                  <span className={wh.isOpen ? 'text-slate-200' : 'text-slate-600'}>
                    {wh.isOpen ? `${wh.openTime} – ${wh.closeTime}` : 'Closed'}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-slate-850">
                <span className="text-slate-500">Sunday:</span>
                <span className="text-teal-400">10:00 AM – 02:00 PM (Emergency & Planned)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Timezone: {clinicInfo.timezone} (IST)
            </p>
          </div>

          {/* Col 4: Quick Actions & Owner Gateway */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display">
              Patient Services
            </h4>

            <div className="space-y-2 text-xs">
              <button
                onClick={onBookClick}
                className="w-full py-2.5 px-3 bg-teal-700 hover:bg-teal-600 text-white font-semibold rounded-xl text-center transition-colors cursor-pointer block"
              >
                Book Consultation (₹500)
              </button>

              <button
                onClick={onLookupClick}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-xl text-center border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Look Up My Booking</span>
              </button>

              <div className="pt-3 space-y-2">
                <a
                  href="/wemakesmile-clinic.zip"
                  download="wemakesmile-clinic.zip"
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white rounded-xl text-[11px] font-mono border border-teal-900/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Download complete project archive for GitHub"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>Download GitHub ZIP</span>
                </a>

                <button
                  onClick={onOwnerClick}
                  className="w-full py-2 px-3 bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-teal-300 rounded-xl text-[11px] font-mono border border-slate-850 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Owner Administration Access</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 WeMakeSmile Dental Clinic & Hospital. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Sterilization ISO 13485</span>
            <span aria-hidden="true">·</span>
            <span>Karnataka Dental Council Registered</span>
            <span aria-hidden="true">·</span>
            <span>Ethical Healthcare</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
