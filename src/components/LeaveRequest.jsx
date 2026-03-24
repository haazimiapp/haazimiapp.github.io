import { useState, useEffect } from 'react';
import { LEAVE_REQUESTS, STAFF } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { AlertCircle, XCircle, Users, User } from 'lucide-react';

const T = {
  en: {
    title: 'Request Leave', sub: 'Submit a leave application for approval',
    myLeave: 'My Leave', forStaff: 'Request for Staff',
    selectStaff: 'Select Staff Member', searchStaff: 'Search staff...',
    pendingTitle: 'Leave Request Pending',
    pendingDesc: 'You have a', pendingDesc2: 'leave awaiting approval. You cannot submit a new request until it is resolved.',
    cancelBtn: 'Cancel Request', cancelling: 'Cancelling…',
    formTitle: 'Leave Application Form', formSub: 'Fill in the details below. Your manager will be notified.',
    successMsg: 'Your leave request has been submitted successfully!',
    leaveType: 'Leave Type', applicant: 'Applicant', requestor: 'Requested By',
    fromDate: 'From Date', toDate: 'To Date',
    duration: 'Duration', day: 'day', days: 'days', emergency: 'Mark as Emergency',
    reason: 'Reason / Details', reasonPlaceholder: 'Please provide a clear reason for your leave request...',
    approved: 'Approved', pending: 'Pending', rejected: 'Rejected',
    clear: 'Clear', submit: 'Submit Request', locked: 'Request Locked — Pending Approval',
    history: 'My Leave History', noHistory: 'No previous leave requests found.',
    statusApproved: 'Approved', statusRejected: 'Rejected', statusPending: 'Pending',
    thirdPartyNote: 'You are submitting this leave on behalf of another staff member.',
  },
  ar: {
    title: 'طلب إجازة', sub: 'قدّم طلب إجازة للموافقة',
    myLeave: 'إجازتي', forStaff: 'طلب لموظف آخر',
    selectStaff: 'اختر موظفاً', searchStaff: 'ابحث عن موظف...',
    pendingTitle: 'طلب الإجازة معلق',
    pendingDesc: 'لديك طلب', pendingDesc2: 'في انتظار الموافقة. لا يمكنك تقديم طلب جديد حتى يتم حله.',
    cancelBtn: 'إلغاء الطلب', cancelling: 'جارٍ الإلغاء...',
    formTitle: 'نموذج طلب إجازة', formSub: 'أدخل التفاصيل أدناه. سيتم إخطار مديرك.',
    successMsg: 'تم إرسال طلب إجازتك بنجاح!',
    leaveType: 'نوع الإجازة', applicant: 'المتقدم', requestor: 'طلب بواسطة',
    fromDate: 'من تاريخ', toDate: 'إلى تاريخ',
    duration: 'المدة', day: 'يوم', days: 'أيام', emergency: 'تحديد كطارئ',
    reason: 'السبب / التفاصيل', reasonPlaceholder: 'يرجى تقديم سبب واضح...',
    approved: 'موافق عليه', pending: 'معلق', rejected: 'مرفوض',
    clear: 'مسح', submit: 'إرسال الطلب', locked: 'الطلب مقفل — في انتظار الموافقة',
    history: 'سجل إجازاتي', noHistory: 'لا توجد طلبات إجازة سابقة.',
    statusApproved: 'موافق', statusRejected: 'مرفوض', statusPending: 'معلق',
    thirdPartyNote: 'أنت تقدم هذا الطلب نيابةً عن موظف آخر.',
  },
  ur: {
    title: 'چھٹی کی درخواست', sub: 'منظوری کے لیے چھٹی کی درخواست جمع کریں',
    myLeave: 'میری چھٹی', forStaff: 'عملے کے لیے درخواست',
    selectStaff: 'عملے کا انتخاب کریں', searchStaff: 'عملہ تلاش کریں...',
    pendingTitle: 'چھٹی کی درخواست زیر التواء',
    pendingDesc: 'آپ کی', pendingDesc2: 'چھٹی کی درخواست منظوری کے انتظار میں ہے۔',
    cancelBtn: 'درخواست منسوخ کریں', cancelling: 'منسوخ ہو رہا ہے...',
    formTitle: 'چھٹی درخواست فارم', formSub: 'نیچے تفصیلات بھریں۔ آپ کے مینیجر کو مطلع کیا جائے گا۔',
    successMsg: 'آپ کی چھٹی کی درخواست کامیابی سے جمع کر دی گئی!',
    leaveType: 'چھٹی کی قسم', applicant: 'درخواست دہندہ', requestor: 'کی طرف سے درخواست',
    fromDate: 'تاریخ سے', toDate: 'تاریخ تک',
    duration: 'مدت', day: 'دن', days: 'دن', emergency: 'ہنگامی کے طور پر نشان لگائیں',
    reason: 'وجہ / تفصیلات', reasonPlaceholder: 'براہ کرم واضح وجہ بتائیں...',
    approved: 'منظور', pending: 'زیر التواء', rejected: 'مسترد',
    clear: 'صاف کریں', submit: 'درخواست جمع کریں', locked: 'درخواست بند — منظوری کا انتظار',
    history: 'میری چھٹیوں کی تاریخ', noHistory: 'کوئی سابقہ چھٹی کی درخواست نہیں ملی۔',
    statusApproved: 'منظور', statusRejected: 'مسترد', statusPending: 'زیر التواء',
    thirdPartyNote: 'آپ یہ درخواست کسی اور عملے کی طرف سے جمع کر رہے ہیں۔',
  },
  es: {
    title: 'Solicitar Licencia', sub: 'Envía una solicitud de licencia para aprobación',
    myLeave: 'Mi Licencia', forStaff: 'Solicitar para Personal',
    selectStaff: 'Seleccionar Personal', searchStaff: 'Buscar personal...',
    pendingTitle: 'Solicitud de Licencia Pendiente',
    pendingDesc: 'Tienes una licencia', pendingDesc2: 'esperando aprobación.',
    cancelBtn: 'Cancelar Solicitud', cancelling: 'Cancelando…',
    formTitle: 'Formulario de Solicitud', formSub: 'Complete los detalles. Su manager será notificado.',
    successMsg: '¡Solicitud de licencia enviada con éxito!',
    leaveType: 'Tipo de Licencia', applicant: 'Solicitante', requestor: 'Solicitado por',
    fromDate: 'Desde', toDate: 'Hasta',
    duration: 'Duración', day: 'día', days: 'días', emergency: 'Marcar como Emergencia',
    reason: 'Motivo / Detalles', reasonPlaceholder: 'Por favor proporcione un motivo claro...',
    approved: 'Aprobadas', pending: 'Pendientes', rejected: 'Rechazadas',
    clear: 'Limpiar', submit: 'Enviar Solicitud', locked: 'Solicitud Bloqueada',
    history: 'Mi Historial de Licencias', noHistory: 'No se encontraron solicitudes anteriores.',
    statusApproved: 'Aprobada', statusRejected: 'Rechazada', statusPending: 'Pendiente',
    thirdPartyNote: 'Estás enviando esta solicitud en nombre de otro miembro del personal.',
  },
  pt: {
    title: 'Solicitar Licença', sub: 'Envie uma solicitação de licença para aprovação',
    myLeave: 'Minha Licença', forStaff: 'Solicitar para Funcionário',
    selectStaff: 'Selecionar Funcionário', searchStaff: 'Procurar funcionário...',
    pendingTitle: 'Solicitação de Licença Pendente',
    pendingDesc: 'Tem uma licença', pendingDesc2: 'aguardando aprovação.',
    cancelBtn: 'Cancelar Solicitação', cancelling: 'Cancelando…',
    formTitle: 'Formulário de Solicitação', formSub: 'Preencha os detalhes abaixo. Seu gerente será notificado.',
    successMsg: 'Solicitação de licença enviada com sucesso!',
    leaveType: 'Tipo de Licença', applicant: 'Solicitante', requestor: 'Solicitado por',
    fromDate: 'De', toDate: 'Até',
    duration: 'Duração', day: 'dia', days: 'dias', emergency: 'Marcar como Emergência',
    reason: 'Motivo / Detalhes', reasonPlaceholder: 'Por favor forneça um motivo claro...',
    approved: 'Aprovadas', pending: 'Pendentes', rejected: 'Rejeitadas',
    clear: 'Limpar', submit: 'Enviar Solicitação', locked: 'Solicitação Bloqueada',
    history: 'Meu Histórico de Licenças', noHistory: 'Nenhuma solicitação anterior encontrada.',
    statusApproved: 'Aprovada', statusRejected: 'Rejeitada', statusPending: 'Pendente',
    thirdPartyNote: 'Está a enviar esta solicitação em nome de outro membro da equipe.',
  },
};

