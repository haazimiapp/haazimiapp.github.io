import { useState, useEffect, useCallback } from 'react';
import { studentsApi } from '../lib/supabaseApi';

const CACHE_KEY = 'haazimi_students_cache';

export default function useStudents(user) {
  const isDev = !!user?.isDev;

  const [students, setStudents] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');

  const save = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };

  const fetchStudents = useCallback(async () => {
    if (isDev) return;
    setLoading(true);
    try {
      const arr = await studentsApi.getAll();
      if (arr && arr.length > 0) { setStudents(arr); save(arr); }
    } catch { /* keep cache/mock */ }
    finally { setLoading(false); }
  }, [isDev]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const isManager = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);

  const myStudents = students.filter(s =>
    isManager
      ? (s.centre === (user?.centre || user?.center) || !user?.centre)
      : s.teacherEmail === user?.email
  );

  const addStudent = async (studentData) => {
    const newS = {
      ...studentData,
      id: `S-${Date.now()}`,
      teacherEmail: user?.email || '',
      centre: user?.centre || user?.center || '',
      country: user?.country || '',
      addedAt: new Date().toISOString(),
    };
    const updated = [...students, newS];
    setStudents(updated); save(updated);

    if (isDev) return newS;

    setSyncStatus('syncing');
    try {
      await studentsApi.create(newS);
      setSyncStatus('done');
    } catch { setSyncStatus('fail'); }
    return newS;
  };

  const updateStudent = async (id, changes) => {
    const updated = students.map(s => s.id === id ? { ...s, ...changes } : s);
    setStudents(updated); save(updated);

    if (isDev) return;

    setSyncStatus('syncing');
    try {
      await studentsApi.update(id, changes);
      setSyncStatus('done');
    } catch { setSyncStatus('fail'); }
  };

  const deleteStudent = async (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated); save(updated);

    if (isDev) return;

    setSyncStatus('syncing');
    try {
      await studentsApi.delete(id);
      setSyncStatus('done');
    } catch { setSyncStatus('fail'); }
  };

  return { students, myStudents, loading, syncStatus, fetchStudents, addStudent, updateStudent, deleteStudent };
}
