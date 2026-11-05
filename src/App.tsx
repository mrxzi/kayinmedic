import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { MedisyHeader } from './components/MedisyHeader';
import { MedisyActionGrid } from './components/MedisyActionGrid';
import { MedisyBottomNav } from './components/MedisyBottomNav';
import { MedisyDetailLayout } from './components/MedisyDetailLayout';
import { BristolScaleTracker } from './components/BristolScaleTracker';
import { FoodChecker } from './components/FoodChecker';
import { HydrationCounter } from './components/HydrationCounter';
import { HistoryTimeline } from './components/HistoryTimeline';
import { InAppChat } from './components/InAppChat';
import { AdminScheduleControl } from './components/AdminScheduleControl';
import type { ToiletSchedule } from './components/AdminScheduleControl';
import { AdminAuthModal } from './components/AdminAuthModal';
import { EmergencyWhatsAppModal } from './components/EmergencyWhatsAppModal';
import { SettingsModal } from './components/SettingsModal';
import { RedFlagsModal } from './components/RedFlagsModal';
import { AvatarUploadModal } from './components/AvatarUploadModal';
import type { UserSettings, StoolLogEntry } from './types';

const STORAGE_KEYS = {
  SETTINGS: 'karin_medic_settings_v3',
  LOGS: 'karin_medic_logs_v3',
  BATHROOM_COUNT: 'karin_medic_bathroom_count_v3',
  HYDRATION_WATER: 'karin_medic_water_v3',
  HYDRATION_ORALIT: 'karin_medic_oralit_v3',
  ADMIN_AUTH: 'karin_medic_admin_auth_v3',
};

const DEFAULT_SETTINGS: UserSettings = {
  partnerName: 'Karin',
  caregiverName: 'Ode',
  waNumber: '6281234567890',
};

