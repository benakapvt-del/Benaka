import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Heart, Award, Clock } from 'lucide-react';
import heroImage from '../assets/images/hero_wemakesmile_clinic_1791300258998.jpg';

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Unboxed Brand Subtitle / Metadata (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase">
              <span>WeMakeSmile Dental Healthcare</span>
              <span aria-hidden="true" className="text-teal-400">·</span>
              <span>Indiranagar, Bengaluru</span>
              <span aria-hidden="true" className="text-teal-400">·</span>
              <span>NABH Protocols</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] font-display max-w-2xl">
              Healthy Teeth.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-800">
                Confident Smiles.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              Professional dental care focused on your comfort, oral health and confident smile.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md shadow-teal-900/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 hover:text-teal-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <span>Explore Our Treatments</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust Markers Adjacent to Call to Action (Claim-to-Proof Adjacency) */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-teal-700 mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-bold text-slate-900 font-display">100% Sterile</span>
                </div>
                <p className="text-xs text-slate-500">Hospital Class-B Autoclave</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal-700 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-bold text-slate-900 font-display">Gentle Care</span>
                </div>
                <p className="text-xs text-slate-500">Computerized Pain-Free Tech</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal-700 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-bold text-slate-900 font-display">14+ Years</span>
                </div>
                <p className="text-xs text-slate-500">MDS Specialist Leadership</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-teal-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold text-slate-900 font-display">Zero Wait</span>
                </div>
                <p className="text-xs text-slate-500">Scheduled Time slot Honor</p>
              </div>
            </div>

          </div>

          {/* Right Column: Dominant Focal Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 aspect-[4/3] lg:aspect-[16/11]">
              <img
                src={heroImage}
                alt="WeMakeSmile modern dental clinic consultation suite in Indiranagar Bengaluru"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent pointer-events-none" />
              
              {/* Subtle Overlay Badge (Natural editorial metadata, not pill-candy) */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-lg flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">WeMakeSmile Bengaluru</h4>
                  <p className="text-xs text-slate-600">Advanced 3D CBCT & Digital Scanning Suite</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Mon – Sat</span>
                  <span className="text-xs text-slate-500 font-mono">09:00 AM – 08:00 PM</span>
                </div>
              </div>
            </div>

            {/* Decorative Corner Accent */}
            <div className="absolute -top-4 -right-4 -z-10 w-48 h-48 bg-teal-200/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          </div>

        </div>

      </div>
    </section>
  );
};
