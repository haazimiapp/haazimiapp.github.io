import { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Globe, ToggleRight, Shield, BookOpen, MapPin, CheckCircle, Clock, XCircle, RefreshCw, Loader, Trash2, Search, Filter, Edit2, Check, X, TrendingUp, AlertCircle, BarChart2, ChevronDown, ChevronRight, UserCheck, Activity } from 'lucide-react';
import { COUNTRY_CENTRES } from '../data/config';
import { profilesApi, settingsApi } from '../lib/supabaseApi';

const FEATURE_KEYS = ['budget', 'calendar', 'reimbursement', 'expenses', 'redflags', 'reports', 'classes'];
const FEATURE_LABELS = { budget: 'Budget', calendar: 'Calendar', reimbursement: 'Reimbursements', expenses: 'Expenses', redflags: 'Red Flags', reports: 'Reports', classes: 'My Classes' };
const ROLES = ['Staff', 'Centre Manager', 'Country Admin', 'Super Admin'];
const STATUSES = ['Pending', 'Approved', 'Denied'];

const TL = {
  en: {
    title: 'Super Admin Dashboard', sub: 'Global overview — all countries and centres',
    sync: 'Refresh Data', syncing: 'Refreshing…',
    tabOverview: 'Overview', tabUsers: 'Users', tabToggles: 'Feature Toggles', tabInsights: 'Insights',
    totalUsers: 'Total Users', pendingApprovals: 'Pending Approvals', approved: 'Approved', countries: 'Countries',
    usersByCountry: 'Users by Country', noUsers: 'No registered users yet.', active: 'active',
    userDir: 'System User Directory', managePerms: 'Manage permissions and global account status.',
    allStatuses: 'All Statuses', pendingOnly: 'Pending Only', approvedOnly: 'Approved Only', deniedOnly: 'Denied Only',
    searchPlaceholder: 'Search name or email...',
    userDetails: 'User Details', location: 'Location', accessLevel: 'Access Level', status: 'Status', management: 'Management',
    unassigned: 'Unassigned', unnamed: 'Unnamed User',
    featureToggleTitle: 'Feature Toggles by Centre', featureToggleSub: 'Enable or disable features globally for specific centres.',
    centre: 'Centre',
    confirmDelete: (email) => `Are you sure you want to permanently delete user: ${email}? This cannot be undone.`,
    cloudError: 'Could not load data from server — showing cached data only.',
    insightsTitle: 'Institutional Insights', insightsSub: 'Student stats, attendance, and teacher activity across all centres.',
    totalStudents: 'Total Students', avgAttendance: 'Avg Attendance', atRisk: 'At Risk', avgIntentions: 'Avg Intentions',
    studentStatusBreakdown: 'Student Status Breakdown', attendanceByClass: 'Attendance by Class',
    teacherActivity: 'Teacher Activity (Logged Sessions)', totalSessions: 'Total Sessions', totalHours: 'Total Hours',
    avgStudentsPerSession: 'Avg Students / Session', totalAbsences: 'Absences Reported',
    noLogsYet: 'No sessions logged yet.',
    noStudentsYet: 'No student data available.',
    studentsLabel: 'students',
  },
  ar: {
    title: 'لوحة المشرف العام', sub: 'نظرة عامة شاملة — جميع الدول والمراكز',
    sync: 'تحديث البيانات', syncing: 'جارٍ التحديث…',
    tabOverview: 'نظرة عامة', tabUsers: 'المستخدمون', tabToggles: 'تبديل الميزات', tabInsights: 'الإحصاءات',
    totalUsers: 'إجمالي المستخدمين', pendingApprovals: 'انتظار الموافقة', approved: 'موافق عليه', countries: 'الدول',
    usersByCountry: 'المستخدمون حسب الدولة', noUsers: 'لا يوجد مستخدمون مسجلون بعد.', active: 'نشط',
    userDir: 'دليل مستخدمي النظام', managePerms: 'إدارة الأذونات وحالة الحساب.',
    allStatuses: 'جميع الحالات', pendingOnly: 'قيد الانتظار', approvedOnly: 'موافق عليه', deniedOnly: 'مرفوض',
    searchPlaceholder: 'بحث بالاسم أو البريد...',
    userDetails: 'تفاصيل المستخدم', location: 'الموقع', accessLevel: 'مستوى الوصول', status: 'الحالة', management: 'الإدارة',
    unassigned: 'غير مخصص', unnamed: 'مستخدم بدون اسم',
    featureToggleTitle: 'تبديل الميزات حسب المركز', featureToggleSub: 'تفعيل أو تعطيل الميزات للمراكز.',
    centre: 'المركز',
    confirmDelete: (email) => `هل أنت متأكد من الحذف الدائم: ${email}؟`,
    cloudError: 'تعذّر تحميل البيانات من الخادم — عرض البيانات المخزنة محلياً.',
    insightsTitle: 'إحصاءات المؤسسة', insightsSub: 'إحصاءات الطلاب والحضور وأنشطة المعلمين.',
    totalStudents: 'إجمالي الطلاب', avgAttendance: 'متوسط الحضور', atRisk: 'في خطر', avgIntentions: 'متوسط النيات',
    studentStatusBreakdown: 'توزيع حالة الطلاب', attendanceByClass: 'الحضور حسب الفصل',
    teacherActivity: 'نشاط المعلمين (الجلسات المسجلة)', totalSessions: 'إجمالي الجلسات', totalHours: 'إجمالي الساعات',
    avgStudentsPerSession: 'متوسط الطلاب / جلسة', totalAbsences: 'الغيابات المسجلة',
    noLogsYet: 'لم يتم تسجيل أي جلسات بعد.', noStudentsYet: 'لا توجد بيانات طلاب.',
    studentsLabel: 'طلاب',
  },
  ur: {
    title: 'سپر ایڈمن ڈیش بورڈ', sub: 'عالمی جائزہ — تمام ممالک اور مراکز',
    sync: 'ڈیٹا تازہ کریں', syncing: 'تازہ ہو رہا ہے…',
    tabOverview: 'جائزہ', tabUsers: 'صارفین', tabToggles: 'فیچر ٹوگلز', tabInsights: 'بصیرت',
    totalUsers: 'کل صارفین', pendingApprovals: 'زیر التواء منظوری', approved: 'منظور شدہ', countries: 'ممالک',
    usersByCountry: 'ملک کے مطابق صارفین', noUsers: 'ابھی کوئی رجسٹرڈ صارف نہیں۔', active: 'فعال',
    userDir: 'سسٹم صارف ڈائریکٹری', managePerms: 'اجازتیں اور عالمی اکاؤنٹ کی حالت منظم کریں۔',
    allStatuses: 'تمام حالات', pendingOnly: 'صرف زیر التواء', approvedOnly: 'صرف منظور شدہ', deniedOnly: 'صرف مسترد',
    searchPlaceholder: 'نام یا ای میل تلاش کریں...',
    userDetails: 'صارف کی تفصیلات', location: 'مقام', accessLevel: 'رسائی کی سطح', status: 'حالت', management: 'انتظام',
    unassigned: 'غیر مختص', unnamed: 'بے نام صارف',
    featureToggleTitle: 'مرکز کے مطابق فیچر ٹوگلز', featureToggleSub: 'مخصوص مراکز کے لیے فیچرز فعال یا غیر فعال کریں۔',
    centre: 'مرکز',
    confirmDelete: (email) => `کیا آپ واقعی ${email} کو مستقل طور پر حذف کرنا چاہتے ہیں؟`,
    cloudError: 'سرور سے ڈیٹا لوڈ نہیں ہو سکا — محفوظ ڈیٹا دکھایا جا رہا ہے۔',
    insightsTitle: 'ادارہ جاتی بصیرت', insightsSub: 'تمام مراکز میں طلبہ کی اعداد و شمار، حاضری، اور اساتذہ کی سرگرمی۔',
    totalStudents: 'کل طلبہ', avgAttendance: 'اوسط حاضری', atRisk: 'خطرے میں', avgIntentions: 'اوسط نیتیں',
    studentStatusBreakdown: 'طلبہ کی حالت کا خلاصہ', attendanceByClass: 'کلاس کے مطابق حاضری',
    teacherActivity: 'اساتذہ کی سرگرمی (لاگ سیشنز)', totalSessions: 'کل سیشن', totalHours: 'کل گھنٹے',
    avgStudentsPerSession: 'اوسط طلبہ / سیشن', totalAbsences: 'غیر حاضری رپورٹ',
    noLogsYet: 'ابھی کوئی سیشن لاگ نہیں کیا گیا۔', noStudentsYet: 'طلبہ کا ڈیٹا دستیاب نہیں۔',
    studentsLabel: 'طلبہ',
  },
  es: {
    title: 'Panel de Super Admin', sub: 'Vista global — todos los países y centros',
    sync: 'Actualizar Datos', syncing: 'Actualizando…',
    tabOverview: 'Resumen', tabUsers: 'Usuarios', tabToggles: 'Funciones', tabInsights: 'Análisis',
    totalUsers: 'Total de Usuarios', pendingApprovals: 'Aprobaciones Pendientes', approved: 'Aprobados', countries: 'Países',
    usersByCountry: 'Usuarios por País', noUsers: 'No hay usuarios registrados aún.', active: 'activo',
    userDir: 'Directorio de Usuarios del Sistema', managePerms: 'Administrar permisos y estado de cuentas.',
    allStatuses: 'Todos los Estados', pendingOnly: 'Solo Pendientes', approvedOnly: 'Solo Aprobados', deniedOnly: 'Solo Denegados',
    searchPlaceholder: 'Buscar nombre o correo...',
    userDetails: 'Detalles del Usuario', location: 'Ubicación', accessLevel: 'Nivel de Acceso', status: 'Estado', management: 'Gestión',
    unassigned: 'Sin Asignar', unnamed: 'Usuario Sin Nombre',
    featureToggleTitle: 'Funciones por Centro', featureToggleSub: 'Activar o desactivar funciones para centros específicos.',
    centre: 'Centro',
    confirmDelete: (email) => `¿Está seguro de eliminar permanentemente al usuario: ${email}? Esto no se puede deshacer.`,
    cloudError: 'No se pudo cargar datos del servidor — mostrando datos en caché.',
    insightsTitle: 'Análisis Institucional', insightsSub: 'Estadísticas de estudiantes, asistencia y actividad docente.',
    totalStudents: 'Total de Estudiantes', avgAttendance: 'Asistencia Promedio', atRisk: 'En Riesgo', avgIntentions: 'Intenciones Promedio',
    studentStatusBreakdown: 'Distribución de Estado de Estudiantes', attendanceByClass: 'Asistencia por Clase',
    teacherActivity: 'Actividad Docente (Sesiones)', totalSessions: 'Total Sesiones', totalHours: 'Horas Totales',
    avgStudentsPerSession: 'Estudiantes Prom. / Sesión', totalAbsences: 'Ausencias Registradas',
    noLogsYet: 'Aún no se han registrado sesiones.', noStudentsYet: 'No hay datos de estudiantes disponibles.',
    studentsLabel: 'estudiantes',
  },
  pt: {
    title: 'Painel Super Admin', sub: 'Visão global — todos os países e centros',
    sync: 'Atualizar Dados', syncing: 'Atualizando…',
    tabOverview: 'Resumo', tabUsers: 'Utilizadores', tabToggles: 'Funcionalidades', tabInsights: 'Análises',
    totalUsers: 'Total de Utilizadores', pendingApprovals: 'Aprovações Pendentes', approved: 'Aprovados', countries: 'Países',
    usersByCountry: 'Utilizadores por País', noUsers: 'Nenhum utilizador registado ainda.', active: 'ativo',
    userDir: 'Diretório de Utilizadores do Sistema', managePerms: 'Gerir permissões e estado de contas.',
    allStatuses: 'Todos os Estados', pendingOnly: 'Só Pendentes', approvedOnly: 'Só Aprovados', deniedOnly: 'Só Negados',
    searchPlaceholder: 'Pesquisar nome ou email...',
    userDetails: 'Detalhes do Utilizador', location: 'Localização', accessLevel: 'Nível de Acesso', status: 'Estado', management: 'Gestão',
    unassigned: 'Não Atribuído', unnamed: 'Utilizador Sem Nome',
    featureToggleTitle: 'Funcionalidades por Centro', featureToggleSub: 'Ativar ou desativar funcionalidades para centros específicos.',
    centre: 'Centro',
    confirmDelete: (email) => `Tem certeza de que deseja eliminar permanentemente o utilizador: ${email}? Isso não pode ser desfeito.`,
    cloudError: 'Não foi possível carregar dados do servidor — mostrando dados em cache.',
    insightsTitle: 'Análises Institucionais', insightsSub: 'Estatísticas de alunos, frequência e atividade docente.',
    totalStudents: 'Total de Alunos', avgAttendance: 'Frequência Média', atRisk: 'Em Risco', avgIntentions: 'Intenções Médias',
    studentStatusBreakdown: 'Distribuição do Estado dos Alunos', attendanceByClass: 'Frequência por Turma',
    teacherActivity: 'Atividade Docente (Sessões)', totalSessions: 'Total de Sessões', totalHours: 'Total de Horas',
    avgStudentsPerSession: 'Alunos Méd. / Sessão', totalAbsences: 'Ausências Registadas',
    noLogsYet: 'Nenhuma sessão registada ainda.', noStudentsYet: 'Nenhum dado de alunos disponível.',
    studentsLabel: 'alunos',
  },
};

