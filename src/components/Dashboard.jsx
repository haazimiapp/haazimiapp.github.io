import { useState, useEffect } from 'react';
import {
  Users, CheckCircle, AlertTriangle, FileText, Clock,
  BookOpen, TrendingUp, Send, Plus, CalendarOff, ChevronDown, ChevronUp, Shield
} from 'lucide-react';
import { STAFF, LEAVE_REQUESTS, RED_FLAGS, TIME_LOGS, BUDGET_ITEMS } from '../data/mockData';

const DASH_T = {
  en: {
    greeting: 'Assalamu Alaikum',
    managerTitle: 'Manager Dashboard',
    managerSub: "Overview of your institution's performance",
    adminTitle: 'Admin Dashboard',
    adminSub: 'Full institution overview',
    totalStaff: 'Total Staff',
    activeToday: 'Active Today',
    redFlags: 'Red Flags',
    pendingLeaves: 'Pending Leaves',
    hrsLogged: 'Hrs Logged (Month)',
    activeClasses: 'Active Classes',
    totalStudents: 'Total Students',
    avgAttendance: 'Avg Attendance',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    logTime: 'Log Time',
    addStaff: 'Add Staff',
    reviewLeaves: 'Review Leaves',
    viewFlags: 'View Flags',
    commandCentre: 'Command Centre',
    hoursMonth: 'Hours This Month',
    myClasses: 'My Classes',
    myStudents: 'My Students',
    recentLogs: 'Recent Time Logs',
    aiTitle: 'AI Assistant',
    aiSub: 'Ask anything about your classes, students, or schedule.',
    aiPlaceholder: 'e.g. How are my students performing this month?',
    ask: 'Ask',
    aiDefault: 'Your response will appear here...',
    requestLeave: 'Request Leave',
    requestFor: 'Request for',
    self: 'Self',
    leaveType: 'Leave Type',
    from: 'From',
    to: 'To',
    duration: 'Duration',
    reason: 'Reason',
    cancel: 'Cancel',
    submit: 'Submit Request',
    submitted: 'Leave request submitted!',
    pendingApproval: 'Your request is pending approval',
    submitSub: 'Submit a leave request',
    pendingRequests: 'Pending Requests',
    noPending: 'No pending requests.',
  },
  ar: {
    greeting: 'السلام عليكم',
    managerTitle: 'لوحة المدير',
    managerSub: 'نظرة عامة على أداء مؤسستك',
    adminTitle: 'لوحة المسؤول',
    adminSub: 'نظرة شاملة للمؤسسة',
    totalStaff: 'إجمالي الموظفين',
    activeToday: 'النشطون اليوم',
    redFlags: 'التنبيهات',
    pendingLeaves: 'الإجازات المعلقة',
    hrsLogged: 'ساعات مسجلة (الشهر)',
    activeClasses: 'الفصول النشطة',
    totalStudents: 'إجمالي الطلاب',
    avgAttendance: 'متوسط الحضور',
    quickActions: 'إجراءات سريعة',
    recentActivity: 'النشاط الأخير',
    logTime: 'تسجيل الوقت',
    addStaff: 'إضافة موظف',
    reviewLeaves: 'مراجعة الإجازات',
    viewFlags: 'عرض التنبيهات',
    commandCentre: 'مركز القيادة',
    hoursMonth: 'ساعات هذا الشهر',
    myClasses: 'فصولي',
    myStudents: 'طلابي',
    recentLogs: 'سجلات الوقت الأخيرة',
    aiTitle: 'المساعد الذكي',
    aiSub: 'اسأل عن فصولك أو طلابك أو جدولك.',
    aiPlaceholder: 'مثال: كيف أداء طلابي هذا الشهر؟',
    ask: 'اسأل',
    aiDefault: 'ستظهر إجابتك هنا...',
    requestLeave: 'طلب إجازة',
    requestFor: 'طلب لـ',
    self: 'نفسي',
    leaveType: 'نوع الإجازة',
    from: 'من',
    to: 'إلى',
    duration: 'المدة',
    reason: 'السبب',
    cancel: 'إلغاء',
    submit: 'إرسال الطلب',
    submitted: 'تم إرسال طلب الإجازة!',
    pendingApproval: 'طلبك في انتظار الموافقة',
    submitSub: 'تقديم طلب إجازة',
    pendingRequests: 'الطلبات المعلقة',
    noPending: 'لا توجد طلبات معلقة.',
  },
  ur: {
    greeting: 'السلام علیکم',
    managerTitle: 'مینیجر ڈیش بورڈ',
    managerSub: 'آپ کے ادارے کی کارکردگی کا جائزہ',
    adminTitle: 'ایڈمن ڈیش بورڈ',
    adminSub: 'مکمل ادارہ جاتی جائزہ',
    totalStaff: 'کل عملہ',
    activeToday: 'آج فعال',
    redFlags: 'ریڈ فلیگز',
    pendingLeaves: 'زیر التواء چھٹیاں',
    hrsLogged: 'گھنٹے (ماہ)',
    activeClasses: 'فعال کلاسیں',
    totalStudents: 'کل طلبہ',
    avgAttendance: 'اوسط حاضری',
    quickActions: 'فوری اقدامات',
    recentActivity: 'حالیہ سرگرمی',
    logTime: 'وقت ریکارڈ کریں',
    addStaff: 'عملہ شامل کریں',
    reviewLeaves: 'چھٹیاں دیکھیں',
    viewFlags: 'فلیگز دیکھیں',
    commandCentre: 'کمانڈ سینٹر',
    hoursMonth: 'اس ماہ گھنٹے',
    myClasses: 'میری کلاسیں',
    myStudents: 'میرے طلبہ',
    recentLogs: 'حالیہ وقت کے ریکارڈ',
    aiTitle: 'AI اسسٹنٹ',
    aiSub: 'اپنی کلاسوں، طلبہ یا شیڈول کے بارے میں پوچھیں۔',
    aiPlaceholder: 'مثال: اس ماہ میرے طلبہ کیسا کر رہے ہیں؟',
    ask: 'پوچھیں',
    aiDefault: 'آپ کا جواب یہاں ظاہر ہوگا...',
    requestLeave: 'چھٹی کی درخواست',
    requestFor: 'کس کے لیے',
    self: 'خود',
    leaveType: 'چھٹی کی قسم',
    from: 'سے',
    to: 'تک',
    duration: 'مدت',
    reason: 'وجہ',
    cancel: 'منسوخ',
    submit: 'درخواست جمع کریں',
    submitted: 'چھٹی کی درخواست جمع ہو گئی!',
    pendingApproval: 'آپ کی درخواست منظوری کے انتظار میں ہے',
    submitSub: 'چھٹی کی درخواست جمع کریں',
    pendingRequests: 'زیر التواء درخواستیں',
    noPending: 'کوئی زیر التواء درخواست نہیں۔',
  },
  es: {
    greeting: 'Asalamu Alaikum',
    managerTitle: 'Panel del Gerente',
    managerSub: 'Resumen del rendimiento de tu institución',
    adminTitle: 'Panel de Administración',
    adminSub: 'Resumen completo de la institución',
    totalStaff: 'Personal Total',
    activeToday: 'Activos Hoy',
    redFlags: 'Alertas',
    pendingLeaves: 'Licencias Pendientes',
    hrsLogged: 'Horas Registradas (Mes)',
    activeClasses: 'Clases Activas',
    totalStudents: 'Total Estudiantes',
    avgAttendance: 'Asistencia Promedio',
    quickActions: 'Acciones Rápidas',
    recentActivity: 'Actividad Reciente',
    logTime: 'Registrar Tiempo',
    addStaff: 'Agregar Personal',
    reviewLeaves: 'Revisar Licencias',
    viewFlags: 'Ver Alertas',
    commandCentre: 'Centro de Comando',
    hoursMonth: 'Horas Este Mes',
    myClasses: 'Mis Clases',
    myStudents: 'Mis Estudiantes',
    recentLogs: 'Registros Recientes',
    aiTitle: 'Asistente IA',
    aiSub: 'Pregunta sobre tus clases, estudiantes o horario.',
    aiPlaceholder: '¿Cómo están mis estudiantes este mes?',
    ask: 'Preguntar',
    aiDefault: 'Tu respuesta aparecerá aquí...',
    requestLeave: 'Solicitar Licencia',
    requestFor: 'Solicitar para',
    self: 'Yo mismo',
    leaveType: 'Tipo de Licencia',
    from: 'Desde',
    to: 'Hasta',
    duration: 'Duración',
    reason: 'Razón',
    cancel: 'Cancelar',
    submit: 'Enviar Solicitud',
    submitted: '¡Solicitud enviada!',
    pendingApproval: 'Tu solicitud está pendiente de aprobación',
    submitSub: 'Enviar una solicitud de licencia',
    pendingRequests: 'Solicitudes Pendientes',
    noPending: 'No hay solicitudes pendientes.',
  },
  pt: {
    greeting: 'Asalamu Alaikum',
    managerTitle: 'Painel do Gerente',
    managerSub: 'Visão geral do desempenho da sua instituição',
    adminTitle: 'Painel de Administração',
    adminSub: 'Visão geral completa da instituição',
    totalStaff: 'Total de Funcionários',
    activeToday: 'Ativos Hoje',
    redFlags: 'Alertas',
    pendingLeaves: 'Licenças Pendentes',
    hrsLogged: 'Horas Registradas (Mês)',
    activeClasses: 'Turmas Ativas',
    totalStudents: 'Total de Alunos',
    avgAttendance: 'Freq. Média',
    quickActions: 'Ações Rápidas',
    recentActivity: 'Atividade Recente',
    logTime: 'Registrar Tempo',
    addStaff: 'Adicionar Funcionário',
    reviewLeaves: 'Revisar Licenças',
    viewFlags: 'Ver Alertas',
    commandCentre: 'Centro de Comando',
    hoursMonth: 'Horas Neste Mês',
    myClasses: 'Minhas Turmas',
    myStudents: 'Meus Alunos',
    recentLogs: 'Registros Recentes',
    aiTitle: 'Assistente IA',
    aiSub: 'Pergunte sobre suas turmas, alunos ou horário.',
    aiPlaceholder: 'Como estão meus alunos este mês?',
    ask: 'Perguntar',
    aiDefault: 'Sua resposta aparecerá aqui...',
    requestLeave: 'Solicitar Licença',
    requestFor: 'Solicitar para',
    self: 'Eu mesmo',
    leaveType: 'Tipo de Licença',
    from: 'De',
    to: 'Até',
    duration: 'Duração',
    reason: 'Motivo',
    cancel: 'Cancelar',
    submit: 'Enviar Solicitação',
    submitted: 'Solicitação enviada!',
    pendingApproval: 'Sua solicitação está pendente de aprovação',
    submitSub: 'Enviar uma solicitação de licença',
    pendingRequests: 'Solicitações Pendentes',
    noPending: 'Nenhuma solicitação pendente.',
  },
};

