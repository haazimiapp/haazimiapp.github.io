import { supabase } from './supabase';

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const authApi = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    if (!data?.user) return { error: new Error('No user returned') };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return { error: new Error('Profile not found.') };
    }

    return { profile };
  },

  signUp: async (name, email, password, country, centre) => {
    const normalizedEmail = email.toLowerCase().trim();

    const { data: existing } = await supabase
      .from('profiles')
      .select('status')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing) return { existingStatus: existing.status };

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { name: name.trim(), country, centre } },
    });

    if (error) return { error };

    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: name.trim(),
        email: normalizedEmail,
        role: 'Staff',
        country,
        centre,
        status: 'Pending',
      });
    }

    await supabase.auth.signOut();
    return { success: true };
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { error };
    return { data };
  },

  signInWithApple: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { error };
    return { data };
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return { error };
  },

  getSession: () => supabase.auth.getSession(),
};

// ─── PROFILES ────────────────────────────────────────────────────────────────

export const profilesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('registered_at', { ascending: false });
    if (error) { console.error('profilesApi.getAll:', error); return null; }
    return data;
  },

  update: async (id, fields) => {
    const { error } = await supabase.from('profiles').update(fields).eq('id', id);
    if (error) { console.error('profilesApi.update:', error); return false; }
    return true;
  },

  updateByEmail: async (email, fields) => {
    const { error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('email', email.toLowerCase());
    if (error) { console.error('profilesApi.updateByEmail:', error); return false; }
    return true;
  },

  deleteByEmail: async (email) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (!profile) return false;
    const { error } = await supabase.from('profiles').delete().eq('id', profile.id);
    if (error) { console.error('profilesApi.deleteByEmail:', error); return false; }
    return true;
  },
};

// ─── ATTENDANCE (Time Logs) ───────────────────────────────────────────────────

export const attendanceApi = {
  upsert: async (record) => {
    const { error } = await supabase.from('attendance').upsert({
      id: record.id || String(Date.now()),
      teacher_name: record.teacherName || '',
      teacher_email: record.teacherEmail || '',
      work_date: record.workDate || record.date || null,
      check_in: record.checkIn || '',
      check_out: record.checkOut || '',
      activity: record.activity || '',
      hours: record.hours || 0,
      notes: record.notes || '',
      student_count: parseInt(record.studentCount) || 0,
      absent_count: parseInt(record.absentCount) || 0,
      absent_names: record.absentNames || '',
      other_activity: record.otherActivity || '',
      status: record.status || 'Pending',
    });
    if (error) { console.error('attendanceApi.upsert:', error); throw error; }
    return true;
  },

  getByEmail: async (email) => {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('teacher_email', email)
      .order('synced_at', { ascending: false });
    if (error) { console.error('attendanceApi.getByEmail:', error); return null; }
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('synced_at', { ascending: false });
    if (error) { console.error('attendanceApi.getAll:', error); return null; }
    return data;
  },
};

// ─── LEAVES ──────────────────────────────────────────────────────────────────

export const leavesApi = {
  getByEmail: async (email) => {
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('staff_email', email)
      .order('submitted_at', { ascending: false });
    if (error) { console.error('leavesApi.getByEmail:', error); return null; }
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) { console.error('leavesApi.getAll:', error); return null; }
    return data;
  },

  create: async (leave) => {
    const { error } = await supabase.from('leaves').insert({
      id: leave.id || String(Date.now()),
      staff_name: leave.staffName || '',
      staff_email: leave.staffEmail || '',
      type: leave.type || 'Casual',
      from_date: leave.from || '',
      to_date: leave.to || '',
      days: leave.days || 1,
      reason: leave.reason || '',
      status: leave.status || 'Pending',
      partial: leave.partial || false,
      from_time: leave.fromTime || '',
      to_time: leave.toTime || '',
      emergency: leave.emergency || false,
    });
    if (error) { console.error('leavesApi.create:', error); return false; }
    return true;
  },

  update: async (id, fields) => {
    const mapped = {};
    if (fields.status !== undefined) mapped.status = fields.status;
    if (fields.decidedBy !== undefined) mapped.decided_by = fields.decidedBy;
    if (fields.decidedAt !== undefined) mapped.decided_at = fields.decidedAt;
    if (fields.decisionReason !== undefined) mapped.decision_reason = fields.decisionReason;
    if (fields.auditNote !== undefined) mapped.audit_note = fields.auditNote;

    const { error } = await supabase.from('leaves').update(mapped).eq('id', String(id));
    if (error) { console.error('leavesApi.update:', error); return false; }
    return true;
  },

  delete: async (id) => {
    const { error } = await supabase.from('leaves').delete().eq('id', String(id));
    if (error) { console.error('leavesApi.delete:', error); return false; }
    return true;
  },
};

