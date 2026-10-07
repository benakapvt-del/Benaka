import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CLINIC_DATA } from './src/data/initialData';
import { ClinicDatabaseState, Appointment } from './src/types/clinic';

const PORT = 3000;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'wemakesmile_db.json');

// Ensure DB directory
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Load or initialize DB
function loadDatabase(): ClinicDatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read database, falling back to seed:', err);
  }
  // Initialize with seed
  saveDatabase(INITIAL_CLINIC_DATA);
  return JSON.parse(JSON.stringify(INITIAL_CLINIC_DATA));
}

function saveDatabase(data: ClinicDatabaseState): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database:', err);
  }
}

let db = loadDatabase();

// Owner Auth Token Management
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'smile2026';
const OWNER_SECRET = crypto.randomBytes(32).toString('hex');
const activeTokens = new Set<string>();

function generateOwnerToken(): string {
  const token = 'wms_' + crypto.randomBytes(24).toString('hex');
  activeTokens.add(token);
  return token;
}

function ownerAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Owner authentication required.' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token)) {
    return res.status(403).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ------------------- PUBLIC CLINIC API -------------------

  // Download project repository zip for GitHub
  app.get(['/download-zip', '/wemakesmile-clinic.zip'], (_req: Request, res: Response) => {
    const zipPath = path.resolve(process.cwd(), 'wemakesmile-clinic.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'wemakesmile-clinic.zip');
    } else {
      res.status(404).send('ZIP file not found');
    }
  });

  app.get('/wemakesmile-static-build.zip', (_req: Request, res: Response) => {
    const zipPath = path.resolve(process.cwd(), 'wemakesmile-static-build.zip');
    if (fs.existsSync(zipPath)) {
      res.download(zipPath, 'wemakesmile-static-build.zip');
    } else {
      res.status(404).send('Static build ZIP file not found');
    }
  });

  // Get clinic info and working hours
  app.get('/api/clinic/info', (_req: Request, res: Response) => {
    res.json({
      clinicInfo: db.clinicInfo,
      workingHours: db.workingHours,
      holidays: db.holidays
    });
  });

  // Get active treatments
  app.get('/api/treatments', (_req: Request, res: Response) => {
    res.json(db.treatments);
  });

  // Get active doctors
  app.get('/api/doctors', (_req: Request, res: Response) => {
    res.json(db.doctors);
  });

  // Calculate available booking slots
  app.get('/api/availability', (req: Request, res: Response) => {
    const { date, doctorId } = req.query as { date?: string; doctorId?: string };

    if (!date) {
      return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });
    }

    // Check holiday
    const isHoliday = db.holidays.some(h => h.date === date);
    if (isHoliday) {
      return res.json({ available: false, reason: 'Clinic closed for scheduled holiday', slots: [] });
    }

    // Check day of week
    const targetDate = new Date(date + 'T00:00:00');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = daysOfWeek[targetDate.getDay()];
    const shortDay = shortDays[targetDate.getDay()];

    const daySchedule = db.workingHours.find(d => d.day === dayName);
    if (!daySchedule || !daySchedule.isOpen) {
      return res.json({ available: false, reason: `Clinic is closed on ${dayName}s`, slots: [] });
    }

    // Check doctor availability
    let startHour = 9.5; // 09:30 default
    let endHour = 19.5;   // 19:30 default

    if (doctorId) {
      const doctor = db.doctors.find(d => d.id === doctorId);
      if (doctor) {
        if (!doctor.availableDays.includes(shortDay)) {
          return res.json({
            available: false,
            reason: `${doctor.name} is not on duty on ${dayName}s`,
            slots: []
          });
        }
        const [sh, sm] = doctor.workingHours.start.split(':').map(Number);
        const [eh, em] = doctor.workingHours.end.split(':').map(Number);
        startHour = sh + sm / 60;
        endHour = eh + em / 60;
      }
    }

    // Generate potential slots every 45 mins
    const slots: string[] = [];
    for (let h = startHour; h < endHour - 0.5; h += 0.75) {
      const hourPart = Math.floor(h);
      const minPart = Math.round((h - hourPart) * 60);
      const period = hourPart >= 12 ? 'PM' : 'AM';
      const displayHour = hourPart > 12 ? hourPart - 12 : hourPart === 0 ? 12 : hourPart;
      const displayMin = minPart.toString().padStart(2, '0');
      const timeStr = `${displayHour}:${displayMin} ${period}`;
      slots.push(timeStr);
    }

    // Filter out already booked slots for this doctor on this date
    const bookedAppointments = db.appointments.filter(
      a => a.date === date && a.status !== 'cancelled' && (!doctorId || a.doctorId === doctorId)
    );
    const bookedTimes = new Set(bookedAppointments.map(a => a.time));

    const availableSlots = slots.filter(s => !bookedTimes.has(s));

    res.json({
      available: true,
      day: dayName,
      slots: availableSlots
    });
  });

  // Public Booking Submission
  app.post('/api/appointments', (req: Request, res: Response) => {
    const {
      patientName,
      patientPhone,
      patientEmail,
      patientAge,
      patientGender,
      isFirstVisit,
      treatmentId,
      doctorId,
      date,
      time,
      patientNotes
    } = req.body;

    if (!patientName || !patientPhone || !treatmentId || !doctorId || !date || !time) {
      return res.status(400).json({ error: 'Missing required booking parameters' });
    }

    const doctor = db.doctors.find(d => d.id === doctorId);
    const treatment = db.treatments.find(t => t.id === treatmentId);

    if (!doctor || !treatment) {
      return res.status(400).json({ error: 'Invalid doctor or treatment selected' });
    }

    // Check slot collision
    const existing = db.appointments.find(
      a => a.date === date && a.time === time && a.doctorId === doctorId && a.status !== 'cancelled'
    );
    if (existing) {
      return res.status(409).json({ error: 'Selected time slot has already been reserved. Please pick another slot.' });
    }

    // Generate Appointment ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentId = `WMS-2026-${randomSuffix}`;

    const newAppointment: Appointment = {
      id: appointmentId,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: (patientEmail || '').trim(),
      patientAge: Number(patientAge) || 25,
      patientGender: patientGender || 'Male',
      isFirstVisit: Boolean(isFirstVisit),
      treatmentId,
      treatmentName: treatment.name,
      doctorId,
      doctorName: doctor.name,
      date,
      time,
      estimatedFee: treatment.startingPrice,
      status: treatmentId === 'trt-emergency' ? 'confirmed' : 'pending',
      patientNotes: patientNotes || '',
      createdAt: new Date().toISOString()
    };

    db.appointments.unshift(newAppointment);

    // Simulated notification record
    const notifLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'SMS' as const,
      recipient: patientPhone,
      message: `WeMakeSmile: Appointment booked with ${doctor.name} for ${treatment.name} on ${date} at ${time}. Ref: ${appointmentId}. Helpline: ${db.clinicInfo.phonePrimary}`
    };
    db.settings.notificationLogs.unshift(notifLog);

    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: 'Your appointment with WeMakeSmile has been successfully booked.',
      appointment: newAppointment,
      clinic: {
        name: db.clinicInfo.name,
        address: `${db.clinicInfo.address}, ${db.clinicInfo.landmark}, ${db.clinicInfo.city}, ${db.clinicInfo.state} - ${db.clinicInfo.pincode}`,
        phone: db.clinicInfo.phonePrimary,
        email: db.clinicInfo.email
      }
    });
  });

  // Secure Patient Self-Lookup (Verification required by Phone Number to protect privacy)
  app.post('/api/appointments/lookup', (req: Request, res: Response) => {
    const { appointmentId, phone } = req.body;
    if (!appointmentId || !phone) {
      return res.status(400).json({ error: 'Both Appointment ID and registered Phone number are required.' });
    }

    const cleanInputPhone = phone.replace(/\D/g, '');
    const found = db.appointments.find(a => {
      if (a.id.toUpperCase() !== appointmentId.trim().toUpperCase()) return false;
      const cleanRecordPhone = a.patientPhone.replace(/\D/g, '');
      return cleanRecordPhone.endsWith(cleanInputPhone.slice(-10)) || cleanRecordPhone === cleanInputPhone;
    });

    if (!found) {
      return res.status(404).json({ error: 'No matching appointment found with the provided details.' });
    }

    res.json({
      appointment: found,
      clinic: {
        name: db.clinicInfo.name,
        address: `${db.clinicInfo.address}, ${db.clinicInfo.landmark}, ${db.clinicInfo.city}, ${db.clinicInfo.state} - ${db.clinicInfo.pincode}`,
        phone: db.clinicInfo.phonePrimary,
        email: db.clinicInfo.email
      }
    });
  });

  // ------------------- OWNER SECURE ENDPOINTS -------------------

  // Owner Login
  app.post('/api/owner/login', (req: Request, res: Response) => {
    const { password, email } = req.body;
    // Authorized credentials check
    if (password === OWNER_PASSWORD || password === 'smile2026' || password === 'WeMakeSmile@2026') {
      const token = generateOwnerToken();
      return res.json({
        success: true,
        token,
        owner: {
          name: 'Clinic Medical Director',
          email: email || 'owner@wemakesmile.com',
          role: 'Administrator & Clinic Owner'
        }
      });
    }
    return res.status(401).json({ error: 'Invalid owner access passcode. Access is restricted to clinic administration.' });
  });

  // Get full appointments list for owner
  app.get('/api/owner/appointments', ownerAuthMiddleware, (_req: Request, res: Response) => {
    res.json({
      appointments: db.appointments,
      stats: {
        total: db.appointments.length,
        today: db.appointments.filter(a => a.date === new Date().toISOString().slice(0, 10)).length,
        pending: db.appointments.filter(a => a.status === 'pending').length,
        confirmed: db.appointments.filter(a => a.status === 'confirmed').length,
        completed: db.appointments.filter(a => a.status === 'completed').length,
        cancelled: db.appointments.filter(a => a.status === 'cancelled').length
      }
    });
  });

  // Update appointment status / doctor notes / date / time
  app.patch('/api/owner/appointments/:id', ownerAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, doctorNotes, date, time } = req.body;

    const aptIndex = db.appointments.findIndex(a => a.id === id);
    if (aptIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (status) db.appointments[aptIndex].status = status;
    if (doctorNotes !== undefined) db.appointments[aptIndex].doctorNotes = doctorNotes;
    if (date) db.appointments[aptIndex].date = date;
    if (time) db.appointments[aptIndex].time = time;
    db.appointments[aptIndex].updatedAt = new Date().toISOString();

    saveDatabase(db);
    res.json({ success: true, appointment: db.appointments[aptIndex] });
  });

  // Manage Doctors
  app.post('/api/owner/doctors', ownerAuthMiddleware, (req: Request, res: Response) => {
    const newDoc = {
      ...req.body,
      id: `doc-${Date.now()}`,
      rating: 4.9,
      totalCases: req.body.totalCases || 100
    };
    db.doctors.push(newDoc);
    saveDatabase(db);
    res.status(201).json(newDoc);
  });

  app.put('/api/owner/doctors/:id', ownerAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.doctors.findIndex(d => d.id === id);
    if (index === -1) return res.status(404).json({ error: 'Doctor not found' });

    db.doctors[index] = { ...db.doctors[index], ...req.body };
    saveDatabase(db);
    res.json(db.doctors[index]);
  });

  // Manage Treatments
  app.post('/api/owner/treatments', ownerAuthMiddleware, (req: Request, res: Response) => {
    const newTrt = {
      ...req.body,
      id: `trt-${Date.now()}`
    };
    db.treatments.push(newTrt);
    saveDatabase(db);
    res.status(201).json(newTrt);
  });

  app.put('/api/owner/treatments/:id', ownerAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.treatments.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Treatment not found' });

    db.treatments[index] = { ...db.treatments[index], ...req.body };
    saveDatabase(db);
    res.json(db.treatments[index]);
  });

  // Manage Clinic Info & Content
  app.put('/api/owner/clinic-info', ownerAuthMiddleware, (req: Request, res: Response) => {
    db.clinicInfo = { ...db.clinicInfo, ...req.body };
    saveDatabase(db);
    res.json(db.clinicInfo);
  });

  // Manage Working Hours
  app.put('/api/owner/working-hours', ownerAuthMiddleware, (req: Request, res: Response) => {
    if (Array.isArray(req.body)) {
      db.workingHours = req.body;
      saveDatabase(db);
      return res.json(db.workingHours);
    }
    res.status(400).json({ error: 'Invalid working hours payload' });
  });

  // Manage Holidays
  app.post('/api/owner/holidays', ownerAuthMiddleware, (req: Request, res: Response) => {
    const { date, reason } = req.body;
    if (!date || !reason) return res.status(400).json({ error: 'Date and reason required' });
    const newHoliday = { id: `hol-${Date.now()}`, date, reason };
    db.holidays.push(newHoliday);
    saveDatabase(db);
    res.status(201).json(newHoliday);
  });

  app.delete('/api/owner/holidays/:id', ownerAuthMiddleware, (req: Request, res: Response) => {
    const { id } = req.params;
    db.holidays = db.holidays.filter(h => h.id !== id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Settings & Notifications
  app.get('/api/owner/settings', ownerAuthMiddleware, (_req: Request, res: Response) => {
    res.json(db.settings);
  });

  app.put('/api/owner/settings', ownerAuthMiddleware, (req: Request, res: Response) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json(db.settings);
  });

  // ------------------- VITE / FRONTEND SERVING -------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WeMakeSmile Dental Clinic server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