const STATUS_CLASS = {
  approved: 'status-completed', rejected: 'status-incomplete', pending: 'status-in-progress',
  Pending: 'status-in-progress', Approved: 'status-completed', Rejected: 'status-incomplete'
};

export default function LeaveRequest({ user, language }) {
  const t = T[language] || T.en;
  const isManager = ['Admin', 'Manager', 'manager'].includes(user?.role);

  const statusLabel = (s) => {
    if (['approved','Approved'].includes(s)) return t.statusApproved;
    if (['rejected','Rejected'].includes(s)) return t.statusRejected;
    return t.statusPending;
  };

  // "My Leave" vs "Request for Staff"
  const [mode, setMode] = useState('self'); // 'self' | 'staff'
  const [staffSearch, setStaffSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffDropOpen, setStaffDropOpen] = useState(false);

  // Load all staff for third-party leave
  const allStaff = (() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const active = accounts.filter(a => a.status === 'Approved' && a.email !== user.email);
      if (active.length > 0) return active.map(a => ({ name: a.name, email: a.email }));
    } catch {}
    return STAFF.filter(s => s.name !== user.name).map(s => ({ name: s.name, email: `${s.name.toLowerCase().replace(/\s+/g,'.')}@staff.local` }));
  })();

  const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()));

  const [form, setForm] = useState({ type: 'Casual', from: '', to: '', reason: '', emergency: false });
  const [submitted, setSubmitted] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    return Math.max(0, (new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24) + 1);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getLeaves&email=${encodeURIComponent(user.email || '')}`, { mode: 'cors' });
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.leaves || []);
        setMyLeaves(list.map(l => ({
          id: l.id || l.ID || Date.now(),
          type: l.type || l.Type || 'Casual',
          from: l.from || l.From || '',
          to: l.to || l.To || '',
          days: l.days || l.Days || 1,
          reason: l.reason || l.Reason || '',
          status: (l.status || l.Status || 'pending').toLowerCase(),
          beneficiary: l.beneficiary || null,
        })));
      } catch {
        setMyLeaves(LEAVE_REQUESTS.filter(l => l.staffName === user.name));
      }
      setLoadingHistory(false);
    };
    fetchHistory();
  }, [user.email, user.name]);

  const pendingRequest = myLeaves.find(l => l.status === 'pending' || l.status === 'Pending');
  const hasPending = mode === 'self' && !!pendingRequest;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'staff' && !selectedStaff) return;

    const beneficiary = mode === 'staff' ? selectedStaff : null;
    const newRequest = {
      id: Date.now(),
      staffId: user.email,
      staffName: user.name,
      beneficiaryName: beneficiary?.name || null,
      beneficiaryEmail: beneficiary?.email || null,
      type: form.type,
      from: form.from,
      to: form.to,
      days: calcDays(),
      reason: form.reason,
      status: 'pending',
    };

    if (mode === 'self') {
      setMyLeaves(l => [{ ...newRequest }, ...l]);
    }
    setSubmitted(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'submitLeave',
          email: user.email,
          name: user.name,
          beneficiaryName: beneficiary?.name,
          beneficiaryEmail: beneficiary?.email,
          leaveType: form.type,
          from: form.from,
          to: form.to,
          days: calcDays(),
          reason: form.reason,
          emergency: form.emergency,
        }),
      });
    } catch {}

    setTimeout(() => {
      setSubmitted(false);
      setForm({ type: 'Casual', from: '', to: '', reason: '', emergency: false });
      setSelectedStaff(null);
      setStaffSearch('');
    }, 4000);
  };

  const handleCancel = async () => {
    if (!pendingRequest) return;
    setCancelling(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'cancelLeave', email: user.email, leaveId: pendingRequest.id }) });
      setMyLeaves(prev => prev.filter(l => l.id !== pendingRequest.id));
    } catch {}
    setCancelling(false);
  };

  const approved = myLeaves.filter(l => ['approved','Approved'].includes(l.status)).length;
  const rejected = myLeaves.filter(l => ['rejected','Rejected'].includes(l.status)).length;
  const pending = myLeaves.filter(l => ['pending','Pending'].includes(l.status)).length;
  const daysLabel = (n) => `${n} ${n === 1 ? t.day : t.days}`;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      {/* Mode toggle — only for Managers/Admins */}
      {isManager && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            className={mode === 'self' ? 'button-primary' : 'button-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => { setMode('self'); setSelectedStaff(null); }}
          >
            <User size={15} /> {t.myLeave}
          </button>
          <button
            className={mode === 'staff' ? 'button-primary' : 'button-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setMode('staff')}
          >
            <Users size={15} /> {t.forStaff}
          </button>
        </div>
      )}

      {/* Pending lock banner (only in self mode) */}
      {hasPending && (
        <div style={{ background: 'var(--warning-bg, #fff8e1)', border: '1px solid var(--warning-border, #ffc107)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.pendingTitle}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t.pendingDesc} <strong>{pendingRequest.type}</strong> ({pendingRequest.from} → {pendingRequest.to}) {t.pendingDesc2}
              </div>
            </div>
          </div>
          <button className="button-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', borderColor: '#dc2626' }} onClick={handleCancel} disabled={cancelling}>
            <XCircle size={15} />{cancelling ? t.cancelling : t.cancelBtn}
          </button>
        </div>
      )}

      <div className="leave-page-layout">
        <div className="form-container" style={{ flex: '1 1 420px' }}>
          <div className="form-header">
            <h2>{t.formTitle}</h2>
            <p>{mode === 'staff' ? t.thirdPartyNote : t.formSub}</p>
          </div>
          {submitted && <div className="forgot-password-success" style={{ marginBottom: 24 }}>{t.successMsg}</div>}

          <form className="generic-form" onSubmit={handleSubmit}>
            <fieldset disabled={hasPending || submitted} style={{ border: 'none', padding: 0, margin: 0 }}>
              {/* Staff selector (third-party mode) */}
              {mode === 'staff' && (
                <div className="form-group" style={{ marginBottom: 16, position: 'relative' }}>
                  <label>{t.selectStaff} <span style={{ color: '#e74c3c' }}>*</span></label>
                  <input
                    type="text"
                    placeholder={t.searchStaff}
                    value={selectedStaff ? selectedStaff.name : staffSearch}
                    onChange={e => { setStaffSearch(e.target.value); setSelectedStaff(null); setStaffDropOpen(true); }}
                    onFocus={() => setStaffDropOpen(true)}
                    autoComplete="off"
                  />
                  {staffDropOpen && filteredStaff.length > 0 && !selectedStaff && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px var(--shadow-color)' }}>
                      {filteredStaff.map(s => (
                        <div key={s.email} style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                          onMouseDown={() => { setSelectedStaff(s); setStaffSearch(''); setStaffDropOpen(false); }}>
                          <strong>{s.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>{t.leaveType}</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)}>
                    <option>Casual</option>
                    <option>Medical</option>
                    <option>Emergency</option>
                    <option>Study</option>
                    <option>Maternity / Paternity</option>
                    <option>Annual</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{mode === 'staff' ? t.requestor : t.applicant}</label>
                  <input type="text" value={mode === 'staff' ? (selectedStaff?.name || '—') : user.name} disabled style={{ opacity: 0.7 }} />
                </div>
                <div className="form-group">
                  <label>{t.fromDate}</label>
                  <input type="date" value={form.from} onChange={e => set('from', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>{t.toDate}</label>
                  <input type="date" value={form.to} min={form.from} onChange={e => set('to', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>{t.duration}</label>
                  <div className="duration-display">{daysLabel(calcDays())}</div>
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" id="emergency" checked={form.emergency} onChange={e => set('emergency', e.target.checked)} />
                  <label htmlFor="emergency">{t.emergency}</label>
                </div>
                <div className="form-group full-width">
                  <label>{t.reason}</label>
                  <textarea value={form.reason} onChange={e => set('reason', e.target.value)} rows={4} required placeholder={t.reasonPlaceholder} />
                </div>
              </div>

              {mode === 'self' && (
                <div className="calculations-display">
                  <div className="calc-item"><span>{approved}</span>{t.approved}</div>
                  <div className="calc-item"><span>{pending}</span>{t.pending}</div>
                  <div className="calc-item"><span>{rejected}</span>{t.rejected}</div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="button-secondary" onClick={() => { setForm({ type: 'Casual', from: '', to: '', reason: '', emergency: false }); setSelectedStaff(null); setStaffSearch(''); }}>{t.clear}</button>
                <button type="submit" className="button-primary" disabled={hasPending || (mode === 'staff' && !selectedStaff)}>
                  {hasPending ? t.locked : t.submit}
                </button>
              </div>
            </fieldset>
          </form>
        </div>

        <div className="leave-history-panel" style={{ flex: '1 1 360px' }}>
          <h3>{t.history}</h3>
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: 24 }}><div className="button-spinner" style={{ margin: '0 auto' }} /></div>
          ) : myLeaves.length === 0 ? (
            <div className="prompt-container" style={{ marginTop: 0 }}>{t.noHistory}</div>
          ) : (
            <div className="leave-history-list">
              {myLeaves.map(req => (
                <div key={req.id} className={`leave-history-card leave-history-card--${(req.status || '').toLowerCase()}`}>
                  <div className="leave-history-card-top">
                    <div className="leave-history-type">{req.type}{req.beneficiaryName ? ` → ${req.beneficiaryName}` : ''}</div>
                    <span className={`status-badge ${STATUS_CLASS[req.status] || ''}`}>{statusLabel(req.status)}</span>
                  </div>
                  <div className="leave-history-dates">
                    {req.from} → {req.to}
                    <span className="leave-history-days">{daysLabel(req.days)}</span>
                  </div>
                  <div className="leave-history-reason">{req.reason}</div>
                  {req.auditNote && (
                    <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: 6 }}>
                      {req.auditNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