// ─── CALENDAR EVENTS ─────────────────────────────────────────────────────────

export const calendarApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true });
    if (error) { console.error('calendarApi.getAll:', error); return null; }
    return data;
  },

  getByMonth: async (year, month) => {
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('event_date', from)
      .lte('event_date', to)
      .order('event_date', { ascending: true });
    if (error) { console.error('calendarApi.getByMonth:', error); return null; }
    return data;
  },

  create: async (event) => {
    const { error } = await supabase.from('calendar_events').insert({
      id: event.id,
      event_date: event.date,
      name: event.name,
      type: event.type || 'event',
      description: event.desc || '',
      scope: event.scope || 'global',
      country: event.country || '',
      centre: event.centre || '',
      added_by: event.addedBy || '',
      added_by_email: event.addedByEmail || '',
    });
    if (error) { console.error('calendarApi.create:', error); return false; }
    return true;
  },

  createMany: async (events) => {
    const rows = events.map(ev => ({
      id: ev.id,
      event_date: ev.date,
      name: ev.name,
      type: ev.type || 'event',
      description: ev.desc || '',
      scope: ev.scope || 'global',
      country: ev.country || '',
      centre: ev.centre || '',
      added_by: ev.addedBy || '',
      added_by_email: ev.addedByEmail || '',
    }));
    const { error } = await supabase.from('calendar_events').insert(rows);
    if (error) { console.error('calendarApi.createMany:', error); return false; }
    return true;
  },

  update: async (id, fields) => {
    const mapped = {};
    if (fields.date !== undefined) mapped.event_date = fields.date;
    if (fields.name !== undefined) mapped.name = fields.name;
    if (fields.type !== undefined) mapped.type = fields.type;
    if (fields.desc !== undefined) mapped.description = fields.desc;

    const { error } = await supabase.from('calendar_events').update(mapped).eq('id', id);
    if (error) { console.error('calendarApi.update:', error); return false; }
    return true;
  },

  delete: async (id) => {
    const { error } = await supabase.from('calendar_events').delete().eq('id', id);
    if (error) { console.error('calendarApi.delete:', error); return false; }
    return true;
  },
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export const settingsApi = {
  getAll: async () => {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) { console.error('settingsApi.getAll:', error); return null; }
    const result = {};
    (data || []).forEach(row => {
      if (!result[row.centre]) result[row.centre] = {};
      result[row.centre][row.feature] = row.is_enabled;
    });
    return result;
  },

  upsert: async (centre, feature, isEnabled) => {
    const { error } = await supabase.from('settings').upsert(
      { centre, feature, is_enabled: isEnabled, updated_at: new Date().toISOString() },
      { onConflict: 'centre,feature' }
    );
    if (error) { console.error('settingsApi.upsert:', error); return false; }
    return true;
  },
};

// ─── STUDENTS ────────────────────────────────────────────────────────────────