function normalizeGSUser(u) {
  return {
    name: u.Name || u.name || '',
    email: (u.Email || u.email || '').toLowerCase().trim(),
    role: u.Role || u.role || 'Staff',
    country: u.Country || u.country || '',
    centre: u.Centre || u.centre || '',
    status: u.Status || u.status || 'Pending',
    password: u.Password || u.password || '',
    registeredAt: u.RegisteredAt || u.registeredAt || '',
  };
}

function mergeAccounts(gsUsers, localAccounts) {
  const map = new Map();
  localAccounts.forEach(u => { if (u.email) map.set(u.email.toLowerCase(), u); });
  gsUsers.forEach(u => {
    const norm = normalizeGSUser(u);
    if (norm.email) map.set(norm.email, norm);
  });
  return Array.from(map.values());
}

function InsightsTab({ t }) {
  const students = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('haazimi_students') || '[]');
    } catch { return []; }
  }, []);

  const logs = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('haazimi_display_logs') || '[]');
    } catch { return []; }
  }, []);

  const statusCounts = students.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1; return acc;
  }, {});

  const avgAttendance = students.length
    ? Math.round(students.reduce((s, st) => s + (Number(st.attendance) || 0), 0) / students.length)
    : 0;

  const atRiskCount = students.filter(s => s.status === 'At Risk').length;

  const avgIntentions = students.length
    ? (students.reduce((s, st) => {
        const mask = Number(st.intentions) || 0;
        return s + Array.from({ length: 8 }, (_, i) => !!(mask & (1 << i))).filter(Boolean).length;
      }, 0) / students.length).toFixed(1)
    : 0;

  const classBuckets = students.reduce((acc, s) => {
    const cls = s.className || 'Unknown';
    if (!acc[cls]) acc[cls] = { total: 0, att: 0 };
    acc[cls].total++;
    acc[cls].att += Number(s.attendance) || 0;
    return acc;
  }, {});

  const teachingLogs = logs.filter(l => ['Morning Class', 'Afternoon Class'].includes(l.activity));
  const totalHours = logs.reduce((s, l) => s + (Number(l.hours) || 0), 0);
  const totalAbsences = logs.reduce((s, l) => s + (Number(l.absentCount) || 0), 0);
  const avgStudents = teachingLogs.length
    ? (teachingLogs.reduce((s, l) => s + (Number(l.studentCount) || 0), 0) / teachingLogs.length).toFixed(1)
    : 0;

  const STATUS_COLOR = { 'On Track': '#22c55e', 'Excellent': '#6366f1', 'Needs Attention': '#f59e0b', 'At Risk': '#ef4444' };

  const statCard = (label, value, color, Icon) => (
    <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: '18px 20px', boxShadow: '0 2px 8px var(--shadow-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
      {Icon && <Icon size={28} style={{ color, flexShrink: 0 }} />}
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={18} /> {t.insightsTitle}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{t.insightsSub}</p>
      </div>

      {students.length === 0 ? (
        <div className="prompt-container">{t.noStudentsYet}</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
            {statCard(t.totalStudents, students.length, '#6366f1', Users)}
            {statCard(t.avgAttendance, `${avgAttendance}%`, avgAttendance >= 80 ? '#10b981' : '#f59e0b', BarChart2)}
            {statCard(t.atRisk, atRiskCount, atRiskCount > 0 ? '#ef4444' : '#10b981', AlertCircle)}
            {statCard(t.avgIntentions, `${avgIntentions}/8`, '#8b5cf6', BookOpen)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
            <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px var(--shadow-color)' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 600 }}>{t.studentStatusBreakdown}</h4>
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[status] || '#6b7280' }} />
                    <span style={{ fontSize: '0.85rem' }}>{status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(count / students.length) * 100}%`, height: '100%', background: STATUS_COLOR[status] || '#6b7280', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: 28 }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px var(--shadow-color)' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 600 }}>{t.attendanceByClass}</h4>
              {Object.entries(classBuckets).map(([cls, data]) => {
                const avg = Math.round(data.att / data.total);
                return (
                  <div key={cls} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{cls}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{data.total} {t.studentsLabel} · {avg}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${avg}%`, height: '100%', background: avg >= 80 ? '#10b981' : '#f59e0b', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px var(--shadow-color)' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={15} /> {t.teacherActivity}
            </h4>
            {logs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{t.noLogsYet}</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
                {[
                  { label: t.totalSessions, value: logs.length, color: '#6366f1' },
                  { label: t.totalHours, value: `${totalHours.toFixed(1)}h`, color: '#10b981' },
                  { label: t.avgStudentsPerSession, value: avgStudents, color: '#8b5cf6' },
                  { label: t.totalAbsences, value: totalAbsences, color: totalAbsences > 0 ? '#f59e0b' : '#10b981' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '14px 10px', background: 'var(--hover-bg)', borderRadius: 10 }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function SuperAdminDashboard({ user, language, onNavigate }) {
  const t = TL[language] || TL.en;
  const [accounts, setAccounts] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_accounts') || '[]'); } catch { return []; } });
  const [leaves, setLeaves] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_leaves') || '[]'); } catch { return []; } });
  const [toggles, setToggles] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_feature_toggles') || '{}'); } catch { return {}; } });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState('');

  const [editingEmail, setEditingEmail] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [customCentres] = useState(() => { try { return JSON.parse(localStorage.getItem('haazimi_custom_centres') || '{}'); } catch { return {}; } });

  const getCountryCentres = (country) => {
    const base = COUNTRY_CENTRES[country] || [];
    const custom = customCentres[country] || [];
    return [...new Set([...base, ...custom])];
  };

  const allCountries = Object.keys(COUNTRY_CENTRES);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setFetchError('');
    try {
      const gsUsers = await profilesApi.getAll();
      const localAccounts = (() => { try { return JSON.parse(localStorage.getItem('haazimi_accounts') || '[]'); } catch { return []; } })();
      const merged = mergeAccounts(gsUsers || [], localAccounts);
      setAccounts(merged);
      localStorage.setItem('haazimi_accounts', JSON.stringify(merged));
    } catch {
      setFetchError(t.cloudError);
    }
    if (showLoading) setLoading(false);
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateUser = async (email, updatedFields) => {
    setUpdatingEmail(email);
    const updated = accounts.map(u => u.email === email ? { ...u, ...updatedFields } : u);
    setAccounts(updated);
    localStorage.setItem('haazimi_accounts', JSON.stringify(updated));
    try { await profilesApi.updateByEmail(email, updatedFields); } catch {}
    setUpdatingEmail('');
    setEditingEmail(null);
  };

  const handleDelete = async (email) => {
    if (!window.confirm(t.confirmDelete(email))) return;
    setUpdatingEmail(email + '_del');
    try {
      await profilesApi.deleteByEmail(email);
      const updated = accounts.filter(u => u.email !== email);
      setAccounts(updated);
      localStorage.setItem('haazimi_accounts', JSON.stringify(updated));
    } catch (e) { console.error('Delete failed', e); }
    setUpdatingEmail('');
  };

  const byCountry = accounts.reduce((acc, u) => {
    const c = u.country || 'Unknown';
    if (!acc[c]) acc[c] = [];
    acc[c].push(u);
    return acc;
  }, {});

  const filteredAccounts = useMemo(() => {
    return accounts.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.country || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || (u.status || 'Pending') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchQuery, statusFilter]);

  const pendingUsers = accounts.filter(u => !u.status || u.status === 'Pending');
  const approvedUsers = accounts.filter(u => u.status === 'Approved');
  const allCentres = [...new Set(accounts.map(u => u.centre).filter(Boolean))];

  // --- Overview expand state ---
  const [expandedStudents, setExpandedStudents] = useState({});
  const [expandedMulaaqaats, setExpandedMulaaqaats] = useState({});
  const [expandedTeachers, setExpandedTeachers] = useState({});

  // --- Students by country/centre ---
  const studentsByCountry = useMemo(() => {
    try {
      const students = JSON.parse(localStorage.getItem('haazimi_students') || '[]');
      const map = {};
      students.forEach(s => {
        const c = (s.country || 'Unknown').trim();
        const ctr = (s.centre || 'Unknown').trim();
        if (!map[c]) map[c] = { total: 0, att: 0, centres: {} };
        map[c].total++;
        map[c].att += Number(s.attendance) || 0;
        if (!map[c].centres[ctr]) map[c].centres[ctr] = { total: 0, att: 0 };
        map[c].centres[ctr].total++;
        map[c].centres[ctr].att += Number(s.attendance) || 0;
      });
      return map;
    } catch { return {}; }
  }, []);

  // --- Mulaaqaats by country/centre ---
  const mulaaqaatsByCountry = useMemo(() => {
    try {
      const items = JSON.parse(localStorage.getItem('haazimi_mulaaqaats') || '[]');
      const map = {};
      items.forEach(v => {
        const c = (v.country || 'Untagged').trim();
        const ctr = (v.centre || 'Untagged').trim();
        if (!map[c]) map[c] = { total: 0, done: 0, centres: {} };
        map[c].total++;
        if (v.lastVisit && v.lastVisit !== '—') map[c].done++;
        if (!map[c].centres[ctr]) map[c].centres[ctr] = { total: 0, done: 0 };
        map[c].centres[ctr].total++;
        if (v.lastVisit && v.lastVisit !== '—') map[c].centres[ctr].done++;
      });
      return map;
    } catch { return {}; }
  }, []);

  // --- Teacher stats by country/centre ---
  const teacherStatsByCountry = useMemo(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('haazimi_display_logs') || '[]');
      const lvs = JSON.parse(localStorage.getItem('haazimi_leaves') || '[]');
      const emailMap = {};
      accounts.forEach(a => { if (a.email) emailMap[a.email.toLowerCase()] = a; });

      const td = {}; // email → { name, country, centre, hours, sessions, absences }
      logs.forEach(l => {
        const email = (l.teacherEmail || l.teacheremail || '').toLowerCase().trim();
        if (!email) return;
        const acct = emailMap[email];
        const country = (acct?.country || 'Unknown').trim();
        const centre = (acct?.centre || 'Unknown').trim();
        const name = l.teacherName || l.teachername || acct?.name || email;
        if (!td[email]) td[email] = { name, country, centre, hours: 0, sessions: 0, absences: 0 };
        td[email].hours += Number(l.hours) || 0;
        td[email].sessions++;
      });
      lvs.forEach(l => {
        const email = (l.teacherEmail || l.teacheremail || l['teacher email'] || '').toLowerCase().trim();
        if (!email) return;
        if (!td[email]) {
          const acct = emailMap[email];
          if (!acct) return;
          td[email] = { name: acct.name || email, country: (acct.country || 'Unknown').trim(), centre: (acct.centre || 'Unknown').trim(), hours: 0, sessions: 0, absences: 0 };
        }
        td[email].absences++;
      });

      const map = {};
      Object.values(td).forEach(t2 => {
        const c = t2.country;
        const ctr = t2.centre;
        if (!map[c]) map[c] = { teachers: [], centres: {} };
        map[c].teachers.push(t2);
        if (!map[c].centres[ctr]) map[c].centres[ctr] = [];
        map[c].centres[ctr].push(t2);
      });
      return map;
    } catch { return {}; }
  }, [accounts]);

  const getToggleForCentre = (centre, feature) => {
    if (!toggles[centre]) return true;
    return toggles[centre][feature] !== false;
  };

  const setToggle = (centre, feature, val) => {
    const updated = { ...toggles, [centre]: { ...(toggles[centre] || {}), [feature]: val } };
    setToggles(updated);
    localStorage.setItem('haazimi_feature_toggles', JSON.stringify(updated));
  };

  const tabs = [
    { id: 'overview', label: t.tabOverview },
    { id: 'users', label: `${t.tabUsers}${loading ? '' : ` (${accounts.length})`}` },
    { id: 'toggles', label: t.tabToggles },
  ];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={22} /> {t.title}</h2>
          <p>{t.sub}</p>
        </div>
        <button
          onClick={() => fetchData()}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.83rem', fontWeight: 500 }}
        >
          {loading ? <Loader size={14} className="spin" /> : <RefreshCw size={14} />}
          {loading ? t.syncing : t.sync}
        </button>
      </div>

      {fetchError && (
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '0.83rem', color: '#92400e' }}>
          {fetchError}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--card-bg)', borderRadius: 10, padding: 4, width: 'fit-content', boxShadow: '0 2px 8px var(--shadow-color)', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)', marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Globe size={16} /> {t.usersByCountry}</h3>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                <Loader size={14} className="spin" /> {t.syncing}
              </div>
            ) : Object.keys(byCountry).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{t.noUsers}</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {Object.entries(byCountry).map(([country, users]) => (
                  <div key={country} style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <MapPin size={13} style={{ color: 'var(--accent-color)' }} />
                      <strong style={{ fontSize: '0.88rem' }}>{country}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {users.length} user{users.length !== 1 ? 's' : ''} · {users.filter(u => u.status === 'Approved').length} {t.active}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Students Overview ── */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)', marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={16} /> Student Count &amp; Attendance by Country</h3>
            {Object.keys(studentsByCountry).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>No student data yet. Add students to see this breakdown.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(studentsByCountry).map(([country, data]) => {
                  const avgAtt = data.total > 0 ? Math.round(data.att / data.total) : 0;
                  const isOpen = !!expandedStudents[country];
                  return (
                    <div key={country} style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
                      <button
                        onClick={() => setExpandedStudents(p => ({ ...p, [country]: !p[country] }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <MapPin size={13} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                          <strong style={{ fontSize: '0.88rem' }}>{country}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 4 }}>{data.total} student{data.total !== 1 ? 's' : ''}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 60, height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${avgAtt}%`, height: '100%', background: avgAtt >= 80 ? '#10b981' : '#f59e0b', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: avgAtt >= 80 ? '#10b981' : '#f59e0b' }}>{avgAtt}%</span>
                          </div>
                          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px', background: 'var(--hover-bg)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {Object.entries(data.centres).map(([ctr, cdata]) => {
                            const cAvg = cdata.total > 0 ? Math.round(cdata.att / cdata.total) : 0;
                            return (
                              <div key={ctr} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.83rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>↳ {ctr}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontWeight: 600 }}>{cdata.total} student{cdata.total !== 1 ? 's' : ''}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 48, height: 5, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                                      <div style={{ width: `${cAvg}%`, height: '100%', background: cAvg >= 80 ? '#10b981' : '#f59e0b', borderRadius: 3 }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: cAvg >= 80 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{cAvg}%</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Mulaaqaats Overview ── */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)', marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><UserCheck size={16} /> Mulaaqaats by Country</h3>
            {Object.keys(mulaaqaatsByCountry).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>No mulaaqaat data yet. Visits added by staff will appear here grouped by country and centre.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(mulaaqaatsByCountry).map(([country, data]) => {
                  const isOpen = !!expandedMulaaqaats[country];
                  const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
                  return (
                    <div key={country} style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
                      <button
                        onClick={() => setExpandedMulaaqaats(p => ({ ...p, [country]: !p[country] }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <MapPin size={13} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                          <strong style={{ fontSize: '0.88rem' }}>{country}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 4 }}>{data.done}/{data.total} completed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 60, height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#8b5cf6', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8b5cf6' }}>{pct}%</span>
                          </div>
                          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px', background: 'var(--hover-bg)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {Object.entries(data.centres).map(([ctr, cdata]) => {
                            const cPct = cdata.total > 0 ? Math.round((cdata.done / cdata.total) * 100) : 0;
                            return (
                              <div key={ctr} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.83rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>↳ {ctr}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontWeight: 600 }}>{cdata.done}/{cdata.total}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 48, height: 5, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden' }}>
                                      <div style={{ width: `${cPct}%`, height: '100%', background: '#8b5cf6', borderRadius: 3 }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>{cPct}%</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Teacher Stats Overview ── */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)', marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={16} /> Teacher Activity by Country</h3>
            {Object.keys(teacherStatsByCountry).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>No teacher activity logged yet. Sessions logged by staff will appear here once synced.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(teacherStatsByCountry).map(([country, data]) => {
                  const isOpen = !!expandedTeachers[country];
                  const totalHrs = data.teachers.reduce((s, t2) => s + t2.hours, 0);
                  const totalSess = data.teachers.reduce((s, t2) => s + t2.sessions, 0);
                  const sorted = [...data.teachers].sort((a, b) => b.hours - a.hours);
                  const mostTime = sorted[0];
                  const leastTime = sorted[sorted.length - 1];
                  const sortedAbs = [...data.teachers].sort((a, b) => b.absences - a.absences);
                  const mostAbsent = sortedAbs[0];
                  const leastAbsent = sortedAbs[sortedAbs.length - 1];
                  return (
                    <div key={country} style={{ border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden' }}>
                      <button
                        onClick={() => setExpandedTeachers(p => ({ ...p, [country]: !p[country] }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <MapPin size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                          <strong style={{ fontSize: '0.88rem' }}>{country}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 4 }}>{data.teachers.length} teacher{data.teachers.length !== 1 ? 's' : ''} · {totalHrs.toFixed(1)}h · {totalSess} sessions</span>
                        </div>
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </button>
                      {isOpen && (
                        <div style={{ borderTop: '1px solid var(--border-color)', padding: '14px 16px', background: 'var(--hover-bg)' }}>
                          {/* Country-level highlights */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
                            {[
                              { label: 'Most Time Given', name: mostTime?.name, value: `${mostTime?.hours?.toFixed(1) || 0}h`, color: '#10b981' },
                              { label: 'Least Time Given', name: leastTime?.name, value: `${leastTime?.hours?.toFixed(1) || 0}h`, color: '#f59e0b' },
                              { label: 'Most Absences', name: mostAbsent?.name, value: `${mostAbsent?.absences || 0}`, color: '#ef4444' },
                              { label: 'Least Absences', name: leastAbsent?.name, value: `${leastAbsent?.absences || 0}`, color: '#6366f1' },
                            ].map((item, i) => (
                              <div key={i} style={{ background: 'var(--card-bg)', borderRadius: 8, padding: '10px 12px', border: `1px solid ${item.color}22` }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: item.color }}>{item.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: 2 }}>{item.name}</div>
                              </div>
                            ))}
                          </div>
                          {/* Per-centre breakdown */}
                          {Object.entries(data.centres).map(([ctr, teachers]) => {
                            const cSorted = [...teachers].sort((a, b) => b.hours - a.hours);
                            const cAbsSorted = [...teachers].sort((a, b) => b.absences - a.absences);
                            const cHrs = teachers.reduce((s, t2) => s + t2.hours, 0);
                            return (
                              <div key={ctr} style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border-color)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>↳ {ctr} — {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} · {cHrs.toFixed(1)}h</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                  {cSorted.map((t2, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '5px 0', borderBottom: '1px solid var(--border-color)' }}>
                                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t2.name}</span>
                                      <div style={{ display: 'flex', gap: 14 }}>
                                        <span style={{ color: '#10b981' }}>{t2.hours.toFixed(1)}h</span>
                                        <span style={{ color: '#6366f1' }}>{t2.sessions} sess.</span>
                                        <span style={{ color: t2.absences > 0 ? '#ef4444' : 'var(--text-secondary)' }}>{t2.absences} abs.</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <InsightsTab t={t} />
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>{t.userDir}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0' }}>{t.managePerms}</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Filter size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px 8px 30px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', appearance: 'none', cursor: 'pointer' }}>
                  <option value="All">{t.allStatuses}</option>
                  <option value="Pending">{t.pendingOnly}</option>
                  <option value="Approved">{t.approvedOnly}</option>
                  <option value="Denied">{t.deniedOnly}</option>
                </select>
              </div>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="staff-table">
              <thead>
                <tr>
                  <th>{t.userDetails}</th>
                  <th>{t.location}</th>
                  <th>{t.accessLevel}</th>
                  <th>{t.status}</th>
                  <th style={{ textAlign: 'right' }}>{t.management}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc, i) => {
                  const isBusy = updatingEmail.startsWith(acc.email);
                  const isEditing = editingEmail === acc.email;
                  return (
                    <tr key={i} style={{ opacity: isBusy ? 0.6 : 1 }}>
                      <td>
                        {isEditing ? (
                          <input style={{ fontSize: '0.85rem', padding: '4px', width: '100%' }} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        ) : (
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name || t.unnamed}</div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{acc.email}</div>
                      </td>
                      <td>
                        {isEditing ? (
                          <>
                            <select
                              style={{ fontSize: '0.75rem', padding: '2px', width: '100%', marginBottom: '4px', borderRadius: 4, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                              value={editForm.country}
                              onChange={e => setEditForm({ ...editForm, country: e.target.value, centre: getCountryCentres(e.target.value)[0] || '' })}
                            >
                              <option value="">— Select Country —</option>
                              {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {(() => {
                              const baseCentres = getCountryCentres(editForm.country);
                              const centreOptions = baseCentres.includes(editForm.centre) || !editForm.centre
                                ? baseCentres
                                : [editForm.centre, ...baseCentres];
                              return centreOptions.length > 0 ? (
                                <select
                                  style={{ fontSize: '0.75rem', padding: '2px', width: '100%', borderRadius: 4, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                                  value={editForm.centre}
                                  onChange={e => setEditForm({ ...editForm, centre: e.target.value })}
                                >
                                  {centreOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              ) : (
                                <input placeholder="Centre" style={{ fontSize: '0.75rem', padding: '2px', width: '100%' }} value={editForm.centre} onChange={e => setEditForm({ ...editForm, centre: e.target.value })} />
                              );
                            })()}
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.85rem' }}>{acc.country || '—'}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{acc.centre || t.unassigned}</div>
                          </>
                        )}
                      </td>
                      <td>
                        <select value={isEditing ? editForm.role : (acc.role || 'Staff')} onChange={e => isEditing ? setEditForm({ ...editForm, role: e.target.value }) : handleUpdateUser(acc.email, { role: e.target.value })}
                          style={{ fontSize: '0.78rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td>
                        {isEditing ? (
                          <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} style={{ fontSize: '0.78rem', padding: '4px' }}>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`status-badge status-${(acc.status || 'pending').toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                            {acc.status || 'Pending'}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                          {isEditing ? (
                            <>
                              <button onClick={() => handleUpdateUser(acc.email, editForm)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }} title="Save"><Check size={18} /></button>
                              <button onClick={() => setEditingEmail(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Cancel"><X size={18} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingEmail(acc.email); setEditForm({ ...acc }); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Edit"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(acc.email)} disabled={isBusy} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'toggles' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px var(--shadow-color)' }}>
          <h3 style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}><ToggleRight size={18} /> {t.featureToggleTitle}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: 20 }}>{t.featureToggleSub}</p>
          <div style={{ overflowX: 'auto' }}>
            <table className="staff-table">
              <thead>
                <tr>
                  <th>{t.centre}</th>
                  {FEATURE_KEYS.map(f => <th key={f} style={{ textAlign: 'center', fontSize: '0.75rem' }}>{FEATURE_LABELS[f]}</th>)}
                </tr>
              </thead>
              <tbody>
                {allCentres.map(centre => (
                  <tr key={centre}>
                    <td style={{ fontWeight: 500 }}>{centre}</td>
                    {FEATURE_KEYS.map(f => {
                      const on = getToggleForCentre(centre, f);
                      return (
                        <td key={f} style={{ textAlign: 'center' }}>
                          <button onClick={() => setToggle(centre, f, !on)} style={{ background: on ? '#dcfce7' : '#fee2e2', border: 'none', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600, color: on ? '#16a34a' : '#dc2626', cursor: 'pointer' }}>
                            {on ? 'ON' : 'OFF'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
