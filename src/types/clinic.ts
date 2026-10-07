export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Treatment {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  category: 'Preventive' | 'Restorative' | 'Cosmetic' | 'Surgical' | 'Pediatric' | 'Emergency';
  durationMins: number;
  startingPrice: number; // in INR ₹
  iconName: string;
  image?: string;
  benefits: string[];
  procedureSteps: string[];
  recoveryTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  degrees: string;
  specialization: string;
  experienceYears: number;
  registrationNumber: string;
  availableDays: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  workingHours: {
    start: string; // e.g. "09:30"
    end: string;   // e.g. "18:30"
  };
  bio: string;
  treatmentsHandled: string[]; // Treatment IDs
  rating: number;
  totalCases: number;
}

export interface Appointment {
  id: string; // e.g. "WMS-2026-4819"
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  isFirstVisit: boolean;
  treatmentId: string;
  treatmentName: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  estimatedFee: number;
  status: AppointmentStatus;
  patientNotes?: string;
  doctorNotes?: string;
  createdAt: string; // ISO date
  updatedAt?: string;
}

export interface ClinicWorkingHours {
  day: string; // "Monday", "Tuesday", etc.
  isOpen: boolean;
  openTime: string;  // "09:00"
  closeTime: string; // "20:00"
}

export interface ClinicHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  type: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phonePrimary: string;
  phoneSecondary: string;
  emergencyPhone: string;
  email: string;
  timezone: string;
  currency: string;
  announcement?: string;
  gstin?: string;
  licenseNumber?: string;
}

export interface OwnerSettings {
  slotDurationMins: number;
  bufferBetweenSlotsMins: number;
  advanceBookingDays: number;
  autoConfirmEmergency: boolean;
  notifyEmail: boolean;
  notifySms: boolean;
  notificationLogs: Array<{
    id: string;
    timestamp: string;
    type: 'SMS' | 'EMAIL';
    recipient: string;
    message: string;
  }>;
}

export interface ClinicDatabaseState {
  clinicInfo: ClinicInfo;
  workingHours: ClinicWorkingHours[];
  holidays: ClinicHoliday[];
  treatments: Treatment[];
  doctors: Doctor[];
  appointments: Appointment[];
  settings: OwnerSettings;
}