const DEFAULT_SCHEDULE: ToiletSchedule = {
  maxToiletVisits: 3,
  hydrationTargetMl: 2500,
  adminNotes: 'minum yang banya ya sayang, mamnya harus teratur supaya punya tenaga',
  warningThreshold: 4,
};

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tracker' | 'chat' | 'hydration' | 'food' | 'admin' | 'history'>('home');
  const [currentRole, setCurrentRole] = useState<'patient' | 'admin'>('patient');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          partnerName: (parsed.partnerName === 'Kayin' || !parsed.partnerName) ? 'Karin' : parsed.partnerName,
          caregiverName: (parsed.caregiverName === 'Sayang' || parsed.caregiverName === 'Mas' || !parsed.caregiverName) ? 'Ode' : parsed.caregiverName,
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [schedule, setSchedule] = useState<ToiletSchedule>(DEFAULT_SCHEDULE);
  const [isPostgresConnected, setIsPostgresConnected] = useState(false);
  const [postgresError, setPostgresError] = useState<string | null>(null);

  const [bathroomCount, setBathroomCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BATHROOM_COUNT);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [logs, setLogs] = useState<StoolLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HYDRATION_WATER);
      return saved ? parseInt(saved, 10) : 2;
    } catch {
      return 2;
    }
  });

  const [oralitGlasses, setOralitGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HYDRATION_ORALIT);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRedFlagsOpen, setIsRedFlagsOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [showToastNotification, setShowToastNotification] = useState<string | null>(null);

  const [pendingLockedTab, setPendingLockedTab] = useState<'tracker' | 'hydration' | 'food' | 'history' | null>(null);

  const triggerToast = (msg: string) => {
    setShowToastNotification(msg);
    setTimeout(() => {
      setShowToastNotification(null);
    }, 2800);
  };

  // Check /admin URL route
  const checkAdminRoute = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/') || hash === '#admin' || hash.startsWith('#admin/');

    if (isAdminPath) {
      if (isAdminAuthenticated) {
        setCurrentRole('admin');
        setActiveTab('admin');
      } else {
        setShowAdminAuthModal(true);
      }
    } else {
      // Regular view is strictly Karin (patient) mode
      setCurrentRole('patient');
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, [checkAdminRoute]);

  // Handle successful Admin Login with PIN 2021
  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    setCurrentRole('admin');
    setActiveTab(pendingLockedTab || 'admin');
    setPendingLockedTab(null);
    setShowAdminAuthModal(false);
    triggerToast('Akses Ode Terbuka! Selamat bertugas.');
  };

  // Handle cancel Admin PIN
  const handleAdminAuthCancel = () => {
    setShowAdminAuthModal(false);
    setPendingLockedTab(null);
    if (window.location.pathname.includes('/admin')) {
      window.history.pushState(null, '', '/');
    }
    setActiveTab('home');
    setCurrentRole('patient');
  };

  // Handle Logout Admin
  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setCurrentRole('patient');
    setActiveTab('home');
    window.history.pushState(null, '', '/');
    triggerToast('Keluar dari sesi Ode. Fitur kembali dikunci.');
  };

  // Handle Tab Navigation with Patient Lock Protection
  const handleSelectTab = (tab: 'home' | 'tracker' | 'chat' | 'hydration' | 'food' | 'admin' | 'history') => {
    const isLockedForPatient = (tab === 'tracker' || tab === 'hydration' || tab === 'food' || tab === 'history');
    const isUserAdmin = Boolean(isAdminAuthenticated && currentRole === 'admin');

    if (!isUserAdmin && isLockedForPatient) {
      triggerToast('🔒 Fitur dikunci • Khusus diakses oleh Ode');
      setPendingLockedTab(tab);
      setShowAdminAuthModal(true);
      return;
    }
    setActiveTab(tab);
  };

  // Fetch status, schedule & user profiles from backend
  const fetchStatusAndSchedule = async () => {
    try {
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIsPostgresConnected(statusData.postgresConnected);
        setPostgresError(statusData.postgresError);
      }

      const scheduleRes = await fetch('/api/schedule');
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setSchedule(scheduleData);
      }

      const profilesRes = await fetch('/api/profiles');
      if (profilesRes.ok) {
        const profileData = await profilesRes.json();
        setSettings((prev) => ({
          ...prev,
          partnerName: (profileData.patientName === 'Kayin' || !profileData.patientName) ? 'Karin' : profileData.patientName,
          caregiverName: (profileData.adminName === 'Sayang' || profileData.adminName === 'Mas' || !profileData.adminName) ? 'Ode' : profileData.adminName,
          waNumber: profileData.adminWa || prev.waNumber,
          patientAvatar: profileData.patientAvatar !== undefined ? profileData.patientAvatar : prev.patientAvatar,
          adminAvatar: profileData.adminAvatar !== undefined ? profileData.adminAvatar : prev.adminAvatar,
        }));
      }
    } catch {
      // Backend starting or offline
    }
  };

  // Handle Save Avatar for Karin or Ode
  const handleSaveAvatar = async (role: 'patient' | 'admin', avatarUrl?: string) => {
    const updatedSettings: UserSettings = {
      ...settings,
      ...(role === 'patient' ? { patientAvatar: avatarUrl } : { adminAvatar: avatarUrl }),
    };
    setSettings(updatedSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));

    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: updatedSettings.partnerName,
          adminName: updatedSettings.caregiverName,
          adminWa: updatedSettings.waNumber,
          patientAvatar: updatedSettings.patientAvatar,
          adminAvatar: updatedSettings.adminAvatar,
        }),
      });
    } catch {
      // offline fallback
    }

    triggerToast(`Foto profil ${role === 'patient' ? (updatedSettings.partnerName || 'Karin') : (updatedSettings.caregiverName || 'Ode')} berhasil diperbarui!`);
  };

  useEffect(() => {
    fetchStatusAndSchedule();
    const interval = setInterval(fetchStatusAndSchedule, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.BATHROOM_COUNT, bathroomCount.toString());
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.HYDRATION_WATER, waterGlasses.toString());
    localStorage.setItem(STORAGE_KEYS.HYDRATION_ORALIT, oralitGlasses.toString());
  }, [settings, bathroomCount, logs, waterGlasses, oralitGlasses]);

  const handleAddLog = async (entry: Omit<StoolLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: StoolLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newEntry, ...prev]);

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
    } catch {
      // fallback
    }

    if (entry.type >= 5) {
      triggerToast('Peringatan Diare: Segera berikan 1 gelas Oralit');
    } else {
      triggerToast('Tercatat di Rekam Medis');
    }
  };

  const handleDeleteLog = async (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/logs/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Hapus seluruh rekam medis BAB hari ini?')) {
      setLogs([]);
      triggerToast('Rekam medis dibersihkan');
    }
  };

  const handleUpdateSchedule = async (newSchedule: ToiletSchedule) => {
    setSchedule(newSchedule);
    try {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });
      triggerToast('Jadwal Admin berhasil disimpan ke Database!');
    } catch {
      triggerToast('Jadwal disimpan secara lokal.');
    }
  };

  const handleResetDailyData = () => {
    setBathroomCount(0);
    setLogs([]);
    setWaterGlasses(0);
    setOralitGlasses(0);
    triggerToast('Data observasi harian berhasil direset');
  };

  const totalFluidMl = waterGlasses * 250 + oralitGlasses * 250;
  const latestBristolType = logs.length > 0 ? logs[0].type : 6;
  const latestPainLevel = logs.length > 0 ? logs[0].painLevel : 2;
  const isUserAdmin = Boolean(isAdminAuthenticated && currentRole === 'admin');

  return (
    <div className="min-h-screen bg-[#EBF3FA] flex justify-center selection:bg-[#0077D7] selection:text-white">
      {/* Toast Notification */}
      {showToastNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fadeIn">
          <Sparkles size={14} strokeWidth={2.4} color="#67E8F9" style={{ color: '#67E8F9' }} />
          <span>{showToastNotification}</span>
        </div>
      )}

      {/* Mobile Device Frame Container (Exactly matches reference style) */}
      <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen flex flex-col justify-between pb-24 shadow-2xl relative overflow-x-hidden">
        <div>
          {/* Main Content Router */}
          {activeTab === 'home' && (
            <>
              {/* Royal Blue Medisy Header (Clean with avatar, greeting & branding - no extra buttons) */}
              <MedisyHeader
                settings={settings}
                currentRole={currentRole}
                schedule={schedule}
                bathroomCount={bathroomCount}
                totalFluidMl={totalFluidMl}
                waterGlasses={waterGlasses}
                oralitGlasses={oralitGlasses}
                onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
              />

              {/* 2x2 Grid of Rounded Blue Feature Tiles (Observasi, Live Chat, Hidrasi, Diet Nutrisi) */}
              <MedisyActionGrid
                onSelectTab={handleSelectTab}
                isAdmin={isUserAdmin}
              />
            </>
          )}

          {/* Locked View Guard for Karin / Non-Admin */}
          {!isUserAdmin && (activeTab === 'tracker' || activeTab === 'hydration' || activeTab === 'food' || activeTab === 'history') && (
            <MedisyDetailLayout
              title="Akses Terkunci"
              subtitle="Khusus diakses oleh Ode"
              onBack={() => setActiveTab('home')}
            >
              <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-200 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                  <Lock size={28} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Fitur Sedang Dikunci</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Fitur ini saat ini hanya dapat diakses dan dikelola oleh Ode.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminAuthModal(true)}
                    className="w-full py-2.5 rounded-xl bg-[#0077D7] hover:bg-[#005FB0] text-white font-bold text-xs transition-colors shadow-md active:scale-98"
                  >
                    Buka Akses (PIN Ode 2021)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            </MedisyDetailLayout>
          )}

          {activeTab === 'tracker' && isUserAdmin && (
            <MedisyDetailLayout
              title="Catat Observasi"
              subtitle="Pencatatan BAB & Skala Bristol BSFS"
              onBack={() => setActiveTab('home')}
            >
              <BristolScaleTracker
                bathroomCount={bathroomCount}
                onUpdateBathroomCount={setBathroomCount}
                onAddLog={handleAddLog}
                onTriggerOralitSuggestion={() => {
                  setOralitGlasses((prev) => prev + 1);
                  triggerToast('1 Gelas Oralit otomatis dicatat');
                }}
                totalFluidMl={totalFluidMl}
                latestPainLevel={latestPainLevel}
                schedule={schedule}
                onQuickAddWater={() => {
                  setWaterGlasses((prev) => prev + 1);
                  triggerToast('1 Gelas Air dicatat (+250ml)');
                }}
              />
            </MedisyDetailLayout>
          )}

          {activeTab === 'chat' && (
            <InAppChat
              currentRole={currentRole}
              patientName={settings.partnerName}
              adminName={settings.caregiverName}
              patientAvatar={settings.patientAvatar}
              adminAvatar={settings.adminAvatar}
              onBack={() => setActiveTab('home')}
              onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
            />
          )}

          {activeTab === 'hydration' && isUserAdmin && (
            <MedisyDetailLayout
              title="Target Hidrasi & Oralit"
              subtitle="Protokol Rehidrasi Oral (ORT)"
              onBack={() => setActiveTab('home')}
            >
              <HydrationCounter
                waterGlasses={waterGlasses}
                oralitGlasses={oralitGlasses}
                onUpdateWater={setWaterGlasses}
                onUpdateOralit={setOralitGlasses}
              />
            </MedisyDetailLayout>
          )}

          {activeTab === 'admin' && (
            <MedisyDetailLayout
              title="Jadwal & Kontrol Admin"
              subtitle="Atur batas kunjungan toilet & target pasien"
              onBack={() => setActiveTab('home')}
            >
              <AdminScheduleControl
                schedule={schedule}
                onUpdateSchedule={handleUpdateSchedule}
                currentBathroomCount={bathroomCount}
                isPostgresConnected={isPostgresConnected}
                postgresError={postgresError}
                onLogoutAdmin={handleLogoutAdmin}
                onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
              />
            </MedisyDetailLayout>
          )}

          {activeTab === 'food' && isUserAdmin && (
            <MedisyDetailLayout
              title="Diet Nutrisi BRAT"
              subtitle="Pedoman Makanan Aman vs. Pantangan"
              onBack={() => setActiveTab('home')}
            >
              <FoodChecker />
            </MedisyDetailLayout>
          )}

          {activeTab === 'history' && isUserAdmin && (
            <MedisyDetailLayout
              title="Rekam Medis Harian"
              subtitle="Riwayat Observasi & Tingkat Nyeri"
              onBack={() => setActiveTab('home')}
            >
              <HistoryTimeline
                logs={logs}
                onDeleteLog={handleDeleteLog}
                onClearLogs={handleClearLogs}
              />
            </MedisyDetailLayout>
          )}
        </div>

        {/* Floating Medisy Bottom Navigation Bar (riwayat for patient, admin when logged in as admin) */}
        {activeTab !== 'chat' && (
          <MedisyBottomNav
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            logsCount={logs.length}
            isAdmin={isUserAdmin}
          />
        )}
      </div>

      {/* Avatar Upload Modal (User & Admin photo selection) */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        settings={settings}
        initialRole={currentRole}
        onSaveAvatar={handleSaveAvatar}
      />

      {/* Admin 4-Digit PIN Access Modal (/admin URL code: 2021) */}
      <AdminAuthModal
        isOpen={showAdminAuthModal}
        onSuccess={handleAdminAuthSuccess}
        onCancel={handleAdminAuthCancel}
      />

      {/* Emergency WhatsApp Modal */}
      <EmergencyWhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        settings={settings}
        bathroomCount={bathroomCount}
        latestPainLevel={latestPainLevel}
        latestBristolType={latestBristolType}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onResetDailyData={handleResetDailyData}
      />

      {/* Red Flags Triage Modal */}
      <RedFlagsModal
        isOpen={isRedFlagsOpen}
        onClose={() => setIsRedFlagsOpen(false)}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
      />
    </div>
  );
}

export default App;