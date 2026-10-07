import React, { useState, useEffect } from 'react';
import {
  ClinicInfo,
  ClinicWorkingHours,
  ClinicHoliday,
  Treatment,
  Doctor,
  Appointment
} from './types/clinic';
import { INITIAL_CLINIC_DATA } from './data/initialData';
import {
  fetchClinicInfo,
  fetchTreatments,
  fetchDoctors,
  BookingResponse
} from './services/api';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ServiceModal } from './components/ServiceModal';
import { DoctorsSection } from './components/DoctorsSection';
import { ClinicFeatures } from './components/ClinicFeatures';
import { BookingSystem } from './components/BookingSystem';
import { BookingConfirmation } from './components/BookingConfirmation';
import { PatientLookupModal } from './components/PatientLookupModal';
import { OwnerAuthModal } from './components/OwnerDashboard/OwnerAuthModal';
import { OwnerDashboard } from './components/OwnerDashboard/OwnerDashboard';
import { Footer } from './components/Footer';

export default function App() {
  // Public Clinic State
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(INITIAL_CLINIC_DATA.clinicInfo);
  const [workingHours, setWorkingHours] = useState<ClinicWorkingHours[]>(INITIAL_CLINIC_DATA.workingHours);
  const [holidays, setHolidays] = useState<ClinicHoliday[]>(INITIAL_CLINIC_DATA.holidays);
  const [treatments, setTreatments] = useState<Treatment[]>(INITIAL_CLINIC_DATA.treatments);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_CLINIC_DATA.doctors);

  // Active UI Modals & Views
  const [selectedLearnMoreTreatment, setSelectedLearnMoreTreatment] = useState<Treatment | null>(null);
  const [showLookupModal, setShowLookupModal] = useState<boolean>(false);
  const [showOwnerAuthModal, setShowOwnerAuthModal] = useState<boolean>(false);

  // Owner Mode State
  const [ownerToken, setOwnerToken] = useState<string | null>(() => {
    return sessionStorage.getItem('wms_owner_token') || null;
  });
  const [ownerUser, setOwnerUser] = useState<{ name: string; email: string; role: string }>({
    name: 'Clinic Medical Director',
    email: 'owner@wemakesmile.com',
    role: 'Administrator & Clinic Owner'
  });

  // Booking Flow State
  const [preselectedTreatmentId, setPreselectedTreatmentId] = useState<string | undefined>(undefined);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | undefined>(undefined);
  const [completedBooking, setCompletedBooking] = useState<BookingResponse | null>(null);

  // Fetch initial public data
  const loadPublicData = async () => {
    try {
      const [infoRes, trtRes, docRes] = await Promise.all([
        fetchClinicInfo(),
        fetchTreatments(),
        fetchDoctors()
      ]);
      setClinicInfo(infoRes.clinicInfo);
      setWorkingHours(infoRes.workingHours);
      setHolidays(infoRes.holidays);
      setTreatments(trtRes);
      setDoctors(docRes);
    } catch (err) {
      console.warn('Using seeded clinic data as server initializes:', err);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  const scrollToBooking = (treatmentId?: string, doctorId?: string) => {
    if (treatmentId) setPreselectedTreatmentId(treatmentId);
    if (doctorId) setPreselectedDoctorId(doctorId);
    setCompletedBooking(null); // Reset any existing confirmation view

    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = (response: BookingResponse) => {
    setCompletedBooking(response);
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOwnerLoginSuccess = (token: string, owner: { name: string; email: string; role: string }) => {
    setOwnerToken(token);
    setOwnerUser(owner);
    sessionStorage.setItem('wms_owner_token', token);
    setShowOwnerAuthModal(false);
  };

  const handleOwnerLogout = () => {
    setOwnerToken(null);
    sessionStorage.removeItem('wms_owner_token');
  };

  // If in Owner Mode, render the full secure Owner Dashboard
  if (ownerToken) {
    return (
      <OwnerDashboard
        token={ownerToken}
        ownerUser={ownerUser}
        initialDoctors={doctors}
        initialTreatments={treatments}
        initialClinicInfo={clinicInfo}
        initialWorkingHours={workingHours}
        initialHolidays={holidays}
        onLogout={handleOwnerLogout}
        onRefreshPublicData={loadPublicData}
      />
    );
  }

  // Public Dental Clinic Experience
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Navigation */}
      <Navbar
        clinicInfo={clinicInfo}
        onBookClick={() => scrollToBooking()}
        onOwnerClick={() => setShowOwnerAuthModal(true)}
        onLookupClick={() => setShowLookupModal(true)}
        activeSection="home"
      />

      {/* Hero Section */}
      <Hero
        onBookClick={() => scrollToBooking()}
        onExploreClick={() => {
          const el = document.getElementById('services');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 12 Services Section */}
      <ServicesSection
        treatments={treatments}
        onSelectTreatmentForLearnMore={(treatment) => setSelectedLearnMoreTreatment(treatment)}
        onBookTreatment={(treatmentId) => scrollToBooking(treatmentId, undefined)}
      />

      {/* Doctors Section */}
      <DoctorsSection
        doctors={doctors}
        onBookWithDoctor={(doctorId) => scrollToBooking(undefined, doctorId)}
      />

      {/* Clinical Standards / Technology */}
      <ClinicFeatures />

      {/* Appointment Booking Flow */}
      <div id="booking-section">
        {completedBooking ? (
          <div className="py-12 bg-slate-100">
            <BookingConfirmation
              appointment={completedBooking.appointment}
              clinic={completedBooking.clinic}
              onBookAnother={() => setCompletedBooking(null)}
              onBackToHome={() => {
                setCompletedBooking(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <BookingSystem
            treatments={treatments}
            doctors={doctors}
            clinicInfo={clinicInfo}
            workingHours={workingHours}
            holidays={holidays}
            initialTreatmentId={preselectedTreatmentId}
            initialDoctorId={preselectedDoctorId}
            onBookingSuccess={handleBookingSuccess}
          />
        )}
      </div>

      {/* Footer */}
      <Footer
        clinicInfo={clinicInfo}
        workingHours={workingHours}
        onOwnerClick={() => setShowOwnerAuthModal(true)}
        onBookClick={() => scrollToBooking()}
        onLookupClick={() => setShowLookupModal(true)}
      />

      {/* Modals */}
      <ServiceModal
        treatment={selectedLearnMoreTreatment}
        onClose={() => setSelectedLearnMoreTreatment(null)}
        onBookTreatment={(treatmentId) => scrollToBooking(treatmentId)}
      />

      {showLookupModal && (
        <PatientLookupModal
          onClose={() => setShowLookupModal(false)}
        />
      )}

      {showOwnerAuthModal && (
        <OwnerAuthModal
          onSuccess={handleOwnerLoginSuccess}
          onClose={() => setShowOwnerAuthModal(false)}
        />
      )}

    </div>
  );
}
