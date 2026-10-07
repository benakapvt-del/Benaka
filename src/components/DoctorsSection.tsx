import React from 'react';
import { Award, Calendar, CheckCircle2, Star, Clock } from 'lucide-react';
import { Doctor } from '../types/clinic';
import doctorConsultationImg from '../assets/images/doctor_team_consultation_1791300287232.jpg';

interface DoctorsSectionProps {
  doctors: Doctor[];
  onBookWithDoctor: (doctorId: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  onBookWithDoctor
}) => {
  return (
    <section id="doctors" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          {/* Zero-Pill Unboxed Text Metadata */}
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 tracking-wider uppercase mb-2">
            <span>Specialist Clinical Faculty</span>
            <span aria-hidden="true">·</span>
            <span>Accredited MDS Specialists</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
            Meet the Dentists Behind WeMakeSmile
          </h2>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Our multi-disciplinary team consists of university-accredited Master of Dental Surgery (MDS) consultants, oral surgeons, and implantologists dedicated to gentle, pain-free dental healthcare.
          </p>
        </div>

        {/* Doctor Consultation Spotlight Banner */}
        <div className="mb-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-xl overflow-hidden aspect-[4/3] bg-slate-200 border border-slate-200/80">
            <img
              src={doctorConsultationImg}
              alt="WeMakeSmile doctor discussing personalized treatment plan with dental patient"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Award className="w-4 h-4 text-teal-700" />
              <span>Multi-Disciplinary Team Approach</span>
              <span aria-hidden="true">·</span>
              <span>Individualized Treatment Roadmaps</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-display">
              Consultations Grounded in Evidence & Patient Comfort
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              At WeMakeSmile, we never rush diagnoses. Every patient receives a comprehensive 30-minute one-on-one session with high-resolution digital imaging. We explain all clinical findings clearly, outline conservative alternatives, and provide complete cost transparency before beginning any procedure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Zero overtreatment guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Full digital RVG X-ray review</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Gentle touch for anxious patients</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Verified KDC medical council registrations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 transition-all duration-200 flex flex-col justify-between hover:shadow-sm"
            >
              <div>
                {/* Doctor Avatar / Monogram Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-800 to-teal-600 text-white font-display font-bold text-lg flex items-center justify-center shadow-sm">
                    {doctor.name.split(' ').slice(1).map(n => n[0]).join('') || 'DR'}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 font-normal">({doctor.totalCases}+ cases)</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {doctor.experienceYears}+ Yrs Exp
                    </span>
                  </div>
                </div>

                {/* Name & Titles */}
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {doctor.name}
                </h3>
                <p className="text-xs font-semibold text-teal-800 mt-0.5">
                  {doctor.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  {doctor.degrees}
                </p>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Reg No: {doctor.registrationNumber}
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 mt-4 leading-relaxed line-clamp-3">
                  {doctor.bio}
                </p>

                {/* Schedule Info */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Available Days:</span>
                    <span className="font-medium text-slate-800">
                      {doctor.availableDays.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Duty Hours:</span>
                    <span className="font-mono text-slate-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {doctor.workingHours.start} – {doctor.workingHours.end}
                    </span>
                  </div>
                </div>

              </div>

              {/* Book With Doctor CTA */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onBookWithDoctor(doctor.id)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-teal-800 hover:text-white bg-teal-50 hover:bg-teal-700 border border-teal-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book with {doctor.name.split(' ')[0]} {doctor.name.split(' ')[1]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