export const studentsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('added_at', { ascending: false });
    if (error) { console.error('studentsApi.getAll:', error); return null; }
    return data.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      parentName: r.parent_name,
      parentPhone: r.parent_phone,
      address: r.address,
      className: r.class_name,
      teacherEmail: r.teacher_email,
      centre: r.centre,
      country: r.country,
      attendance: r.attendance,
      status: r.status,
      notes: r.notes,
      intentions: parseInt(r.intentions) || 0,
      quranJuz: r.quran_juz,
      surahs: r.surahs,
      duas: r.duas,
      muzaakarahs: r.muzaakarahs,
      other: r.other,
      addedAt: r.added_at,
    }));
  },

  create: async (student) => {
    const { error } = await supabase.from('students').insert({
      id: student.id,
      name: student.name || '',
      phone: student.phone || '',
      parent_name: student.parentName || '',
      parent_phone: student.parentPhone || '',
      address: student.address || '',
      class_name: student.className || '',
      teacher_email: student.teacherEmail || '',
      centre: student.centre || '',
      country: student.country || '',
      attendance: student.attendance || 0,
      status: student.status || 'On Track',
      notes: student.notes || '',
      intentions: String(student.intentions || 0),
      quran_juz: student.quranJuz || '',
      surahs: student.surahs || '',
      duas: student.duas || '',
      muzaakarahs: student.muzaakarahs || '',
      other: student.other || '',
    });
    if (error) { console.error('studentsApi.create:', error); return false; }
    return true;
  },

  update: async (id, changes) => {
    const mapped = {};
    if (changes.name !== undefined) mapped.name = changes.name;
    if (changes.phone !== undefined) mapped.phone = changes.phone;
    if (changes.parentName !== undefined) mapped.parent_name = changes.parentName;
    if (changes.parentPhone !== undefined) mapped.parent_phone = changes.parentPhone;
    if (changes.address !== undefined) mapped.address = changes.address;
    if (changes.className !== undefined) mapped.class_name = changes.className;
    if (changes.teacherEmail !== undefined) mapped.teacher_email = changes.teacherEmail;
    if (changes.centre !== undefined) mapped.centre = changes.centre;
    if (changes.country !== undefined) mapped.country = changes.country;
    if (changes.attendance !== undefined) mapped.attendance = changes.attendance;
    if (changes.status !== undefined) mapped.status = changes.status;
    if (changes.notes !== undefined) mapped.notes = changes.notes;
    if (changes.intentions !== undefined) mapped.intentions = String(changes.intentions);
    if (changes.quranJuz !== undefined) mapped.quran_juz = changes.quranJuz;
    if (changes.surahs !== undefined) mapped.surahs = changes.surahs;
    if (changes.duas !== undefined) mapped.duas = changes.duas;
    if (changes.muzaakarahs !== undefined) mapped.muzaakarahs = changes.muzaakarahs;
    if (changes.other !== undefined) mapped.other = changes.other;

    const { error } = await supabase.from('students').update(mapped).eq('id', id);
    if (error) { console.error('studentsApi.update:', error); return false; }
    return true;
  },

  delete: async (id) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) { console.error('studentsApi.delete:', error); return false; }
    return true;
  },
};

// ─── BUDGET ──────────────────────────────────────────────────────────────────

