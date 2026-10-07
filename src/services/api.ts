import {
  ClinicInfo,
  ClinicWorkingHours,
  ClinicHoliday,
  Treatment,
  Doctor,
  Appointment,
  AppointmentStatus,
  OwnerSettings,
  ClinicDatabaseState
} from '../types/clinic';
import { INITIAL_CLINIC_DATA } from '../data/initialData';

const BASE_URL = '/api';
const LOCAL_STORAGE_KEY = 'wemakesmile_db_v1';

// Client-side persistent storage fallback (ensures full functionality on static hosts like GitHub Pages)
function getLocalDB(): ClinicDatabaseState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('localStorage read failed:', e);
  }
  const initial = JSON.parse(JSON.stringify(INITIAL_CLINIC_DATA));
  saveLocalDB(initial);
  return initial;
}

function saveLocalDB(data: ClinicDatabaseState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

export interface BookingPayload {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  isFirstVisit: boolean;
  treatmentId: string;
  doctorId: string;
  date: string;
  time: string;
  patientNotes?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  appointment: Appointment;
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export async function fetchClinicInfo(): Promise<{
  clinicInfo: ClinicInfo;
  workingHours: ClinicWorkingHours[];
  holidays: ClinicHoliday[];
}> {
  try {
    const res = await fetch(`${BASE_URL}/clinic/info`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // static host fallback
  }
  const db = getLocalDB();
  return {
    clinicInfo: db.clinicInfo,
    workingHours: db.workingHours,
    holidays: db.holidays
  };
}

export async function fetchTreatments(): Promise<Treatment[]> {
  try {
    const res = await fetch(`${BASE_URL}/treatments`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // static host fallback
  }
  return getLocalDB().treatments;
}

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const res = await fetch(`${BASE_URL}/doctors`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // static host fallback
  }
  return getLocalDB().doctors;
}

export async function fetchAvailableSlots(date: string, doctorId: string): Promise<{
  available: boolean;
  reason?: string;
  slots: string[];
}> {
  try {
    const res = await fetch(`${BASE_URL}/availability?date=${encodeURIComponent(date)}&doctorId=${encodeURIComponent(doctorId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // static host fallback
  }

  const db = getLocalDB();
  const isHoliday = db.holidays.some(h => h.date === date);
  if (isHoliday) {
    return { available: false, reason: 'Clinic closed for scheduled holiday', slots: [] };
  }

  const targetDate = new Date(date + 'T00:00:00');
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = daysOfWeek[targetDate.getDay()];
  const shortDay = shortDays[targetDate.getDay()];

  const daySchedule = db.workingHours.find(d => d.day === dayName);
  if (!daySchedule || !daySchedule.isOpen) {
    return { available: false, reason: `Clinic is closed on ${dayName}s`, slots: [] };
  }

  let startHour = 9.5;
  let endHour = 19.5;

  if (doctorId) {
    const doctor = db.doctors.find(d => d.id === doctorId);
    if (doctor) {
      if (!doctor.availableDays.includes(shortDay)) {
        return {
          available: false,
          reason: `${doctor.name} is not on duty on ${dayName}s`,
          slots: []
        };
      }
      const [sh, sm] = doctor.workingHours.start.split(':').map(Number);
      const [eh, em] = doctor.workingHours.end.split(':').map(Number);
      startHour = sh + sm / 60;
      endHour = eh + em / 60;
    }
  }

  const slots: string[] = [];
  for (let h = startHour; h < endHour - 0.5; h += 0.75) {
    const hourPart = Math.floor(h);
    const minPart = Math.round((h - hourPart) * 60);
    const period = hourPart >= 12 ? 'PM' : 'AM';
    const displayHour = hourPart > 12 ? hourPart - 12 : hourPart === 0 ? 12 : hourPart;
    const displayMin = minPart.toString().padStart(2, '0');
    slots.push(`${displayHour}:${displayMin} ${period}`);
  }

  const bookedAppointments = db.appointments.filter(
    a => a.date === date && a.status !== 'cancelled' && (!doctorId || a.doctorId === doctorId)
  );
  const bookedTimes = new Set(bookedAppointments.map(a => a.time));

  return {
    available: true,
    slots: slots.filter(s => !bookedTimes.has(s))
  };
}

export async function createAppointment(payload: BookingPayload): Promise<BookingResponse> {
  try {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to client database
  }

  // Client-side fallback implementation
  const db = getLocalDB();
  const doctor = db.doctors.find(d => d.id === payload.doctorId) || db.doctors[0];
  const treatment = db.treatments.find(t => t.id === payload.treatmentId) || db.treatments[0];

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const appointmentId = `WMS-2026-${randomSuffix}`;

  const newAppointment: Appointment = {
    id: appointmentId,
    patientName: payload.patientName.trim(),
    patientPhone: payload.patientPhone.trim(),
    patientEmail: (payload.patientEmail || '').trim(),
    patientAge: Number(payload.patientAge) || 25,
    patientGender: payload.patientGender || 'Male',
    isFirstVisit: Boolean(payload.isFirstVisit),
    treatmentId: payload.treatmentId,
    treatmentName: treatment.name,
    doctorId: payload.doctorId,
    doctorName: doctor.name,
    date: payload.date,
    time: payload.time,
    estimatedFee: treatment.startingPrice,
    status: payload.treatmentId === 'trt-emergency' ? 'confirmed' : 'pending',
    patientNotes: payload.patientNotes || '',
    createdAt: new Date().toISOString()
  };

  db.appointments.unshift(newAppointment);

  // Simulated notification
  db.settings.notificationLogs.unshift({
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'SMS',
    recipient: payload.patientPhone,
    message: `WeMakeSmile: Appointment booked with ${doctor.name} for ${treatment.name} on ${payload.date} at ${payload.time}. Ref: ${appointmentId}.`
  });

  saveLocalDB(db);

  return {
    success: true,
    message: 'Your appointment with WeMakeSmile has been successfully booked.',
    appointment: newAppointment,
    clinic: {
      name: db.clinicInfo.name,
      address: `${db.clinicInfo.address}, ${db.clinicInfo.landmark}, ${db.clinicInfo.city}, ${db.clinicInfo.state} - ${db.clinicInfo.pincode}`,
      phone: db.clinicInfo.phonePrimary,
      email: db.clinicInfo.email
    }
  };
}

export async function lookupAppointment(appointmentId: string, phone: string): Promise<{
  appointment: Appointment;
  clinic: { name: string; address: string; phone: string; email: string };
}> {
  try {
    const res = await fetch(`${BASE_URL}/appointments/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId, phone })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  const cleanInputPhone = phone.replace(/\D/g, '');
  const found = db.appointments.find(a => {
    if (a.id.toUpperCase() !== appointmentId.trim().toUpperCase()) return false;
    const cleanRecordPhone = a.patientPhone.replace(/\D/g, '');
    return cleanRecordPhone.endsWith(cleanInputPhone.slice(-10)) || cleanRecordPhone === cleanInputPhone;
  });

  if (!found) {
    throw new Error('No matching appointment found with the provided details.');
  }

  return {
    appointment: found,
    clinic: {
      name: db.clinicInfo.name,
      address: `${db.clinicInfo.address}, ${db.clinicInfo.landmark}, ${db.clinicInfo.city}, ${db.clinicInfo.state} - ${db.clinicInfo.pincode}`,
      phone: db.clinicInfo.phonePrimary,
      email: db.clinicInfo.email
    }
  };
}

// ------------------- OWNER API -------------------

export async function ownerLogin(password: string, email?: string): Promise<{ token: string; owner: { name: string; email: string; role: string } }> {
  try {
    const res = await fetch(`${BASE_URL}/owner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  if (password === 'smile2026' || password === 'WeMakeSmile@2026' || password === 'admin') {
    const token = 'wms_local_' + Math.random().toString(36).substring(2);
    return {
      token,
      owner: {
        name: 'Clinic Medical Director',
        email: email || 'owner@wemakesmile.com',
        role: 'Administrator & Clinic Owner'
      }
    };
  }

  throw new Error('Invalid owner access passcode. Access is restricted.');
}

export async function fetchOwnerAppointments(token: string): Promise<{
  appointments: Appointment[];
  stats: {
    total: number;
    today: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}> {
  try {
    const res = await fetch(`${BASE_URL}/owner/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  const todayStr = new Date().toISOString().slice(0, 10);
  return {
    appointments: db.appointments,
    stats: {
      total: db.appointments.length,
      today: db.appointments.filter(a => a.date === todayStr).length,
      pending: db.appointments.filter(a => a.status === 'pending').length,
      confirmed: db.appointments.filter(a => a.status === 'confirmed').length,
      completed: db.appointments.filter(a => a.status === 'completed').length,
      cancelled: db.appointments.filter(a => a.status === 'cancelled').length
    }
  };
}

export async function updateAppointmentStatus(
  token: string,
  appointmentId: string,
  update: { status?: AppointmentStatus; doctorNotes?: string; date?: string; time?: string }
): Promise<Appointment> {
  try {
    const res = await fetch(`${BASE_URL}/owner/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(update)
    });
    if (res.ok) {
      const data = await res.json();
      return data.appointment;
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  const idx = db.appointments.findIndex(a => a.id === appointmentId);
  if (idx === -1) throw new Error('Appointment not found');

  if (update.status) db.appointments[idx].status = update.status;
  if (update.doctorNotes !== undefined) db.appointments[idx].doctorNotes = update.doctorNotes;
  if (update.date) db.appointments[idx].date = update.date;
  if (update.time) db.appointments[idx].time = update.time;
  db.appointments[idx].updatedAt = new Date().toISOString();

  saveLocalDB(db);
  return db.appointments[idx];
}

export async function updateClinicInfo(token: string, info: Partial<ClinicInfo>): Promise<ClinicInfo> {
  try {
    const res = await fetch(`${BASE_URL}/owner/clinic-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(info)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  db.clinicInfo = { ...db.clinicInfo, ...info };
  saveLocalDB(db);
  return db.clinicInfo;
}

export async function updateWorkingHours(token: string, hours: ClinicWorkingHours[]): Promise<ClinicWorkingHours[]> {
  try {
    const res = await fetch(`${BASE_URL}/owner/working-hours`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(hours)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  db.workingHours = hours;
  saveLocalDB(db);
  return db.workingHours;
}

export async function addHoliday(token: string, holiday: { date: string; reason: string }): Promise<ClinicHoliday> {
  try {
    const res = await fetch(`${BASE_URL}/owner/holidays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(holiday)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  const created = { id: `hol-${Date.now()}`, ...holiday };
  db.holidays.push(created);
  saveLocalDB(db);
  return created;
}

export async function deleteHoliday(token: string, id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/owner/holidays/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return;
  } catch {
    // fallback
  }

  const db = getLocalDB();
  db.holidays = db.holidays.filter(h => h.id !== id);
  saveLocalDB(db);
}

export async function fetchOwnerSettings(token: string): Promise<OwnerSettings> {
  try {
    const res = await fetch(`${BASE_URL}/owner/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  return getLocalDB().settings;
}

export async function updateOwnerSettings(token: string, settings: Partial<OwnerSettings>): Promise<OwnerSettings> {
  try {
    const res = await fetch(`${BASE_URL}/owner/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  db.settings = { ...db.settings, ...settings };
  saveLocalDB(db);
  return db.settings;
}

export async function saveDoctor(token: string, doctor: Doctor): Promise<Doctor> {
  try {
    const isExisting = doctor.id && !doctor.id.startsWith('new-');
    const url = isExisting ? `${BASE_URL}/owner/doctors/${doctor.id}` : `${BASE_URL}/owner/doctors`;
    const method = isExisting ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(doctor)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  const idx = db.doctors.findIndex(d => d.id === doctor.id);
  let saved: Doctor;
  if (idx !== -1) {
    db.doctors[idx] = { ...db.doctors[idx], ...doctor };
    saved = db.doctors[idx];
  } else {
    saved = { ...doctor, id: `doc-${Date.now()}` };
    db.doctors.push(saved);
  }
  saveLocalDB(db);
  return saved;
}

export async function saveTreatment(token: string, treatment: Treatment): Promise<Treatment> {
  try {
    const isExisting = treatment.id && !treatment.id.startsWith('new-');
    const url = isExisting ? `${BASE_URL}/owner/treatments/${treatment.id}` : `${BASE_URL}/owner/treatments`;
    const method = isExisting ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(treatment)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const db = getLocalDB();
  const idx = db.treatments.findIndex(t => t.id === treatment.id);
  let saved: Treatment;
  if (idx !== -1) {
    db.treatments[idx] = { ...db.treatments[idx], ...treatment };
    saved = db.treatments[idx];
  } else {
    saved = { ...treatment, id: `trt-${Date.now()}` };
    db.treatments.push(saved);
  }
  saveLocalDB(db);
  return saved;
}
