import React from 'react';
import { ShieldCheck, Heart, Cpu, FileCheck, Check, Sparkles } from 'lucide-react';
import dentalComfortImg from '../assets/images/dental_comfort_care_1791300301277.jpg';

export const ClinicFeatures: React.FC = () => {
  return (
    <section id="technology" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          {/* Zero-Pill Unboxed Text Metadata */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-800 tracking-wider uppercase">
            <span>Clinical Excellence</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Compromise Safety Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
            Why Patients Choose WeMakeSmile
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            We design every aspect of our practice around patient comfort, rigorous medical sterility, and transparent, ethical healthcare.
          </p>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              6-Stage Sterilization
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every instrument undergoes ultrasonic cleaning, enzymatic baths, and vacuum Class-B hospital autoclaving in vacuum-sealed pouches opened directly before your eyes.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 font-medium">
              ISO 13485 & CDC compliant
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Painless Dental Care
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computer-controlled local anesthesia, topical numbing gels, and whisper-quiet electric handpieces eliminate the vibrations and discomfort of traditional dentistry.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 font-medium">
              Comfort suites with relaxation audio
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              100% Digital Workflow
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Say goodbye to messy gagging impression pastes. Our optical 3D scanners capture precision jaw maps in seconds, delivering high-accuracy crowns and clear aligners.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 font-medium">
              Same-week crown delivery
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Transparent INR Pricing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No hidden clinic overheads or surprise bills. Written treatment estimates, published fee schedules, and zero-interest EMI financing on orthodontic and implant treatments.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 font-medium">
              Official GST invoices issued
            </div>
          </div>

        </div>

        {/* Interior Ambiance Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto">
            <img
              src={dentalComfortImg}
              alt="WeMakeSmile relaxing private dental operatory room in Indiranagar Bengaluru"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 text-xs text-teal-800 font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Designed for Anxiety-Free Visits</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-display">
              A Dental Clinic That Doesn't Feel Like One
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We know dental anxiety is real. WeMakeSmile was purposely built to offer a serene, light-filled atmosphere with soft acoustics, ceiling-mounted entertainment screens, and ergonomic memory-foam dental chairs.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-teal-700" />
                <span>Private single-patient operatories ensuring complete medical confidentiality</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-teal-700" />
                <span>Dedicated kid-friendly pediatric room with gentle acclimatization games</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Check className="w-4 h-4 text-teal-700" />
                <span>HEPA 14 air filtration cycling fresh air throughout clinical spaces</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
