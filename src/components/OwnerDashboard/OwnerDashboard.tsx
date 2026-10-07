import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Save,
  Settings,
  Bell,
  Building,
  FileText,
  IndianRupee,
  RefreshCw,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  Check,
  CalendarCheck
} from 'lucide-react';
import {
  Appointment,
  Doctor,
  Treatment,
  ClinicInfo,
  ClinicWorkingHours,
  ClinicHoliday,
  OwnerSettings,
  AppointmentStatus
} from '../../types/clinic';
import {
  fetchOwnerAppointments,
  updateAppointmentStatus,
  updateClinicInfo,
  updateWorkingHours,
  addHoliday,
  deleteHoliday,
  fetchOwnerSettings,
  updateOwnerSettings,
  saveDoctor,
  saveTreatment
} from '../../services/api';

interface OwnerDashboardProps {
  token: string;
  ownerUser: { name: string; email: string; role: string };
  initialDoctors: Doctor[];
  initialTreatments: Treatment[];
  initialClinicInfo: ClinicInfo;
  initialWorkingHours: ClinicWorkingHours[];
  initialHolidays: ClinicHoliday[];
  onLogout: () => void;
  onRefreshPublicData: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  token,
  ownerUser,
  initialDoctors,
  initialTreatments,
  initialClinicInfo,
  initialWorkingHours,
  initialHolidays,
  onLogout,
  onRefreshPublicData
}) => {
  // Navigation tabs
  type NavTab = 'appointments' | 'calendar' | 'doctors' | 'treatments' | 'hours' | 'website' | 'notifications';
  const [activeTab, setActiveTab] = useState<NavTab>('appointments');

  // Appointments filter
  type AptFilter = 'all' | 'today' | 'upcoming' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  const [aptFilter, setAptFilter] = useState<AptFilter>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Dashboard State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [loadingApts, setLoadingApts] = useState(false);

  // Doctors & Treatments State
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(initialClinicInfo);
  const [workingHours, setWorkingHours] = useState<ClinicWorkingHours[]>(initialWorkingHours);
  const [holidays, setHolidays] = useState<ClinicHoliday[]>(initialHolidays);
  const [settings, setSettings] = useState<OwnerSettings | null>(null);

  // Selected appointment for detail inspection
  const [inspectApt, setInspectApt] = useState<Appointment | null>(null);
  const [inspectNotes, setInspectNotes] = useState('');
  const [savingApt, setSavingApt] = useState(false);

  // Doctor Edit Modal / Form
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  // Treatment Edit Modal / Form
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

  // New Holiday Input
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayReason, setNewHolidayReason] = useState('');

  // Status message notification banner
  const [statusBanner, setStatusBanner] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showBanner = (message: string, type: 'success' | 'error' = 'success') => {
    setStatusBanner({ message, type });
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const loadAppointments = async () => {
    setLoadingApts(true);
    try {
      const data = await fetchOwnerAppointments(token);
      setAppointments(data.appointments);
      setStats(data.stats);
    } catch (err: any) {
      showBanner(err.message || 'Failed to sync appointments', 'error');
    } finally {
      setLoadingApts(false);
    }
  };

  const loadSettingsData = async () => {
    try {
      const data = await fetchOwnerSettings(token);
      setSettings(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadAppointments();
    loadSettingsData();
  }, [token]);

  // Today ISO helper
  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        apt.patientName.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q) ||
        apt.patientPhone.includes(q) ||
        apt.doctorName.toLowerCase().includes(q) ||
        apt.treatmentName.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (aptFilter === 'today') return apt.date === todayStr;
    if (aptFilter === 'upcoming') return apt.date >= todayStr && apt.status !== 'cancelled' && apt.status !== 'completed';
    if (aptFilter === 'pending') return apt.status === 'pending';
    if (aptFilter === 'confirmed') return apt.status === 'confirmed';
    if (aptFilter === 'completed') return apt.status === 'completed';
    if (aptFilter === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  // Handle appointment status change
  const handleUpdateAptStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const updated = await updateAppointmentStatus(token, id, { status });
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
      if (inspectApt && inspectApt.id === id) {
        setInspectApt(updated);
      }
      showBanner(`Appointment ${id} status updated to ${status.toUpperCase()}`);
      loadAppointments();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  const handleSaveInspectNotes = async () => {
    if (!inspectApt) return;
    setSavingApt(true);
    try {
      const updated = await updateAppointmentStatus(token, inspectApt.id, { doctorNotes: inspectNotes });
      setAppointments(prev => prev.map(a => a.id === inspectApt.id ? updated : a));
      setInspectApt(updated);
      showBanner('Clinical notes saved successfully');
    } catch (err: any) {
      showBanner(err.message, 'error');
    } finally {
      setSavingApt(false);
    }
  };

  // Save Working Hours
  const handleSaveWorkingHours = async () => {
    try {
      const res = await updateWorkingHours(token, workingHours);
      setWorkingHours(res);
      showBanner('Clinic working hours updated successfully');
      onRefreshPublicData();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  // Add Holiday
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayReason) return;
    try {
      const created = await addHoliday(token, { date: newHolidayDate, reason: newHolidayReason });
      setHolidays(prev => [...prev, created]);
      setNewHolidayDate('');
      setNewHolidayReason('');
      showBanner('Holiday added to clinic schedule');
      onRefreshPublicData();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  // Delete Holiday
  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHoliday(token, id);
      setHolidays(prev => prev.filter(h => h.id !== id));
      showBanner('Holiday removed');
      onRefreshPublicData();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  // Save Clinic Info
  const handleSaveClinicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateClinicInfo(token, clinicInfo);
      setClinicInfo(res);
      showBanner('Clinic information and announcement saved');
      onRefreshPublicData();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  // Save Doctor
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    try {
      const saved = await saveDoctor(token, editingDoctor);
      setDoctors(prev => {
        const idx = prev.findIndex(d => d.id === saved.id);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = saved;
          return clone;
        }
        return [...prev, saved];
      });
      setEditingDoctor(null);
      showBanner(`Doctor ${saved.name} profile saved`);
      onRefreshPublicData();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  // Save Treatment
  const handleSaveTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment) return;
    try {
      const saved = await saveTreatment(token, editingTreatment);
      setTreatments(prev => {
        const idx = prev.findIndex(t => t.id === saved.id);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = saved;
          return clone;
        }
        return [...prev, saved];
      });
      setEditingTreatment(null);
      showBanner(`Treatment ${saved.name} saved`);
      onRefreshPublicData();
    } catch (err: any) {
      showBanner(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Banner Message */}
      {statusBanner && (
        <div className={`py-2 px-4 text-xs font-semibold text-center sticky top-0 z-50 transition-all ${
          statusBanner.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {statusBanner.message}
        </div>
      )}

      {/* Top Dashboard Nav Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold font-display shadow-sm">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white font-display tracking-tight">
                WeMakeSmile — Owner Dashboard
              </h1>
              <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded font-mono font-semibold">
                ADMIN SECURED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Practice Management & Clinical Operations · Bengaluru, India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/wemakesmile-clinic.zip"
            download="wemakesmile-clinic.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-teal-900/40 transition-colors cursor-pointer"
            title="Download complete codebase ZIP for GitHub"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub ZIP</span>
          </a>

          <div className="hidden sm:block text-right">
            <span className="text-xs font-semibold text-slate-200 block">{ownerUser.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">{ownerUser.email}</span>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Log out of owner dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 bg-slate-950/60 border-r border-slate-800 p-4 space-y-6 shrink-0">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block">
              Core Operations
            </span>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4" />
                <span>Appointments</span>
              </div>
              <span className="font-mono text-[11px] bg-black/20 px-1.5 py-0.5 rounded">
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar Schedule</span>
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block">
              Clinical Directory
            </span>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Doctor Management</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {doctors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('treatments')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'treatments'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Treatments & Fees</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {treatments.length}
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block">
              Clinic Configuration
            </span>
            <button
              onClick={() => setActiveTab('hours')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'hours'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Working Hours & Holidays</span>
            </button>

            <button
              onClick={() => setActiveTab('website')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'website'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Clinic Info & Web Content</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-teal-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notification Settings & Logs</span>
            </button>
          </div>

          {/* Quick Clinic Badge */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-400">
            <div className="font-semibold text-slate-200">WeMakeSmile Dental Hospital</div>
            <div>Timezone: Asia/Kolkata</div>
            <div>Currency: INR (₹)</div>
            <div className="text-teal-400 font-mono text-[10px] pt-1">NABH Standards</div>
          </div>

        </aside>

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-8 bg-slate-900/90 overflow-y-auto">
          
          {/* TAB 1: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              
              {/* Top Stats Overview Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => setAptFilter('today')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aptFilter === 'today'
                      ? 'bg-teal-900/40 border-teal-500 text-teal-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Today's</span>
                  <span className="text-2xl font-bold font-mono">{stats.today}</span>
                </button>

                <button
                  onClick={() => setAptFilter('upcoming')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aptFilter === 'upcoming'
                      ? 'bg-teal-900/40 border-teal-500 text-teal-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Upcoming</span>
                  <span className="text-2xl font-bold font-mono">
                    {appointments.filter(a => a.date >= todayStr && a.status !== 'cancelled' && a.status !== 'completed').length}
                  </span>
                </button>

                <button
                  onClick={() => setAptFilter('pending')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aptFilter === 'pending'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Pending</span>
                  <span className="text-2xl font-bold font-mono text-amber-400">{stats.pending}</span>
                </button>

                <button
                  onClick={() => setAptFilter('confirmed')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aptFilter === 'confirmed'
                      ? 'bg-teal-900/40 border-teal-500 text-teal-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Confirmed</span>
                  <span className="text-2xl font-bold font-mono text-teal-400">{stats.confirmed}</span>
                </button>

                <button
                  onClick={() => setAptFilter('completed')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aptFilter === 'completed'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Completed</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{stats.completed}</span>
                </button>

                <button
                  onClick={() => setAptFilter('cancelled')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aptFilter === 'cancelled'
                      ? 'bg-red-950/40 border-red-500 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Cancelled</span>
                  <span className="text-2xl font-bold font-mono text-red-400">{stats.cancelled}</span>
                </button>
              </div>

              {/* Action & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search patient, ID, doctor, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    onClick={loadAppointments}
                    disabled={loadingApts}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Reload appointments from server"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingApts ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs">
                  {(['all', 'today', 'upcoming', 'pending', 'confirmed', 'completed', 'cancelled'] as AptFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setAptFilter(f)}
                      className={`px-3 py-1.5 rounded-lg font-medium capitalize whitespace-nowrap cursor-pointer transition-colors ${
                        aptFilter === f
                          ? 'bg-teal-700 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments Data Table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Patient</th>
                        <th className="py-3 px-4">Treatment</th>
                        <th className="py-3 px-4">Consultant</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-normal">
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-500">
                            No appointments found matching current filter or search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-semibold text-teal-400">
                              {apt.id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{apt.patientName}</div>
                              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                <span>{apt.patientPhone}</span>
                                <span>·</span>
                                <span>{apt.patientAge}y {apt.patientGender[0]}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium">{apt.treatmentName}</div>
                              <div className="text-[11px] text-slate-400 font-mono flex items-center">
                                <IndianRupee className="w-3 h-3 mr-0.5 text-teal-400" />
                                {apt.estimatedFee.toLocaleString('en-IN')}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-300">{apt.doctorName}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <div>{apt.date}</div>
                              <div className="text-[11px] text-teal-300 font-semibold">{apt.time}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${
                                  apt.status === 'confirmed'
                                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                                    : apt.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : apt.status === 'pending'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-red-950 text-red-300 border border-red-800'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setInspectApt(apt);
                                    setInspectNotes(apt.doctorNotes || '');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                                  title="View full medical record & notes"
                                >
                                  Details
                                </button>
                                {apt.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateAptStatus(apt.id, 'confirmed')}
                                    className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 cursor-pointer"
                                    title="Confirm appointment"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
                                {apt.status === 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateAptStatus(apt.id, 'completed')}
                                    className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 cursor-pointer"
                                    title="Mark completed"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                  <button
                                    onClick={() => handleUpdateAptStatus(apt.id, 'cancelled')}
                                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 cursor-pointer"
                                    title="Cancel appointment"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CALENDAR SCHEDULE */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Interactive Clinic Calendar & Schedule
                  </h3>
                  <p className="text-xs text-slate-400">
                    Day-by-day appointment breakdown across doctors.
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Today: {todayStr}
                </div>
              </div>

              {/* 7-Day Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const d = new Date();
                  d.setDate(d.getDate() + idx);
                  const dateIso = d.toISOString().slice(0, 10);
                  const dayAppointments = appointments.filter(a => a.date === dateIso && a.status !== 'cancelled');
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const isToday = dateIso === todayStr;

                  return (
                    <div
                      key={dateIso}
                      className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[180px] ${
                        isToday
                          ? 'bg-teal-950/40 border-teal-500'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={`font-bold ${isToday ? 'text-teal-400' : 'text-slate-400'}`}>
                            {dayName}
                          </span>
                          <span className="font-mono text-slate-500">{dateIso.slice(5)}</span>
                        </div>
                        <div className="text-2xl font-bold font-mono text-white mb-2">
                          {dayAppointments.length}
                        </div>
                        <div className="space-y-1 max-h-[140px] overflow-y-auto">
                          {dayAppointments.map(a => (
                            <div
                              key={a.id}
                              onClick={() => {
                                setInspectApt(a);
                                setInspectNotes(a.doctorNotes || '');
                              }}
                              className="text-[10px] p-1.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-teal-500 truncate"
                            >
                              <span className="font-semibold text-teal-300">{a.time}</span> · {a.patientName}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                        {dayAppointments.length === 0 ? 'No bookings' : `${dayAppointments.length} scheduled`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DOCTOR MANAGEMENT */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Doctor & Specialist Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add or update consulting dentists, qualifications, duty hours and specializations.
                  </p>
                </div>
                <button
                  onClick={() => setEditingDoctor({
                    id: `new-${Date.now()}`,
                    name: '',
                    title: '',
                    degrees: '',
                    specialization: '',
                    experienceYears: 5,
                    registrationNumber: '',
                    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    workingHours: { start: '09:30', end: '18:30' },
                    bio: '',
                    treatmentsHandled: ['trt-consultation'],
                    rating: 4.9,
                    totalCases: 500
                  })}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-600 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Doctor</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div key={doc.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold text-white font-display">{doc.name}</h4>
                          <p className="text-xs text-teal-400 font-medium">{doc.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{doc.degrees}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Reg: {doc.registrationNumber}</p>
                        </div>
                        <button
                          onClick={() => setEditingDoctor(doc)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                          title="Edit doctor profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 mt-3 line-clamp-2">{doc.bio}</p>

                      <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-1 text-slate-400">
                        <div>Available: <span className="text-slate-200">{doc.availableDays.join(', ')}</span></div>
                        <div>Duty Hours: <span className="font-mono text-slate-200">{doc.workingHours.start} – {doc.workingHours.end}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TREATMENT MANAGEMENT */}
          {activeTab === 'treatments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Treatment & Fee Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Maintain procedure pricing in INR (₹), clinical durations, and procedure descriptions.
                  </p>
                </div>
                <button
                  onClick={() => setEditingTreatment({
                    id: `new-${Date.now()}`,
                    name: '',
                    category: 'Preventive',
                    shortDesc: '',
                    fullDesc: '',
                    durationMins: 45,
                    startingPrice: 1000,
                    iconName: 'Stethoscope',
                    benefits: ['Clinical safety protocol'],
                    procedureSteps: ['Initial assessment'],
                    recoveryTime: 'Immediate'
                  })}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-700 hover:bg-teal-600 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Treatment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {treatments.map((trt) => (
                  <div key={trt.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">
                            {trt.category}
                          </span>
                          <h4 className="text-sm font-bold text-white font-display">{trt.name}</h4>
                        </div>
                        <button
                          onClick={() => setEditingTreatment(trt)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                          title="Edit treatment fees & details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{trt.shortDesc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">{trt.durationMins} mins</span>
                      <span className="font-bold text-teal-400 font-mono flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        {trt.startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WORKING HOURS & HOLIDAYS */}
          {activeTab === 'hours' && (
            <div className="space-y-8 max-w-4xl">
              
              {/* Working Hours Editor */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Weekly Operating Hours</h3>
                    <p className="text-xs text-slate-400">Controls online booking availability by day of week.</p>
                  </div>
                  <button
                    onClick={handleSaveWorkingHours}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded-xl text-xs font-semibold text-white cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Working Hours</span>
                  </button>
                </div>

                <div className="space-y-2.5 pt-2">
                  {workingHours.map((wh, idx) => (
                    <div key={wh.day} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800/80">
                      <div className="w-32 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={wh.isOpen}
                          onChange={(e) => {
                            const clone = [...workingHours];
                            clone[idx].isOpen = e.target.checked;
                            setWorkingHours(clone);
                          }}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-xs font-semibold text-slate-200">{wh.day}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[11px]">Opens:</span>
                          <input
                            type="time"
                            disabled={!wh.isOpen}
                            value={wh.openTime}
                            onChange={(e) => {
                              const clone = [...workingHours];
                              clone[idx].openTime = e.target.value;
                              setWorkingHours(clone);
                            }}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 disabled:opacity-40"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[11px]">Closes:</span>
                          <input
                            type="time"
                            disabled={!wh.isOpen}
                            value={wh.closeTime}
                            onChange={(e) => {
                              const clone = [...workingHours];
                              clone[idx].closeTime = e.target.value;
                              setWorkingHours(clone);
                            }}
                            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 disabled:opacity-40"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holidays Editor */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Scheduled Clinic Holidays</h3>
                  <p className="text-xs text-slate-400">Dates on which the clinic is closed. Online booking prevents slots on these dates.</p>
                </div>

                <form onSubmit={handleAddHoliday} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <input
                    type="date"
                    required
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Occasion / Reason (e.g. Deepavali)"
                    value={newHolidayReason}
                    onChange={(e) => setNewHolidayReason(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded-xl text-xs font-semibold text-white cursor-pointer shrink-0"
                  >
                    Add Holiday
                  </button>
                </form>

                <div className="space-y-2 pt-2">
                  {holidays.map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-teal-400 font-semibold">{h.date}</span>
                        <span className="text-slate-200">{h.reason}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteHoliday(h.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                        title="Remove holiday"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: WEBSITE & CLINIC INFO */}
          {activeTab === 'website' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Website Content & Clinic Information</h3>
                  <p className="text-xs text-slate-400">Update live clinic announcement, addresses, telephone and legal registration.</p>
                </div>

                <form onSubmit={handleSaveClinicInfo} className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Top Announcement Ribbon Banner
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.announcement || ''}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, announcement: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Phone</label>
                      <input
                        type="text"
                        value={clinicInfo.phonePrimary}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, phonePrimary: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Emergency Helpline</label>
                      <input
                        type="text"
                        value={clinicInfo.emergencyPhone}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, emergencyPhone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Clinic Email</label>
                    <input
                      type="email"
                      value={clinicInfo.email}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={clinicInfo.address}
                      onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                      <input
                        type="text"
                        value={clinicInfo.city}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, city: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">State</label>
                      <input
                        type="text"
                        value={clinicInfo.state}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, state: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={clinicInfo.pincode}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, pincode: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Clinical License No</label>
                      <input
                        type="text"
                        value={clinicInfo.licenseNumber || ''}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, licenseNumber: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">GSTIN</label>
                      <input
                        type="text"
                        value={clinicInfo.gstin || ''}
                        onChange={(e) => setClinicInfo({ ...clinicInfo, gstin: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-teal-700 hover:bg-teal-600 rounded-xl text-xs font-semibold text-white cursor-pointer"
                    >
                      Save Clinic Information
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 7: NOTIFICATIONS & AUDIT LOGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Notification Settings & Audit Stream</h3>
                  <p className="text-xs text-slate-400">Simulation logs for outgoing SMS and Email patient booking dispatches.</p>
                </div>

                <div className="space-y-2 pt-2">
                  {settings?.notificationLogs && settings.notificationLogs.length > 0 ? (
                    settings.notificationLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-teal-400 font-semibold">{log.type} DISPATCH</span>
                          <span className="font-mono text-slate-500">{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-slate-300 font-mono text-[11px]">Recipient: {log.recipient}</div>
                        <p className="text-slate-400 italic text-[11px]">{log.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">No notification logs recorded yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* PATIENT APPOINTMENT DETAILS MODAL */}
      {inspectApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Patient Case File</span>
                <h3 className="text-xl font-bold text-white font-display">
                  {inspectApt.patientName}
                </h3>
                <span className="text-xs font-mono text-slate-400">Ref ID: {inspectApt.id}</span>
              </div>
              <button
                onClick={() => setInspectApt(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Facts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Phone</span>
                <span className="font-mono text-white font-medium">{inspectApt.patientPhone}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Age & Gender</span>
                <span className="text-white font-medium">{inspectApt.patientAge} years · {inspectApt.patientGender}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Visit Type</span>
                <span className="text-teal-300 font-medium">{inspectApt.isFirstVisit ? 'New Patient' : 'Returning Patient'}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Treatment</span>
                <span className="text-white font-medium">{inspectApt.treatmentName}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Doctor</span>
                <span className="text-white font-medium">{inspectApt.doctorName}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Date & Time</span>
                <span className="font-mono text-teal-300 font-medium">{inspectApt.date} · {inspectApt.time}</span>
              </div>
            </div>

            {/* Patient Complaint */}
            {inspectApt.patientNotes && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5">Patient Stated Symptoms / Notes:</span>
                <p className="text-slate-300 italic">{inspectApt.patientNotes}</p>
              </div>
            )}

            {/* Clinical / Doctor Notes Editor */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Doctor's Clinical Notes & Treatment Records
              </label>
              <textarea
                rows={3}
                placeholder="Enter intraoral examination findings, diagnosis, medicines prescribed, or procedure observations..."
                value={inspectNotes}
                onChange={(e) => setInspectNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveInspectNotes}
                  disabled={savingApt}
                  className="px-4 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {savingApt ? 'Saving Notes...' : 'Save Clinical Notes'}
                </button>
              </div>
            </div>

            {/* Status Modification Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Update Appointment Status:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateAptStatus(inspectApt.id, 'confirmed')}
                  className="px-3 py-1.5 bg-teal-900/50 hover:bg-teal-800 text-teal-200 border border-teal-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateAptStatus(inspectApt.id, 'completed')}
                  className="px-3 py-1.5 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleUpdateAptStatus(inspectApt.id, 'cancelled')}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-display">
                {editingDoctor.id.startsWith('new-') ? 'Add Specialist Doctor' : `Edit Doctor Profile: ${editingDoctor.name}`}
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Designation Title</label>
                  <input
                    type="text"
                    value={editingDoctor.title}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Medical Degrees</label>
                  <input
                    type="text"
                    value={editingDoctor.degrees}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, degrees: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={editingDoctor.experienceYears}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Council Registration No</label>
                  <input
                    type="text"
                    value={editingDoctor.registrationNumber}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Specialization Focus</label>
                <input
                  type="text"
                  value={editingDoctor.specialization}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Bio / Background</label>
                <textarea
                  rows={2}
                  value={editingDoctor.bio}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TREATMENT MODAL */}
      {editingTreatment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white font-display">
                {editingTreatment.id.startsWith('new-') ? 'Add Dental Treatment' : `Edit Treatment: ${editingTreatment.name}`}
              </h3>
              <button onClick={() => setEditingTreatment(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Treatment Name *</label>
                <input
                  type="text"
                  required
                  value={editingTreatment.name}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Category</label>
                  <select
                    value={editingTreatment.category}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Restorative">Restorative</option>
                    <option value="Cosmetic">Cosmetic</option>
                    <option value="Surgical">Surgical</option>
                    <option value="Pediatric">Pediatric</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Starting Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTreatment.startingPrice}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, startingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={editingTreatment.durationMins}
                    onChange={(e) => setEditingTreatment({ ...editingTreatment, durationMins: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Short Explanation</label>
                <textarea
                  rows={2}
                  value={editingTreatment.shortDesc}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Recovery Guidance</label>
                <input
                  type="text"
                  value={editingTreatment.recoveryTime}
                  onChange={(e) => setEditingTreatment({ ...editingTreatment, recoveryTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTreatment(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
