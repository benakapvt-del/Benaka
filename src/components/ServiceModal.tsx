import React from 'react';
import { X, Calendar, Clock, CheckCircle2, IndianRupee, Sparkles, Activity } from 'lucide-react';
import { Treatment } from '../types/clinic';

interface ServiceModalProps {
  treatment: Treatment | null;
  onClose: () => void;
  onBookTreatment: (treatmentId: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  treatment,
  onClose,
  onBookTreatment
}) => {
  if (!treatment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-cyan-950 text-white px-6 py-6 sm:px-8 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
              <span>WeMakeSmile Clinical Care</span>
              <span aria-hidden="true">·</span>
              <span>{treatment.category} Department</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white">
              {treatment.name}
            </h3>
            <p className="text-sm text-teal-100/90 max-w-lg leading-relaxed">
              {treatment.shortDesc}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-teal-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Starting Fee</span>
              <span className="text-lg font-bold text-teal-800 flex items-center tabular-nums">
                <IndianRupee className="w-4 h-4 mr-0.5" />
                {treatment.startingPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Approx Duration</span>
              <span className="text-base font-semibold text-slate-800 flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                {treatment.durationMins} minutes
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 font-medium block">Recovery</span>
              <span className="text-sm font-semibold text-slate-800">
                {treatment.recoveryTime}
              </span>
            </div>
          </div>

          {/* Procedure Overview */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 font-display flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-700" />
              Procedure Overview
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {treatment.fullDesc}
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-700" />
              Patient Advantages & Clinical Outcomes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {treatment.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Steps */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 font-display">
              What to Expect During Your Visit
            </h4>
            <div className="space-y-2.5">
              {treatment.procedureSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-600">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-900 font-bold text-[11px] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Transparent pricing · Consultations include digital RVG X-ray</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookTreatment(treatment.id);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment for {treatment.name}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
