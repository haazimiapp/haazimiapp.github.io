import { useState, useEffect } from 'react';
import OnboardingTour, { isTourDone, resetTour } from './components/OnboardingTour';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import StaffManagement from './components/StaffManagement';
import MyClasses from './components/MyClasses';
import Reports from './components/Reports';
import LogTime from './components/LogTime';
import LeaveRequest from './components/LeaveRequest';
import PendingLeaves from './components/PendingLeaves';
import RedFlags from './components/RedFlags';
import PeopleToVisit from './components/PeopleToVisit';
import Budget from './components/Budget';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import Reimbursement from './components/Reimbursement';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import StudentsList from './components/StudentsList';
import { supabase } from './lib/supabase';
import { settingsApi, authApi } from './lib/supabaseApi';

const VIEWS = {
  dashboard: Dashboard,
  calendar: Calendar,
  staff: StaffManagement,
  classes: MyClasses,
  reports: Reports,
  logtime: LogTime,
  leave: LeaveRequest,
  pendingleaves: PendingLeaves,
  redflags: RedFlags,
  visits: PeopleToVisit,
  budget: Budget,
  settings: Settings,
  admin: AdminPanel,
  reimbursement: Reimbursement,
  superadmin: SuperAdminDashboard,
  students: StudentsList,
};

const MANAGER_ONLY_VIEWS = new Set(['pendingleaves', 'staff', 'redflags', 'budget', 'reports', 'admin']);
const SUPER_ADMIN_ONLY_VIEWS = new Set(['superadmin']);
const SUPER_ADMIN_BLOCKED_VIEWS = new Set(['logtime', 'leave', 'classes', 'staff', 'pendingleaves', 'reimbursement', 'admin']);

