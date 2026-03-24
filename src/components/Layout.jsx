import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, Users, BookOpen, BarChart2, Clock,
  FileText, CheckSquare, AlertTriangle, MapPin, DollarSign, Settings,
  Sun, Moon, Globe, Menu, X, ChevronRight, LogOut, Shield, Wifi, WifiOff, Receipt
} from 'lucide-react';

const NAV_LABELS = {
  en: {
    dashboard: 'Dashboard', calendar: 'Calendar', staff: 'Staff Management',
    pendingleaves: 'Leave Requests', redflags: 'Red Flags', visits: 'People to Visit',
    budget: 'Budget', reports: 'Reports', classes: 'My Classes', logtime: 'Log Time',
    leave: 'Request Leave', settings: 'Settings', admin: 'Command Centre',
    main: 'Main', management: 'Management', personal: 'Personal',
    myWork: 'My Work', account: 'Account', adminSection: 'Admin',
    reimbursement: 'Reimbursement',
  },
  ar: {
    dashboard: 'لوحة القيادة', calendar: 'التقويم', staff: 'إدارة الموظفين',
    pendingleaves: 'طلبات الإجازة', redflags: 'التنبيهات', visits: 'الزيارات',
    budget: 'الميزانية', reports: 'التقارير', classes: 'فصولي', logtime: 'تسجيل الوقت',
    leave: 'طلب إجازة', settings: 'الإعدادات', admin: 'مركز القيادة',
    main: 'رئيسي', management: 'الإدارة', personal: 'شخصي',
    myWork: 'عملي', account: 'الحساب', adminSection: 'مسؤول',
    reimbursement: 'التعويض',
  },
  ur: {
    dashboard: 'ڈیش بورڈ', calendar: 'کیلنڈر', staff: 'عملہ انتظام',
    pendingleaves: 'چھٹی کی درخواستیں', redflags: 'ریڈ فلیگز', visits: 'ملاقاتیں',
    budget: 'بجٹ', reports: 'رپورٹس', classes: 'میری کلاسیں', logtime: 'وقت ریکارڈ',
    leave: 'چھٹی کی درخواست', settings: 'ترتیبات', admin: 'کمانڈ سینٹر',
    main: 'مرکزی', management: 'انتظامیہ', personal: 'ذاتی',
    myWork: 'میرا کام', account: 'اکاؤنٹ', adminSection: 'ایڈمن',
    reimbursement: 'معاوضہ',
  },
  es: {
    dashboard: 'Panel', calendar: 'Calendario', staff: 'Personal',
    pendingleaves: 'Solicitudes de Licencia', redflags: 'Alertas', visits: 'Visitas',
    budget: 'Presupuesto', reports: 'Informes', classes: 'Mis Clases', logtime: 'Registrar Tiempo',
    leave: 'Solicitar Licencia', settings: 'Ajustes', admin: 'Centro de Comando',
    main: 'Principal', management: 'Gestión', personal: 'Personal',
    myWork: 'Mi Trabajo', account: 'Cuenta', adminSection: 'Admin',
    reimbursement: 'Reembolso',
  },
  pt: {
    dashboard: 'Painel', calendar: 'Calendário', staff: 'Funcionários',
    pendingleaves: 'Solicitações de Licença', redflags: 'Alertas', visits: 'Visitas',
    budget: 'Orçamento', reports: 'Relatórios', classes: 'Minhas Turmas', logtime: 'Registrar Tempo',
    leave: 'Solicitar Licença', settings: 'Configurações', admin: 'Centro de Comando',
    main: 'Principal', management: 'Gestão', personal: 'Pessoal',
    myWork: 'Meu Trabalho', account: 'Conta', adminSection: 'Admin',
    reimbursement: 'Reembolso',
  },
};

