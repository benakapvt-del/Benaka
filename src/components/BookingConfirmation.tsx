import React from 'react';
import { CheckCircle2, Calendar, Clock, MapPin, Phone, Mail, User, Download, PlusCircle, ArrowLeft } from 'lucide-react';
import { Appointment } from '../types/clinic';

interface BookingConfirmationProps {
  appointment: Appointment;
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  onBookAnother: () => void;
  onBackToHome: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  appointment,
  clinic,
  onBookAnother,
  onBackToHome
}) => {

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    // Generate simple Google Calendar URL
    const title = encodeURIComponent(`Dental Appointment: ${appointment.treatmentName} with ${appointment.doctorName} at WeMakeSmile`);
    const details = encodeURIComponent(`Appointment ID: ${appointment.id}\nPatient: ${appointment.patientName}\nDoctor: ${appointment.doctorName}\nTreatment: ${appointment.treatmentName}\nClinic: WeMakeSmile\nAddress: ${clinic.address}\nHelpline: ${clinic.phone}`);
    const location = encodeURIComponent(clinic.address);
    
    // Parse date and time
    const [year, month, day] = appointment.date.split('-');
    const startTimeFormatted = `${year}${month}${day}T100000Z`;
    const endTimeFormatted = `${year}${month}${day}T110000Z`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTimeFormatted}/${endTimeFormatted}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Success Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-cyan-950 text-white p-8 sm:p-10 text-center">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-xs uppercase tracking-widest text-teal-300 font-semibold mb-1">
          WeMakeSmile Healthcare
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Your appointment with WeMakeSmile has been successfully booked.
        </h2>
        <p className="text-sm text-teal-100/90 mt-2 max-w-md mx-auto">
          A confirmation SMS has been dispatched. Please arrive 10 minutes prior to your scheduled consultation.
        </p>
      </div>

      {/* Appointment Details Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Prominent Appointment ID Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Appointment Reference ID
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-teal-800 tracking-tight">
              {appointment.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs font-semibold rounded-lg font-mono">
              Status: {appointment.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* 6 Key Confirmation Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <User className="w-4 h-4 text-teal-700" />
              <span>Doctor / Specialist</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-display">
              {appointment.doctorName}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>Selected Treatment</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-display">
              {appointment.treatmentName}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Appointment Date</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-display">
              {new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Scheduled Time</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-display font-mono">
              {appointment.time} (Asia/Kolkata)
            </div>
          </div>

        </div>

        {/* Clinic Address & Contact Information */}
        <div className="border-t border-slate-200/80 pt-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-start gap-2 text-slate-800">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-1" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Clinic Address</span>
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {clinic.address}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-slate-700 text-xs">
              <Phone className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">Clinic Phone</span>
                <a href={`tel:${clinic.phone}`} className="font-semibold text-slate-900 hover:text-teal-700 font-mono">
                  {clinic.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700 text-xs">
              <Mail className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[11px]">Email Desk</span>
                <a href={`mailto:${clinic.email}`} className="font-semibold text-slate-900 hover:text-teal-700">
                  {clinic.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Patient:</span>
            <span className="font-medium text-slate-800">{appointment.patientName} ({appointment.patientGender}, {appointment.patientAge}y)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Registered Phone:</span>
            <span className="font-mono text-slate-800">{appointment.patientPhone}</span>
          </div>
          {appointment.patientNotes && (
            <div className="pt-2 border-t border-slate-200 mt-2">
              <span className="text-slate-400 block">Notes for Doctor:</span>
              <p className="text-slate-700 italic mt-0.5">{appointment.patientNotes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleAddToCalendar}
            className="flex-1 py-3 px-4 text-xs font-semibold text-teal-800 hover:bg-teal-50 border border-teal-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Add to Google Calendar</span>
          </button>

          <button
            onClick={handlePrintReceipt}
            className="flex-1 py-3 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save / Print Receipt</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={onBookAnother}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book Another Appointment</span>
          </button>
        </div>

      </div>

    </div>
  );
};