function InfoCard({ icon: Icon, iconClass, value, label, onClick }) {
  return (
    <div className={`info-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className={`icon ${iconClass}`}><Icon /></div>
      <div className="details">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
}

function LogTimeButton({ onNavigate, t }) {
  return (
    <div className="log-time-hero" onClick={() => onNavigate('logtime')}>
      <div className="log-time-hero-icon"><Clock size={28} /></div>
      <div className="log-time-hero-text">
        <strong>{t.logTime}</strong>
        <span>Tap to record your time</span>
      </div>
      <div className="log-time-hero-arrow"><Plus size={22} /></div>
    </div>
  );
}

const LEAVE_TYPES = ['Medical', 'Casual', 'Annual', 'Emergency', 'Personal'];

function QuickLeaveRequest({ userName, staffNames, t }) {
  const today = new Date().toISOString().split('T')[0];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Casual', from: today, to: today, reason: '', requestFor: 'self' });
  const [pendingList, setPendingList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_quick_leaves') || '[]'); } catch { return []; }
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / 86400000;
    return Math.max(0, diff + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      type: form.type,
      from: form.from,
      to: form.to,
      days: calcDays(),
      reason: form.reason,
      requestFor: form.requestFor === 'self' ? (userName || 'Self') : form.requestFor,
      status: 'Pending',
      submittedAt: new Date().toLocaleDateString(),
    };
    const updated = [entry, ...pendingList];
    setPendingList(updated);
    localStorage.setItem('haazimi_quick_leaves', JSON.stringify(updated));
    setOpen(false);
    setForm({ type: 'Casual', from: today, to: today, reason: '', requestFor: 'self' });
  };

  return (
    <div className="quick-leave-panel">
      <button
        className={`quick-leave-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        <div className="quick-leave-toggle-left">
          <CalendarOff size={22} />
          <div>
            <strong>{t.requestLeave}</strong>
            <span>{t.submitSub}</span>
          </div>
        </div>
        <div className="quick-leave-toggle-arrow">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {open && (
        <div className="quick-leave-form">
          <form onSubmit={handleSubmit}>
            <div className="quick-leave-grid">
              <div className="form-group">
                <label>{t.requestFor}</label>
                <select value={form.requestFor} onChange={e => set('requestFor', e.target.value)}>
                  <option value="self">{t.self}</option>
                  {(staffNames || []).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t.leaveType}</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  {LEAVE_TYPES.map(lt => <option key={lt}>{lt}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t.from}</label>
                <input type="date" value={form.from} min={today} onChange={e => set('from', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>{t.to}</label>
                <input type="date" value={form.to} min={form.from} onChange={e => set('to', e.target.value)} required />
              </div>
              <div className="form-group quick-leave-days">
                <label>{t.duration}</label>
                <div className="duration-display">{calcDays()} day{calcDays() !== 1 ? 's' : ''}</div>
              </div>
              <div className="form-group quick-leave-reason">
                <label>{t.reason} <span style={{ color: '#e74c3c' }}>*</span></label>
                <textarea
                  rows={2}
                  placeholder="Brief reason..."
                  value={form.reason}
                  onChange={e => set('reason', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="quick-leave-actions">
              <button type="button" className="button-secondary" onClick={() => setOpen(false)}>{t.cancel}</button>
              <button type="submit" className="button-primary">{t.submit}</button>
            </div>
          </form>
        </div>
      )}

      {/* Persistent pending list */}
      {pendingList.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '12px 16px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.pendingRequests}</div>
          {pendingList.map(req => (
            <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontWeight: 500 }}>{req.type}</span>
                <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>{req.from} → {req.to}</span>
                {req.requestFor && req.requestFor !== 'Self' && (
                  <span style={{ color: 'var(--primary-color)', marginLeft: 8, fontSize: '0.78rem' }}>({req.requestFor})</span>
                )}
              </div>
              <span style={{ background: '#fff3cd', color: '#856404', borderRadius: 4, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>{req.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ManagerDashboard({ user, onNavigate, language }) {
  const t = DASH_T[language] || DASH_T.en;
  const isAdmin = user.role === 'Admin';

  const totalStaff = STAFF.length;
  const activeToday = STAFF.filter(s => s.status === 'Active').length;
  const redFlags = RED_FLAGS.length;
  const pendingLeaves = LEAVE_REQUESTS.filter(l => l.status === 'pending').length;
  const staffNames = STAFF.map(s => s.name);

  const totalBudgeted = BUDGET_ITEMS.reduce((s, b) => s + b.budgeted, 0);
  const totalSpent = BUDGET_ITEMS.reduce((s, b) => s + b.spent, 0);
  const budgetVariance = totalBudgeted - totalSpent;

  const recentActivity = [
    { name: 'Usman Tariq', action: 'Submitted leave request', time: '2h ago', status: 'in-progress' },
    { name: 'Fatima Malik', action: 'Submitted leave request', time: '4h ago', status: 'in-progress' },
    { name: 'Ahmad Ali', action: 'Leave approved', time: 'Yesterday', status: 'completed' },
    { name: 'Ibrahim Shah', action: 'Leave rejected', time: 'Yesterday', status: 'incomplete' },
    { name: 'Bilal Hassan', action: 'Logged 6 hours', time: '2 days ago', status: 'completed' },
  ];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{isAdmin ? t.adminTitle : t.managerTitle}</h2>
          <p>{isAdmin ? t.adminSub : t.managerSub}</p>
        </div>
      </div>

      <div className="dashboard-hero-row">
        <LogTimeButton onNavigate={onNavigate} t={t} />
        <QuickLeaveRequest userName={user.name} staffNames={staffNames} t={t} />
      </div>

      <div className="dashboard-grid dashboard-grid--manager">
        <InfoCard icon={Users} iconClass="total-staff" value={totalStaff} label={t.totalStaff} onClick={() => onNavigate('staff')} />
        <InfoCard icon={CheckCircle} iconClass="active-today" value={activeToday} label={t.activeToday} />
        <InfoCard icon={AlertTriangle} iconClass="red-flags" value={redFlags} label={t.redFlags} onClick={() => onNavigate('redflags')} />
        <InfoCard icon={FileText} iconClass="pending-leaves" value={pendingLeaves} label={t.pendingLeaves} onClick={() => onNavigate('pendingleaves')} />
        <InfoCard icon={Clock} iconClass="hours" value="172h" label={t.hrsLogged} onClick={() => onNavigate('logtime')} />
        <InfoCard icon={BookOpen} iconClass="classes" value="3" label={t.activeClasses} onClick={() => onNavigate('classes')} />
        <InfoCard icon={Users} iconClass="students" value="9" label={t.totalStudents} />
        <InfoCard icon={TrendingUp} iconClass="efficiency" value="87%" label={t.avgAttendance} />
      </div>

      <div className="dashboard-lower-grid">
        <div className="dashboard-section">
          <h3>{t.quickActions}</h3>
          <div className="quick-actions-buttons">
            <button className="quick-action-button" onClick={() => onNavigate('logtime')}>
              <Clock size={20} /> {t.logTime}
            </button>
            <button className="quick-action-button" onClick={() => onNavigate('staff')}>
              <Users size={20} /> {t.addStaff}
            </button>
            <button className="quick-action-button" onClick={() => onNavigate('pendingleaves')}>
              <FileText size={20} /> {t.reviewLeaves}
            </button>
            <button className="quick-action-button" onClick={() => onNavigate('redflags')}>
              <AlertTriangle size={20} /> {t.viewFlags}
            </button>
            {isAdmin && (
              <button className="quick-action-button" onClick={() => onNavigate('admin')}>
                <Shield size={20} /> {t.commandCentre}
              </button>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="dashboard-section">
            <h3>Bird's Eye View</h3>
            <ul className="activity-list">
              <li className="activity-item">
                <div className="activity-details"><strong>Total Students</strong><span>Across all centres</span></div>
                <div className="activity-time"><span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>9</span></div>
              </li>
              <li className="activity-item">
                <div className="activity-details"><strong>Active Red Flags</strong><span>Requires attention</span></div>
                <div className="activity-time"><span style={{ fontWeight: 700, color: '#e74c3c' }}>{redFlags}</span></div>
              </li>
              <li className="activity-item">
                <div className="activity-details"><strong>Budget vs. Actual</strong><span>Monthly variance</span></div>
                <div className="activity-time">
                  <span style={{ fontWeight: 700, color: budgetVariance >= 0 ? '#22c55e' : '#e74c3c' }}>
                    {budgetVariance >= 0 ? '+' : ''}{budgetVariance.toLocaleString()}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        )}

        <div className="dashboard-section">
          <h3>{t.recentActivity}</h3>
          <ul className="activity-list">
            {recentActivity.map((item, i) => (
              <li key={i} className="activity-item">
                <div className="activity-details">
                  <strong>{item.name}</strong>
                  <span>{item.action}</span>
                </div>
                <div className="activity-time">
                  <span>{item.time}</span>
                  <span className={`status-badge status-${item.status}`}>{item.status.replace('-', ' ')}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StaffDashboard({ user, onNavigate, language }) {
  const t = DASH_T[language] || DASH_T.en;
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const today = new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const myLogs = TIME_LOGS.slice(0, 3);
  const totalHours = TIME_LOGS.reduce((s, l) => s + l.hours, 0);

  const handleAsk = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    await new Promise(r => setTimeout(r, 1200));
    setAiResponse(`Based on your records, you have logged ${totalHours} hours this month across ${TIME_LOGS.length} sessions. Your class attendance average is 88%. You have 3 students that need attention. Keep up the great work!`);
    setAiLoading(false);
  };

  return (
    <div className="dhimmedaar-home-layout">
      <div className="view-header">
        <div>
          <h2>{t.greeting}, {user.name.split(' ')[0]}</h2>
          <p>{today}</p>
        </div>
      </div>

      <div className="dashboard-hero-row">
        <LogTimeButton onNavigate={onNavigate} t={t} />
        <QuickLeaveRequest userName={user.name} staffNames={[]} t={t} />
      </div>

      <div className="dashboard-grid">
        <InfoCard icon={Clock} iconClass="hours" value={`${totalHours}h`} label={t.hoursMonth} onClick={() => onNavigate('logtime')} />
        <InfoCard icon={BookOpen} iconClass="classes" value="3" label={t.myClasses} onClick={() => onNavigate('classes')} />
        <InfoCard icon={Users} iconClass="students" value="9" label={t.myStudents} />
        <InfoCard icon={CheckCircle} iconClass="active-today" value="88%" label={t.avgAttendance} />
      </div>

      <div className="dashboard-section ai-assistant-section">
        <h3>{t.aiTitle}</h3>
        <p className="ai-assistant-description">{t.aiSub}</p>
        <div className="ai-input-area" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input
            type="text"
            placeholder={t.aiPlaceholder}
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            style={{ flex: '1 1 200px', minWidth: 0 }}
          />
          <button className="button-primary icon-button" onClick={handleAsk} disabled={aiLoading} style={{ flexShrink: 0 }}>
            <Send size={16} /> {t.ask}
          </button>
        </div>
        <div className="ai-response-area">
          {aiLoading ? (
            <div className="loading-spinner" />
          ) : aiResponse ? (
            <p>{aiResponse}</p>
          ) : (
            <p style={{ color: 'var(--subtle-text-color)', fontStyle: 'italic' }}>{t.aiDefault}</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>{t.recentLogs}</h3>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="staff-table" style={{ minWidth: 520 }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 8px' }}>Date</th>
                <th style={{ padding: '10px 8px' }}>In</th>
                <th style={{ padding: '10px 8px' }}>Out</th>
                <th style={{ padding: '10px 8px' }}>Hrs</th>
                <th style={{ padding: '10px 8px' }}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {myLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>{log.date}</td>
                  <td style={{ padding: '10px 8px' }}>{log.checkIn}</td>
                  <td style={{ padding: '10px 8px' }}>{log.checkOut}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{log.hours}h</td>
                  <td style={{ padding: '10px 8px' }}>{log.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onNavigate, language }) {
  const role = user.role;
  if (role === 'manager' || role === 'Manager' || role === 'Admin') {
    return <ManagerDashboard user={user} onNavigate={onNavigate} language={language} />;
  }
  return <StaffDashboard user={user} onNavigate={onNavigate} language={language} />;
}