const buildSections = (role, lbl, hasReimbNotify) => {
  // Badge for admin/management links
  const adminBadge = hasReimbNotify;

  const managerSections = [
    { key: 'main', label: lbl.main, links: [
      { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
      { view: 'calendar', icon: Calendar, label: lbl.calendar },
    ]},
    { key: 'management', label: lbl.management, badge: adminBadge, links: [
      { view: 'staff', icon: Users, label: lbl.staff },
      { view: 'pendingleaves', icon: FileText, label: lbl.pendingleaves },
      { view: 'redflags', icon: AlertTriangle, label: lbl.redflags },
      { view: 'visits', icon: MapPin, label: lbl.visits },
      { view: 'budget', icon: DollarSign, label: lbl.budget },
      { view: 'reports', icon: BarChart2, label: lbl.reports },
    ]},
    { key: 'personal', label: lbl.personal, links: [
      { view: 'classes', icon: BookOpen, label: lbl.classes },
      { view: 'logtime', icon: Clock, label: lbl.logtime },
      { view: 'leave', icon: CheckSquare, label: lbl.leave },
      { view: 'reimbursement', icon: Receipt, label: lbl.reimbursement },
      { view: 'settings', icon: Settings, label: lbl.settings },
    ]},
  ];

  if (role === 'Admin') {
    return [
      { key: 'admin', label: lbl.adminSection, links: [
        { view: 'admin', icon: Shield, label: lbl.admin, badge: adminBadge },
        { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
      ]},
      ...managerSections.slice(1),
    ];
  }

  if (role === 'Manager' || role === 'manager') return managerSections;

  // Teacher / Staff
  return [
    { key: 'main', label: lbl.main, links: [
      { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
      { view: 'calendar', icon: Calendar, label: lbl.calendar },
    ]},
    { key: 'myWork', label: lbl.myWork, links: [
      { view: 'classes', icon: BookOpen, label: lbl.classes },
      { view: 'logtime', icon: Clock, label: lbl.logtime },
      { view: 'leave', icon: CheckSquare, label: lbl.leave },
      { view: 'reimbursement', icon: Receipt, label: lbl.reimbursement },
      { view: 'visits', icon: MapPin, label: lbl.visits },
    ]},
    { key: 'account', label: lbl.account, links: [
      { view: 'settings', icon: Settings, label: lbl.settings },
    ]},
  ];
};

function NavSection({ section, currentView, onNavigate }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`nav-section ${open ? 'open' : ''}`}>
      <button className="nav-section-header" onClick={() => setOpen(o => !o)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {section.label}
          {section.badge && (
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          )}
        </span>
        <ChevronRight size={14} className="nav-section-chevron" />
      </button>
      <div className="nav-section-links">
        {section.links.map(link => (
          <a
            key={link.view}
            className={currentView === link.view ? 'active' : ''}
            onClick={() => onNavigate(link.view)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <link.icon size={18} />
              {link.label}
            </span>
            {link.badge && (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 9, background: '#ef4444', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '0 5px' }}>
                !
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

const BOTTOM_NAV_KEYS = ['dashboard', 'calendar', 'logtime', 'classes', 'settings'];
const BOTTOM_NAV_ICONS = { dashboard: LayoutDashboard, calendar: Calendar, logtime: Clock, classes: BookOpen, settings: Settings };

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'عربي' },
  { code: 'ur', label: 'اردو' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

export default function Layout({
  user, currentView, onNavigate, onLogout,
  theme, onToggleTheme, language, onChangeLanguage,
  sidebarCollapsed, onToggleSidebar,
  mobileSidebarOpen, onToggleMobileSidebar,
  children
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState(() => localStorage.getItem('haazimi_last_synced') || null);
  const [hasReimbNotify, setHasReimbNotify] = useState(() => {
    const isAdminOrManager = ['Admin', 'Manager', 'manager'].includes(user?.role);
    return isAdminOrManager && localStorage.getItem('haazimi_reimbursement_notify') === 'true';
  });

  const lbl = NAV_LABELS[language] || NAV_LABELS.en;
  const sections = buildSections(user.role, lbl, hasReimbNotify);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      const ts = new Date().toLocaleTimeString();
      setLastSynced(ts);
      localStorage.setItem('haazimi_last_synced', ts);
    };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  // Clear notification when admin navigates to Command Centre
  useEffect(() => {
    if (currentView === 'admin' && hasReimbNotify) {
      localStorage.removeItem('haazimi_reimbursement_notify');
      setHasReimbNotify(false);
    }
  }, [currentView]);

  const handleToggle = () => {
    if (isMobile) { onToggleMobileSidebar(); } else { onToggleSidebar(); }
  };

  const bottomNavItems = BOTTOM_NAV_KEYS.map(k => ({
    view: k,
    icon: BOTTOM_NAV_ICONS[k],
    label: lbl[k] || k,
  }));

  return (
    <div className={`app-container has-bottom-nav ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <div className="main-view-overlay" onClick={onToggleMobileSidebar} />

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Madrassa Haazimi</h1>
        </div>
        <nav className="sidebar-nav">
          {sections.map(section => (
            <NavSection
              key={section.key}
              section={section}
              currentView={currentView}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {isOnline
              ? <><Wifi size={12} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e' }}>Online{lastSynced ? ` · Synced ${lastSynced}` : ''}</span></>
              : <><WifiOff size={12} style={{ color: '#f59e0b' }} /><span style={{ color: '#f59e0b' }}>Offline — data saved locally</span></>
            }
          </div>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="main-view">
        <header className="app-header">
          <button className="sidebar-toggle" onClick={handleToggle}>
            {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="user-info">
            <div className="user-profile">
              <div className="user-name">{user.name}</div>
              <div className="user-center">{user.centre || user.center} · {user.role}</div>
            </div>
          </div>
          <div className="header-actions">
            <div className="language-switcher">
              <button className="language-switcher-button" onClick={() => setLangOpen(o => !o)}>
                <Globe size={22} />
              </button>
              {langOpen && (
                <div className="language-switcher-dropdown">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={language === l.code ? 'active' : ''}
                      onClick={() => { onChangeLanguage(l.code); setLangOpen(false); }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>

        <nav className="bottom-nav-bar">
          {bottomNavItems.map(item => (
            <button
              key={item.view}
              className={`bottom-nav-item ${currentView === item.view ? 'active' : ''}`}
              onClick={() => onNavigate(item.view)}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
