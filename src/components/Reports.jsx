import { useMemo } from 'react';
import { Users, Clock, CheckSquare, TrendingUp } from 'lucide-react';

const T = {
  en: {
    title: 'Reports', sub: 'Insights and analytics for your institution',
    staffStatus: 'Staff Status', staffByCenter: 'Staff by Centre',
    classAttendance: 'Class Attendance (%)', monthlyHours: 'Monthly Hours Logged',
    leaveSummary: 'Leave Summary', activityBreakdown: 'Activity Breakdown',
    sessionsMonth: 'Sessions This Month', hoursMonth: 'Hours This Month',
    active: 'Active', onLeave: 'On Leave', inactive: 'Inactive',
    totalStaff: 'Total Staff',
    name: 'Name', total: 'Total', used: 'Used', left: 'Left', status: 'Status',
    overLimit: 'Over', nearLimit: 'Near', good: 'Good',
    noSessions: 'No sessions logged yet.',
  },
  ar: {
    title: 'التقارير', sub: 'رؤى وتحليلات لمؤسستك',
    staffStatus: 'حالة الموظفين', staffByCenter: 'الموظفون حسب المركز',
    classAttendance: 'حضور الفصل (%)', monthlyHours: 'الساعات الشهرية',
    leaveSummary: 'ملخص الإجازات', activityBreakdown: 'توزيع الأنشطة',
    sessionsMonth: 'جلسات هذا الشهر', hoursMonth: 'ساعات هذا الشهر',
    active: 'نشط', onLeave: 'إجازة', inactive: 'غير نشط',
    totalStaff: 'إجمالي الموظفين',
    name: 'الاسم', total: 'الإجمالي', used: 'المستخدم', left: 'المتبقي', status: 'الحالة',
    overLimit: 'تجاوز', nearLimit: 'قريب', good: 'جيد',
    noSessions: 'لم يتم تسجيل أي جلسات بعد.',
  },
  ur: {
    title: 'رپورٹس', sub: 'آپ کے ادارے کے لیے بصیرت اور تجزیات',
    staffStatus: 'عملے کی حالت', staffByCenter: 'مرکز کے مطابق عملہ',
    classAttendance: 'کلاس حاضری (%)', monthlyHours: 'ماہانہ ریکارڈ شدہ گھنٹے',
    leaveSummary: 'چھٹیوں کا خلاصہ', activityBreakdown: 'سرگرمی خلاصہ',
    sessionsMonth: 'اس ماہ کے سیشن', hoursMonth: 'اس ماہ کے گھنٹے',
    active: 'فعال', onLeave: 'چھٹی', inactive: 'غیر فعال',
    totalStaff: 'کل عملہ',
    name: 'نام', total: 'کل', used: 'استعمال', left: 'باقی', status: 'حالت',
    overLimit: 'زیادہ', nearLimit: 'قریب', good: 'ٹھیک',
    noSessions: 'ابھی کوئی سیشن لاگ نہیں کیا گیا۔',
  },
  es: {
    title: 'Informes', sub: 'Perspectivas y análisis para tu institución',
    staffStatus: 'Estado del Personal', staffByCenter: 'Personal por Centro',
    classAttendance: 'Asistencia a Clase (%)', monthlyHours: 'Horas Mensuales',
    leaveSummary: 'Resumen de Licencias', activityBreakdown: 'Desglose de Actividad',
    sessionsMonth: 'Sesiones Este Mes', hoursMonth: 'Horas Este Mes',
    active: 'Activo', onLeave: 'Licencia', inactive: 'Inactivo',
    totalStaff: 'Total Personal',
    name: 'Nombre', total: 'Total', used: 'Usadas', left: 'Restantes', status: 'Estado',
    overLimit: 'Excede', nearLimit: 'Cerca', good: 'Bien',
    noSessions: 'Aún no se han registrado sesiones.',
  },
  pt: {
    title: 'Relatórios', sub: 'Perspectivas e análises para sua instituição',
    staffStatus: 'Estado do Pessoal', staffByCenter: 'Pessoal por Centro',
    classAttendance: 'Frequência da Turma (%)', monthlyHours: 'Horas Mensais',
    leaveSummary: 'Resumo de Licenças', activityBreakdown: 'Distribuição de Atividade',
    sessionsMonth: 'Sessões Este Mês', hoursMonth: 'Horas Este Mês',
    active: 'Ativo', onLeave: 'Licença', inactive: 'Inativo',
    totalStaff: 'Total Pessoal',
    name: 'Nome', total: 'Total', used: 'Usadas', left: 'Restantes', status: 'Estado',
    overLimit: 'Excede', nearLimit: 'Perto', good: 'Bom',
    noSessions: 'Nenhuma sessão registada ainda.',
  },
};

function HBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 28%) 1fr auto', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ background: 'var(--hover-bg)', borderRadius: 6, height: 26, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color || 'var(--accent-color)', borderRadius: 6, minWidth: value > 0 ? 4 : 0, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 28, textAlign: 'right' }}>{value}</div>
    </div>
  );
}

function VBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ width: '100%', background: 'var(--hover-bg)', borderRadius: 6, height: 80, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: `${pct}%`, background: color || 'var(--accent-color)', borderRadius: '4px 4px 0 0', minHeight: value > 0 ? 4 : 0, transition: 'height 0.4s ease' }} />
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</div>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const gradient = data.map(d => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return `${d.color} ${start}deg ${end}deg`;
  }).join(', ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ width: 110, height: 110, borderRadius: '50%', background: total > 0 ? `conic-gradient(${gradient})` : 'var(--hover-bg)', flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>{d.label}:</span>
            <strong>{d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: '16px 18px', boxShadow: '0 2px 8px var(--shadow-color)', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Widget({ title, children, fullWidth }) {
  return (
    <div style={{
      background: 'var(--card-bg)', borderRadius: 12, padding: '20px',
      boxShadow: '0 2px 8px var(--shadow-color)',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function Reports({ language }) {
  const t = T[language] || T.en;

  const accounts = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_accounts') || '[]'); } catch { return []; }
  }, []);

  const activeStaff = accounts.filter(s => (s.status || s.Status || '').toLowerCase() === 'active').length;
  const onLeave = accounts.filter(s => (s.status || s.Status || '').toLowerCase() === 'on leave').length;
  const inactive = accounts.filter(s => {
    const st = (s.status || s.Status || '').toLowerCase();
    return st === 'inactive' || st === 'rejected';
  }).length;

  const logs = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_display_logs') || '[]'); } catch { return []; }
  }, []);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLogs = logs.filter(l => (l.date || '').startsWith(thisMonth));
  const totalSessionsMonth = monthLogs.length;
  const totalHoursMonth = monthLogs.reduce((s, l) => s + (Number(l.hours) || 0), 0).toFixed(1);

  const activityCounts = logs.reduce((acc, l) => {
    const a = l.activity || 'Other';
    acc[a] = (acc[a] || 0) + 1;
    return acc;
  }, {});
  const maxActivity = Math.max(...Object.values(activityCounts), 1);

  const ACTIVITY_COLORS = {
    'Morning Class': '#6366f1',
    'Afternoon Class': '#3b82f6',
    'Mudhaakarah': '#10b981',
    'Mashurah': '#f59e0b',
    'Admin': '#8b5cf6',
    'Other': '#6b7280',
  };

  const CENTER_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899'];
  const staffByCenter = useMemo(() => {
    const map = {};
    accounts.forEach(s => {
      const c = (s.centre || s.Centre || 'Unknown').trim();
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({ label, value, color: CENTER_COLORS[i % CENTER_COLORS.length] }));
  }, [accounts]);
  const maxCenter = Math.max(...staffByCenter.map(d => d.value), 1);

  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyHours = MONTH_LABELS.map((label, i) => {
    const prefix = `${now.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
    const hrs = logs.filter(l => (l.date || '').startsWith(prefix)).reduce((s, l) => s + (Number(l.hours) || 0), 0);
    return { label, value: Math.round(hrs) };
  }).filter(m => m.value > 0 || now.getMonth() >= MONTH_LABELS.indexOf(m.label));
  const maxHours = Math.max(...monthlyHours.map(m => m.value), 1);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16,
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
          <StatCard icon={Users} label={t.totalStaff} value={accounts.length} color="#6366f1" />
          <StatCard icon={CheckSquare} label={t.active} value={activeStaff} color="#10b981" />
          <StatCard icon={TrendingUp} label={t.sessionsMonth} value={totalSessionsMonth} color="#3b82f6" />
          <StatCard icon={Clock} label={t.hoursMonth} value={`${totalHoursMonth}h`} color="#f59e0b" />
        </div>

        <div style={gridStyle}>
          <Widget title={t.staffStatus}>
            <PieChart data={[
              { label: t.active, value: activeStaff, color: '#10b981' },
              { label: t.onLeave, value: onLeave, color: '#f59e0b' },
              { label: t.inactive, value: inactive, color: '#ef4444' },
            ]} />
          </Widget>

          <Widget title={t.staffByCenter}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {staffByCenter.map((d, i) => (
                <HBar key={i} label={d.label} value={d.value} max={maxCenter} color={d.color} />
              ))}
            </div>
          </Widget>

          <Widget title={t.activityBreakdown}>
            {Object.keys(activityCounts).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.noSessions}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(activityCounts).sort((a, b) => b[1] - a[1]).map(([act, count]) => (
                  <HBar key={act} label={act} value={count} max={maxActivity} color={ACTIVITY_COLORS[act] || '#6b7280'} />
                ))}
              </div>
            )}
          </Widget>
        </div>

        <Widget title={t.monthlyHours} fullWidth>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 110 }}>
            {monthlyHours.map((m, i) => (
              <VBar key={i} label={m.label} value={m.value > 0 ? `${m.value}h` : ''} max={maxHours} color="var(--accent-color)" />
            ))}
          </div>
        </Widget>

        <Widget title={t.leaveSummary} fullWidth>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {accounts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>No staff accounts loaded yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.name}</th>
                    <th style={{ textAlign: 'center', padding: '8px 6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.total}</th>
                    <th style={{ textAlign: 'center', padding: '8px 6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.used}</th>
                    <th style={{ textAlign: 'center', padding: '8px 6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.left}</th>
                    <th style={{ textAlign: 'center', padding: '8px 6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((s, idx) => {
                    const name = s.name || s.Name || s.email || s.Email || 'Unknown';
                    const leavesUsed = Number(s.leavesUsed || s.leaves || 0);
                    const remaining = Math.max(0, 10 - leavesUsed);
                    const statusLabel = leavesUsed > 10 ? t.overLimit : leavesUsed > 7 ? t.nearLimit : t.good;
                    const statusClass = leavesUsed > 10 ? 'status-incomplete' : leavesUsed > 7 ? 'status-in-progress' : 'status-completed';
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 6px', fontSize: '0.85rem', fontWeight: 600 }}>{name}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', fontSize: '0.85rem' }}>10</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', fontSize: '0.85rem' }}>{leavesUsed}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center', fontSize: '0.85rem', color: remaining <= 3 ? '#ef4444' : 'var(--text-primary)', fontWeight: remaining <= 3 ? 700 : 400 }}>{remaining}</td>
                        <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                          <span className={`status-badge ${statusClass}`} style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Widget>
      </div>
    </div>
  );
}