export const budgetApi = {
  getByMonth: async (month) => {
    const { data, error } = await supabase
      .from('budget_items')
      .select('*')
      .eq('month', month);
    if (error) { console.error('budgetApi.getByMonth:', error); return null; }
    return data.map(r => ({
      id: r.id,
      month: r.month,
      category: r.category,
      budgeted: r.budgeted,
      spent: r.spent,
      notes: r.notes,
      receiptName: r.receipt_name,
      receiptUrl: r.receipt_url,
    }));
  },

  create: async (item) => {
    const { error } = await supabase.from('budget_items').insert({
      id: item.id,
      month: item.month,
      category: item.category || '',
      budgeted: item.budgeted || 0,
      spent: item.spent || 0,
      notes: item.notes || '',
      receipt_name: item.receiptName || '',
      receipt_url: item.receiptUrl || '',
      added_by: item.addedBy || '',
      centre: item.centre || '',
      country: item.country || '',
    });
    if (error) { console.error('budgetApi.create:', error); return false; }
    return true;
  },

  update: async (id, fields) => {
    const mapped = {};
    if (fields.category !== undefined) mapped.category = fields.category;
    if (fields.budgeted !== undefined) mapped.budgeted = fields.budgeted;
    if (fields.spent !== undefined) mapped.spent = fields.spent;
    if (fields.notes !== undefined) mapped.notes = fields.notes;
    if (fields.receiptName !== undefined) mapped.receipt_name = fields.receiptName;
    if (fields.receiptUrl !== undefined) mapped.receipt_url = fields.receiptUrl;

    const { error } = await supabase.from('budget_items').update(mapped).eq('id', id);
    if (error) { console.error('budgetApi.update:', error); return false; }
    return true;
  },

  delete: async (id) => {
    const { error } = await supabase.from('budget_items').delete().eq('id', id);
    if (error) { console.error('budgetApi.delete:', error); return false; }
    return true;
  },
};

// ─── CENTRE STAFF ─────────────────────────────────────────────────────────────

export const centreStaffApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('centre_staff')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('centreStaffApi.getAll:', error); return null; }
    return data.map(r => ({
      id: r.id,
      name: r.name,
      role: r.role,
      centre: r.centre,
      phone: r.phone,
      joinDate: r.join_date,
      salary: r.salary,
      notes: r.notes,
      status: r.status,
    }));
  },

  create: async (member) => {
    const { error } = await supabase.from('centre_staff').insert({
      id: member.id || String(Date.now()),
      name: member.name || '',
      role: member.role || '',
      centre: member.centre || '',
      phone: member.phone || '',
      join_date: member.joinDate || '',
      salary: member.salary || '',
      notes: member.notes || '',
      status: member.status || 'Active',
    });
    if (error) { console.error('centreStaffApi.create:', error); return false; }
    return true;
  },

  update: async (id, fields) => {
    const mapped = {};
    if (fields.name !== undefined) mapped.name = fields.name;
    if (fields.role !== undefined) mapped.role = fields.role;
    if (fields.centre !== undefined) mapped.centre = fields.centre;
    if (fields.phone !== undefined) mapped.phone = fields.phone;
    if (fields.joinDate !== undefined) mapped.join_date = fields.joinDate;
    if (fields.salary !== undefined) mapped.salary = fields.salary;
    if (fields.notes !== undefined) mapped.notes = fields.notes;
    if (fields.status !== undefined) mapped.status = fields.status;

    const { error } = await supabase.from('centre_staff').update(mapped).eq('id', id);
    if (error) { console.error('centreStaffApi.update:', error); return false; }
    return true;
  },

  delete: async (id) => {
    const { error } = await supabase.from('centre_staff').delete().eq('id', id);
    if (error) { console.error('centreStaffApi.delete:', error); return false; }
    return true;
  },
};

// ─── REIMBURSEMENTS ──────────────────────────────────────────────────────────

export const reimbursementsApi = {
  create: async (req) => {
    const { error } = await supabase.from('reimbursements').insert({
      id: String(req.id || Date.now()),
      type: req.type || 'travel',
      staff_name: req.staffName || '',
      staff_email: req.staffEmail || '',
      date: req.date || '',
      purpose: req.purpose || '',
      category: req.category || '',
      distance: req.distance || 0,
      fuel_cost: req.fuelCost || 0,
      wear_cost: req.wearCost || 0,
      total: req.total || 0,
      currency: req.currency || '$',
      status: req.status || 'pending',
    });
    if (error) { console.error('reimbursementsApi.create:', error); return false; }
    return true;
  },

  delete: async (id) => {
    const { error } = await supabase.from('reimbursements').delete().eq('id', String(id));
    if (error) { console.error('reimbursementsApi.delete:', error); return false; }
    return true;
  },
};