const TEMP_PASSWORD = 'WelcomeHaazimi2026!';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPasswordForm, setNewPasswordForm] = useState({ pw: '', pw2: '' });
  const [pwChangeError, setPwChangeError] = useState('');
  const [pwChanging, setPwChanging] = useState(false);

  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'Super Admin') return 'superadmin';
        if (u.role === 'Country Admin') return 'admin';
        if (u.role === 'Centre Manager') return 'dashboard';
      }
    } catch {}
    return 'dashboard';
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('haazimi_color_scheme') || 'blue');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile && profile.status === 'Approved') {
            _doLogin({
              name: profile.name,
              email: profile.email,
              role: profile.role,
              country: profile.country,
              centre: profile.centre,
            }, false);
          }
        }
      } catch {}
    };
    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('haazimi_user');
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-color-scheme', colorScheme === 'blue' ? '' : colorScheme);
    localStorage.setItem('haazimi_color_scheme', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    const handler = (e) => setColorScheme(e.detail.scheme);
    window.addEventListener('haazimi-color-scheme-changed', handler);
    return () => window.removeEventListener('haazimi-color-scheme-changed', handler);
  }, []);

  useEffect(() => {
    const rtl = language === 'ar' || language === 'ur';
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language]);

  const _doLogin = async (sessionUser, isDev = false) => {
    const userWithTag = { ...sessionUser, isDev };
    localStorage.setItem('haazimi_user', JSON.stringify(userWithTag));
    setUser(userWithTag);
    setMobileSidebarOpen(false);

    const role = sessionUser.role;
    if (role === 'Super Admin') setCurrentView('superadmin');
    else if (role === 'Country Admin') setCurrentView('admin');
    else if (role === 'Centre Manager') setCurrentView('dashboard');
    else setCurrentView('dashboard');

    if (!isTourDone()) setShowTour(true);

    // Fetch settings from Supabase in the background
    if (!isDev) {
      try {
        const cloudSettings = await settingsApi.getAll();
        if (cloudSettings) {
          localStorage.setItem('haazimi_global_settings', JSON.stringify(cloudSettings));
        }
      } catch (e) {
        console.error('Cloud settings sync failed', e);
      }
    }

    return { success: true };
  };

  // --- LOGIC TO FILTER MENU ITEMS BASED ON CLOUD SETTINGS ---
  const getFilteredMenuItems = () => {
    const globalSettings = JSON.parse(localStorage.getItem('haazimi_global_settings') || '{}');
    const myCentreSettings = globalSettings[user?.centre || user?.Centre] || {};

    const featureMap = {
      logtime: 'leaves',
      leave: 'leaves',
      budget: 'budget',
      calendar: 'calendar',
      reimbursement: 'reimbursement',
      expenses: 'expenses',
      redflags: 'redflags',
      reports: 'reports',
      classes: 'classes',
      visits: 'redflags',
    };

    const isVisible = (viewKey) => {
      const featureKey = featureMap[viewKey];
      if (!featureKey) return true;
      return myCentreSettings[featureKey] !== false;
    };

    return isVisible;
  };

  const handleLogin = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();

    // Try Supabase Auth first
    try {
      const result = await authApi.signIn(normalizedEmail, password);
      if (!result.error && result.profile) {
        const profile = result.profile;
        if (profile.status === 'Pending') return { success: false, message: 'Awaiting admin approval.' };
        if (profile.status === 'Denied') return { success: false, message: 'Registration denied.' };
        if (profile.status === 'Approved') {
          const loginResult = await _doLogin({
            name: profile.name,
            email: profile.email,
            role: profile.role,
            country: profile.country,
            centre: profile.centre,
          }, false);
          if (password === TEMP_PASSWORD) {
            setMustChangePassword(true);
          }
          return loginResult;
        }
      }
    } catch {}

    // Fall back to localStorage accounts
    try {
      const localAccounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const localUser = localAccounts.find((u) => (u.email || '').toLowerCase() === normalizedEmail);
      if (localUser) {
        if (localUser.password !== password) return { success: false, message: 'Incorrect password.' };
        if (localUser.status === 'Pending') return { success: false, message: 'Awaiting admin approval.' };
        if (localUser.status === 'Denied') return { success: false, message: 'Registration denied. Contact an admin.' };
        if (localUser.status === 'Approved') {
          return _doLogin({
            name: localUser.name, email: localUser.email, role: localUser.role || 'Staff',
            country: localUser.country || '', centre: localUser.centre || '',
          }, false);
        }
      }
    } catch {}

    return { success: false, message: 'No account found. Please register or contact your admin.' };
  };

  const handleRegister = async (name, email, password, country, centre) => {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const result = await authApi.signUp(name, normalizedEmail, password, country, centre);

      if (result.existingStatus) {
        const s = result.existingStatus;
        if (s === 'Approved') return { success: false, message: 'An account with this email already exists. Please sign in.' };
        if (s === 'Pending') return { success: false, message: 'Your registration is already submitted and pending approval.' };
        if (s === 'Denied') return { success: false, message: 'Your registration was previously denied. Please contact an admin.' };
      }

      if (result.error) throw result.error;

      return { success: true };
    } catch {
      // Fall back to localStorage registration
      const newAccount = {
        name: name.trim(), email: normalizedEmail, password,
        role: 'Staff', country, centre,
        status: 'Pending', registeredAt: new Date().toISOString(),
      };
      try {
        const existing = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
        existing.push(newAccount);
        localStorage.setItem('haazimi_accounts', JSON.stringify(existing));
      } catch {}
      return { success: true };
    }
  };

  const handleDevLogin = (role) => {
    const devUsers = {
      centremanager: { name: 'Dev Centre Manager', email: 'centremanager@dev.local', role: 'Centre Manager', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
      staff: { name: 'Dev Staff', email: 'staff@dev.local', role: 'Staff', country: 'South Africa', centre: 'Ext. 13 (Lenasia)' },
      countryadmin: { name: 'Dev Country Admin', email: 'countryadmin@dev.local', role: 'Country Admin', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
      superadmin: { name: 'Dev Super Admin', email: 'superadmin@dev.local', role: 'Super Admin', country: '', centre: '' },
    };
    const sessionUser = devUsers[role] || devUsers.staff;
    _doLogin(sessionUser, true);
  };

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    localStorage.removeItem('haazimi_user');
    setUser(null);
    setMobileSidebarOpen(false);
    setCurrentView('dashboard');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { pw, pw2 } = newPasswordForm;
    if (pw !== pw2) { setPwChangeError('Passwords do not match.'); return; }
    if (pw.length < 8 || !/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) {
      setPwChangeError('Password must be at least 8 characters with letters and numbers.');
      return;
    }
    setPwChanging(true);
    setPwChangeError('');
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) { setPwChangeError(error.message); }
      else { setMustChangePassword(false); setNewPasswordForm({ pw: '', pw2: '' }); }
    } catch (err) {
      setPwChangeError('Failed to update password. Please try again.');
    }
    setPwChanging(false);
  };

  const toggleTheme = () => setTheme((t) => t === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarCollapsed((c) => !c);
  const toggleMobileSidebar = () => setMobileSidebarOpen((o) => !o);

  const isManagerOrAdmin = (role) => ['Centre Manager', 'Country Admin', 'Super Admin'].includes(role);
  const isSuperAdmin = (role) => role === 'Super Admin';

  const handleNavigate = (view) => {
    if (SUPER_ADMIN_ONLY_VIEWS.has(view) && !isSuperAdmin(user?.role)) return;
    if (MANAGER_ONLY_VIEWS.has(view) && !isManagerOrAdmin(user?.role)) return;
    if (SUPER_ADMIN_BLOCKED_VIEWS.has(view) && isSuperAdmin(user?.role)) return;

    const checkVisibility = getFilteredMenuItems();
    if (!checkVisibility(view)) {
      alert('This feature has been disabled by your administrator.');
      return;
    }

    setCurrentView(view);
    setMobileSidebarOpen(false);
  };

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDevLogin={handleDevLogin}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onChangeLanguage={setLanguage}
      />
    );
  }

  const checkVisibility = getFilteredMenuItems();
  const resolvedView = SUPER_ADMIN_ONLY_VIEWS.has(currentView) && !isSuperAdmin(user?.role) ? 'dashboard'
    : MANAGER_ONLY_VIEWS.has(currentView) && !isManagerOrAdmin(user?.role) ? 'dashboard'
    : SUPER_ADMIN_BLOCKED_VIEWS.has(currentView) && isSuperAdmin(user?.role) ? 'superadmin'
    : !checkVisibility(currentView) ? 'dashboard'
    : currentView;

  const ViewComponent = VIEWS[resolvedView] || Dashboard;

  return (
    <>
      <Layout
        user={user}
        currentView={resolvedView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onChangeLanguage={setLanguage}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={toggleMobileSidebar}
        checkVisibility={checkVisibility}
      >
        <ViewComponent
          user={user}
          onNavigate={handleNavigate}
          language={language}
          isDev={!!user.isDev}
          checkVisibility={checkVisibility}
          onReplayTour={() => { resetTour(); setShowTour(true); }}
        />
      </Layout>
      {showTour && (
        <OnboardingTour
          user={user}
          language={language}
          onDone={() => setShowTour(false)}
          checkVisibility={checkVisibility}
        />
      )}
      {mustChangePassword && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 8px', color: '#dc2626', fontSize: '1.1rem' }}>🔒 Password Change Required</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
              You logged in with a temporary password. For your security, please set a new password before continuing.
            </p>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pwChangeError && <div style={{ background: '#fee2e2', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem' }}>{pwChangeError}</div>}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>New Password</label>
                <input type="password" value={newPasswordForm.pw} onChange={e => setNewPasswordForm(f => ({ ...f, pw: e.target.value }))} placeholder="Min. 8 chars, letters & numbers" required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Confirm New Password</label>
                <input type="password" value={newPasswordForm.pw2} onChange={e => setNewPasswordForm(f => ({ ...f, pw2: e.target.value }))} placeholder="Repeat new password" required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={pwChanging} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: pwChanging ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {pwChanging ? 'Saving…' : 'Set New Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
