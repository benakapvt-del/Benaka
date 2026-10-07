import React, { useState } from 'react';
import { X, Search, AlertCircle, Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { lookupAppointment } from '../services/api';
import { Appointment } from '../types/clinic';

interface PatientLookupModalProps {
  onClose: () => void;
}

export const PatientLookupModal: React.FC<PatientLookupModalProps> = ({ onClose }) => {
  const [appointmentId, setAppointmentId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    appointment: Appointment;
    clinic: { name: string; address: string; phone: string; email: string };
  } | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId.trim() || !phone.trim()) {
      setError('Please enter both your Appointment ID and registered Phone number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await lookupAppointment(appointmentId.trim(), phone.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'No appointment found matching these credentials.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-teal-400">
              Patient Privacy Protected
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Look Up Your Booking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleLookup} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                To safeguard patient confidentiality, please provide your unique Appointment ID (e.g. <span className="font-mono text-teal-800 font-semibold">WMS-2026-8812</span>) and the 10-digit mobile number provided during booking.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Appointment Reference ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WMS-2026-8812"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-700 uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98452 77123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Retrieve Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-800 font-semibold uppercase block">Verified Booking</span>
                  <span className="text-lg font-bold font-mono text-teal-900">{result.appointment.id}</span>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-white rounded-lg border border-teal-200 text-teal-800 uppercase">
                  {result.appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Patient</span>
                  <span className="font-semibold text-slate-800">{result.appointment.patientName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Doctor</span>
                  <span className="font-semibold text-slate-800">{result.appointment.doctorName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Treatment</span>
                  <span className="font-semibold text-slate-800">{result.appointment.treatmentName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Date & Time</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {result.appointment.date} · {result.appointment.time}
                  </span>
                </div>
              </div>

              {result.appointment.doctorNotes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-0.5">Doctor's Clinical Note:</span>
                  <p className="text-slate-600 italic">{result.appointment.doctorNotes}</p>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{result.clinic.address}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 pt-1">
                  <span>Helpline: {result.clinic.phone}</span>
                  <span>Email: {result.clinic.email}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Look up another booking
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
