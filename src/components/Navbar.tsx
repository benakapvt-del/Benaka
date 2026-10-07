import React, { useState } from 'react';
import { Calendar, Lock, Menu, X, Phone, Search } from 'lucide-react';
import { ClinicInfo } from '../types/clinic';

interface NavbarProps {
  clinicInfo: ClinicInfo;
  onBookClick: () => void;
  onOwnerClick: () => void;
  onLookupClick: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  clinicInfo,
  onBookClick,
  onOwnerClick,
  onLookupClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Clinical Announcement Bar */}
      <div className="bg-teal-950 text-teal-100 text-xs py-2 px-4 border-b border-teal-900/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-teal-200">Indiranagar, Bengaluru</span>
            <span className="text-teal-400/60 hidden md:inline">·</span>
            <span className="hidden md:inline text-teal-300/90">{clinicInfo.announcement || 'Walk-in consultations & digital appointments available'}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-teal-200">
            <a href={`tel:${clinicInfo.phonePrimary}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{clinicInfo.phonePrimary}</span>
            </a>
            <span className="text-teal-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-teal-400 font-mono text-[11px]">Emergency: {clinicInfo.emergencyPhone}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar — 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 group-hover:scale-[1.02] transition-transform">
              <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c-3.5 0-6 2.5-6 6 0 3 1.5 5 2 7 .5 2 2 3 4 3s3.5-1 4-3c.5-2 2-4 2-7 0-3.5-2.5-6-6-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10c1 1.5 5 1.5 6 0" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors font-display">
                WeMakeSmile
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-700 -mt-1">
                Dental Clinic & Hospital
              </span>
            </div>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-teal-700 transition-colors">Treatments</a>
            <a href="#doctors" className="hover:text-teal-700 transition-colors">Doctors</a>
            <a href="#technology" className="hover:text-teal-700 transition-colors">Clinical Standards</a>
            <a href="#location" className="hover:text-teal-700 transition-colors">Hours & Location</a>
            <button
              onClick={onLookupClick}
              className="flex items-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors cursor-pointer"
              title="Look up your booked appointment"
            >
              <Search className="w-3.5 h-3.5" />
              <span>My Booking</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOwnerClick}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="Access clinic owner administrative portal"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Owner Portal</span>
            </button>
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book an Appointment</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onBookClick}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 rounded-lg"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100"
              >
                Treatments
              </a>
              <a
                href="#doctors"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100"
              >
                Doctors
              </a>
              <a
                href="#technology"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100"
              >
                Clinical Standards
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100"
              >
                Hours & Location
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLookupClick();
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-100 rounded-md"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Look Up My Booking</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-teal-700 rounded-lg"
              >
                Book an Appointment
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOwnerClick();
                }}
                className="w-full py-2 px-4 text-center text-xs font-medium text-slate-600 bg-slate-100 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Dashboard Login</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
