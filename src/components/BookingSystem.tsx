import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Phone
} from 'lucide-react';
import { Treatment, Doctor, ClinicInfo, ClinicWorkingHours, ClinicHoliday, Appointment } from '../types/clinic';
import { fetchAvailableSlots, createAppointment, BookingPayload, BookingResponse } from '../services/api';

interface BookingSystemProps {
  treatments: Treatment[];
  doctors: Doctor[];
  clinicInfo: ClinicInfo;
  workingHours: ClinicWorkingHours[];
  holidays: ClinicHoliday[];
  initialTreatmentId?: string;
  initialDoctorId?: string;
  onBookingSuccess: (response: BookingResponse) => void;
  onCancel?: () => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  treatments,
  doctors,
  clinicInfo,
  holidays,
  initialTreatmentId,
  initialDoctorId,
  onBookingSuccess,
  onCancel
}) => {
  // 6 Steps: 1: Treatment, 2: Doctor, 3: Date, 4: Time, 5: Patient, 6: Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(
    initialTreatmentId || treatments[0]?.id || 'trt-consultation'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || doctors[0]?.id || 'doc-sharma'
  );
  
  // Default date to tomorrow (YYYY-MM-DD)
  const tomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowStr());
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Available slots loaded from API
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Patient Info
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number>(28);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [patientNotes, setPatientNotes] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch slots whenever date or doctor changes
  useEffect(() => {
    if (selectedDate && selectedDoctorId) {
      setLoadingSlots(true);
      setSlotError(null);
      fetchAvailableSlots(selectedDate, selectedDoctorId)
        .then((res) => {
          if (res.available) {
            setAvailableSlots(res.slots);
            if (res.slots.length > 0 && !res.slots.includes(selectedTime)) {
              setSelectedTime(res.slots[0]);
            } else if (res.slots.length === 0) {
              setSelectedTime('');
            }
          } else {
            setAvailableSlots([]);
            setSelectedTime('');
            setSlotError(res.reason || 'No appointment slots available on this date.');
          }
        })
        .catch(() => {
          setAvailableSlots(['10:00 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM']);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [selectedDate, selectedDoctorId]);

  // Derived selected objects
  const selectedTreatment = treatments.find(t => t.id === selectedTreatmentId) || treatments[0];
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Helper date generators for Step 3
  const getNextDays = (count = 14) => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= count; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const isHoliday = holidays.some(h => h.date === iso);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      dates.push({ iso, isHoliday, dayName, monthName, dayNum, fullDate: d });
    }
    return dates;
  };

  const nextDays = getNextDays(14);

  // Validation
  const validateStep5 = () => {
    if (!patientName.trim()) {
      setErrorMessage('Please enter the patient full name.');
      return false;
    }
    const cleanPhone = patientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number.');
      return false;
    }
    if (patientAge < 1 || patientAge > 110) {
      setErrorMessage('Please enter a valid patient age.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!selectedTreatmentId) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedDoctorId) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate) return;
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!selectedTime) {
        setErrorMessage('Please select an available appointment time slot.');
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      if (validateStep5()) {
        setCurrentStep(6);
      }
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: BookingPayload = {
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      patientAge: Number(patientAge),
      patientGender,
      isFirstVisit,
      treatmentId: selectedTreatmentId,
      doctorId: selectedDoctorId,
      date: selectedDate,
      time: selectedTime,
      patientNotes: patientNotes.trim()
    };

    try {
      const response = await createAppointment(payload);
      onBookingSuccess(response);
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-section" className="py-12 lg:py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Main Box Header */}
        <div className="text-center mb-8 space-y-2">
          {/* Zero-Pill Unboxed Text Metadata */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-800 tracking-wider uppercase">
            <span>Online Patient Portal</span>
            <span aria-hidden="true">·</span>
            <span>Instant Confirmation</span>
          </div>
          
          {/* Brand Prominent Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
            Book Your Appointment at WeMakeSmile
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Schedule your personalized dental consultation with our accredited specialists in 6 easy steps.
          </p>
        </div>

        {/* 6-Step Visual Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[560px] text-xs">
            {[
              { step: 1, label: 'Treatment' },
              { step: 2, label: 'Doctor' },
              { step: 3, label: 'Date' },
              { step: 4, label: 'Available Time' },
              { step: 5, label: 'Patient Details' },
              { step: 6, label: 'Confirm' }
            ].map((s, idx) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <React.Fragment key={s.step}>
                  <button
                    onClick={() => {
                      // Allow jumping back to earlier steps
                      if (s.step < currentStep) setCurrentStep(s.step);
                    }}
                    disabled={s.step > currentStep}
                    className={`flex items-center gap-2 group cursor-pointer transition-colors ${
                      s.step > currentStep ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] font-mono transition-colors ${
                        isCurrent
                          ? 'bg-teal-700 text-white shadow-sm'
                          : isPassed
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : s.step}
                    </span>
                    <span
                      className={`font-semibold whitespace-nowrap ${
                        isCurrent ? 'text-teal-900 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < 5 && (
                    <div className="w-6 h-[1px] bg-slate-200 mx-1 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Wizard Container Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
          
          {/* STEP 1: TREATMENT */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Step 1: Choose Your Dental Treatment
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select the procedure you require. Transparent initial consultation fee is INR ₹500.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {treatments.map((treatment) => {
                  const isSelected = selectedTreatmentId === treatment.id;
                  return (
                    <div
                      key={treatment.id}
                      onClick={() => setSelectedTreatmentId(treatment.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/40 ring-1 ring-teal-700 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                            {treatment.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 font-display">
                            {treatment.name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-teal-800 flex items-center justify-end tabular-nums">
                            <IndianRupee className="w-3 h-3 mr-0.5" />
                            {treatment.startingPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {treatment.durationMins} mins
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {treatment.shortDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DOCTOR */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Step 2: Select Your Dental Specialist
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pick from our certified MDS dental surgeons for {selectedTreatment?.name}.
                </p>
              </div>

              <div className="space-y-3.5">
                {doctors.map((doctor) => {
                  const isSelected = selectedDoctorId === doctor.id;
                  const isSpecialistForTreatment = doctor.treatmentsHandled.includes(selectedTreatmentId);
                  return (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctorId(doctor.id)}
                      className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/40 ring-1 ring-teal-700 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 font-display font-bold flex items-center justify-center shrink-0">
                          {doctor.name.split(' ').slice(1).map(n => n[0]).join('') || 'DR'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 font-display">
                              {doctor.name}
                            </h4>
                            {isSpecialistForTreatment && (
                              <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                                Recommended Specialist
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-teal-800 font-medium">
                            {doctor.title}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {doctor.degrees} · {doctor.experienceYears}+ Yrs Exp
                          </p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col justify-between items-center sm:items-end">
                        <span className="text-[11px] text-slate-400">On Duty:</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {doctor.availableDays.join(', ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Step 3: Pick Appointment Date
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a suitable date. Appointments can be scheduled up to 14 days in advance.
                </p>
              </div>

              {/* Quick Date Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {nextDays.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      disabled={d.isHoliday}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        d.isHoliday
                          ? 'opacity-40 bg-slate-100 cursor-not-allowed border-slate-200'
                          : isSelected
                          ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                          : 'border-slate-200 hover:border-teal-400 bg-white text-slate-700'
                      }`}
                    >
                      <span className={`text-[10px] font-medium uppercase ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                        {d.dayName}
                      </span>
                      <span className="text-lg font-bold font-mono my-0.5">
                        {d.dayNum}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-slate-500'}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Or manual picker */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">Selected Date:</span>
                  <span className="text-sm font-bold text-teal-800 font-mono">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="custom-date-input" className="text-xs text-slate-500">Pick other date:</label>
                  <input
                    id="custom-date-input"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs font-mono border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: AVAILABLE TIME */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Step 4: Select Available Time Slot
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Live slots for {selectedDoctor?.name} on {selectedDate} (Timezone: Asia/Kolkata).
                </p>
              </div>

              {loadingSlots ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <div className="w-8 h-8 border-2 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs">Checking real-time doctor availability...</p>
                </div>
              ) : slotError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{slotError} Please choose another date or doctor.</span>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-700">All slots booked for this doctor on this day.</p>
                  <p className="text-xs text-slate-400 mt-1">Please pick another date or select another consulting doctor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-4 rounded-xl border text-center font-mono text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            isSelected
                              ? 'border-teal-700 bg-teal-700 text-white shadow-md'
                              : 'border-slate-200 hover:border-teal-400 bg-white text-slate-800'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-200' : 'text-slate-400'}`} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Slots are held for 15 minutes once confirmed. Zero queue waiting time.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: PATIENT DETAILS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Step 5: Patient Contact & Health Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We use this information to send your booking confirmation and medical chart prep.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number (SMS Confirmation) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98450 12345"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFirstVisit}
                      onChange={(e) => setIsFirstVisit(e.target.checked)}
                      className="w-4 h-4 text-teal-700 rounded border-slate-300 focus:ring-teal-700"
                    />
                    <span>This is my first time visiting WeMakeSmile Dental Clinic</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Chief Complaint / Dental Concern (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Sensitivity in upper left molar while drinking cold water..."
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRM APPOINTMENT */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Step 6: Review & Confirm Your Booking
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please review your consultation details before finalizing.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Treatment</span>
                    <span className="text-base font-bold text-slate-900 font-display">{selectedTreatment?.name}</span>
                    <span className="text-xs text-teal-800 font-mono block">Approx {selectedTreatment?.durationMins} mins</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Consulting Doctor</span>
                    <span className="text-base font-bold text-slate-900 font-display">{selectedDoctor?.name}</span>
                    <span className="text-xs text-slate-500 font-mono block">{selectedDoctor?.title}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-sm font-bold text-teal-800 font-mono block">
                      {selectedTime} IST
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Estimated Starting Fee</span>
                    <span className="text-lg font-bold text-slate-900 font-mono flex items-center">
                      <IndianRupee className="w-4 h-4 mr-0.5 text-teal-700" />
                      {selectedTreatment?.startingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400 block">Pay at clinic after examination</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Patient: </span>
                    <span className="font-semibold text-slate-800">{patientName} ({patientGender}, {patientAge}y)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Contact: </span>
                    <span className="font-mono text-slate-800">{patientPhone}</span>
                    {patientEmail && <span className="text-slate-500"> · {patientEmail}</span>}
                  </div>
                  {patientNotes && (
                    <div>
                      <span className="text-slate-400">Notes: </span>
                      <span className="text-slate-700 italic">{patientNotes}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span>
                    Location: {clinicInfo.address}, {clinicInfo.landmark}, {clinicInfo.city} - {clinicInfo.pincode}
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* Error Message Display */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Navigation Controls Bar */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Book Appointment</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
