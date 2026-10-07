import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertCircle,
  Crown,
  Sun,
  Anchor,
  Smile,
  HeartHandshake,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  IndianRupee,
  Check
} from 'lucide-react';
import { Treatment } from '../types/clinic';
import treatmentCareImage from '../assets/images/dental_treatment_care_1791300271971.jpg';

interface ServicesSectionProps {
  treatments: Treatment[];
  onSelectTreatmentForLearnMore: (treatment: Treatment) => void;
  onBookTreatment: (treatmentId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  treatments,
  onSelectTreatmentForLearnMore,
  onBookTreatment
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Preventive', 'Restorative', 'Cosmetic', 'Surgical', 'Pediatric', 'Emergency'];

  const filteredTreatments = activeCategory === 'All'
    ? treatments
    : treatments.filter(t => t.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-teal-700" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-teal-700" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-teal-700" />;
      case 'Activity': return <Activity className="w-5 h-5 text-teal-700" />;
      case 'AlertCircle': return <AlertCircle className="w-5 h-5 text-teal-700" />;
      case 'Crown': return <Crown className="w-5 h-5 text-teal-700" />;
      case 'Sun': return <Sun className="w-5 h-5 text-teal-700" />;
      case 'Anchor': return <Anchor className="w-5 h-5 text-teal-700" />;
      case 'Smile': return <Smile className="w-5 h-5 text-teal-700" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-teal-700" />;
      case 'Shield': return <Shield className="w-5 h-5 text-teal-700" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-600" />;
      default: return <Stethoscope className="w-5 h-5 text-teal-700" />;
    }
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 max-w-2xl">
            {/* Zero-Pill Unboxed Text Metadata */}
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 tracking-wider uppercase">
              <span>WeMakeSmile Clinical Services</span>
              <span aria-hidden="true">·</span>
              <span>12 Specialized Treatments</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Advanced Dental Care for Every Smile
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              From preventive hygiene and painless root canals to laser cosmetics and full-mouth rehabilitation, our dental specialists employ world-class protocols and digital imaging.
            </p>
          </div>

          {/* Interactive Category Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl overflow-x-auto max-w-full shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Spotlight Card */}
        {activeCategory === 'All' && (
          <div className="mb-10 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto">
              <img
                src={treatmentCareImage}
                alt="WeMakeSmile high precision oral scanning and dental surgery operatory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent lg:hidden" />
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-teal-800">Featured Technology</span>
                  <span aria-hidden="true">·</span>
                  <span>Intraoral 3D Scanners & Rotary Endodontics</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  Precision Diagnosis with 90% Less Radiation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every treatment at WeMakeSmile begins with optical diagnostic imaging. We replace messy impression trays with rapid digital scanning and use computerized apex locators for painless, precise treatments.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-teal-700" />
                    <span>Instant optical 3D jaw impressions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-teal-700" />
                    <span>Rotary single-sitting root canals</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-teal-700" />
                    <span>Computerized painless local anesthesia</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-teal-700" />
                    <span>Monolithic Zirconia CAD/CAM crowns</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Book your first digital scan today</span>
                <button
                  onClick={() => onBookTreatment('trt-consultation')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                >
                  <span>Book Digital Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 12 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => {
            const isEmergency = treatment.id === 'trt-emergency';
            return (
              <div
                key={treatment.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
                  isEmergency
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <div>
                  {/* Top Row: Icon + Category + Fee */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getServiceIcon(treatment.iconName)}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                        Starting from
                      </span>
                      <span className="text-base font-bold text-slate-900 font-display flex items-center justify-end tabular-nums">
                        <IndianRupee className="w-3.5 h-3.5 text-teal-700 mr-0.5" />
                        {treatment.startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Title & Category Line */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span>{treatment.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {treatment.durationMins}m
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-teal-800 transition-colors">
                      {treatment.name}
                    </h3>
                  </div>

                  {/* Short Explanation */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {treatment.shortDesc}
                  </p>
                </div>

                {/* Card Action Buttons: Learn More & Book Appointment */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  <button
                    onClick={() => onSelectTreatmentForLearnMore(treatment)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-center cursor-pointer whitespace-nowrap"
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => onBookTreatment(treatment.id)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors text-center shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Book Appointment
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Emergency Assistance Footer Ribbon */}
        <div className="mt-12 bg-white rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">Experiencing Acute Tooth Pain or Dental Trauma?</h4>
              <p className="text-xs text-slate-500">We reserve daily priority emergency slots for pain alleviation, knocked-out teeth, and swellings.</p>
            </div>
          </div>
          <button
            onClick={() => onBookTreatment('trt-emergency')}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-red-700 hover:text-white hover:bg-red-600 border border-red-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Emergency Slot Request
          </button>
        </div>

      </div>
    </section>
  );
};
