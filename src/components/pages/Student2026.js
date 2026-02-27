import React, { useEffect, useState, useMemo } from 'react';
import './Student2026.css';

const DEFAULT_SORT = { key: 'studentName', direction: 'asc' };

const Student2026 = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(DEFAULT_SORT);

  useEffect(() => {
    const rawBase = process.env.REACT_APP_API_URL || '';
    const API_BASE = rawBase.replace(/\/$/, '');
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/costume-measurements`);
        if (!res.ok) throw new Error(`Server responded ${res.status} ${API_BASE}/costume-measurements`);

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Expected JSON but received HTML. Is the backend running or proxy configured?');
        }

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : json;

        // de-duplicate by studentName (best-effort)
        const seen = new Set();
        const unique = data.reduce((acc, item) => {
          const key = (item.studentName || item.student_name || item.id || '').toString().trim();
          if (!key) return acc;
          if (!seen.has(key)) {
            seen.add(key);
            acc.push(item);
          }
          return acc;
        }, []);

        setStudents(unique);
      } catch (err) {
        setError(err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns = [
    { key: 'select', label: '' },
    { key: 'index', label: '#' },
    { key: 'studentName', label: 'Student Name' },
    { key: 'branch', label: 'Branch' },
    { key: 'parentName', label: 'Parent' },
    { key: 'parentMobile1', label: 'Mobile' },
    { key: 'tshirtOption', label: 'T-Shirt Option' },
    { key: 'tshirtSize', label: 'T-Shirt Size' },
    { key: 'tshirtStatus', label: 'T-Shirt Status' },
    { key: 'paymentCompleted', label: 'Paid' },
    { key: 'createdAt', label: 'Submitted At' },
  ];

  const mapped = useMemo(() => {
    return students.map((s, idx) => ({
      id: s.id || s._id || `${s.studentName}-${idx}`,
      index: idx + 1,
      studentName: s.studentName || s.student_name || '-',
      branch: s.branch || '-',
      parentName: s.parentName || s.parent_name || '-',
      parentMobile1: s.parentMobile1 || s.parent_mobile1 || s.parentMobile2 || '-',
      tshirtOption: s.tshirtOption || s.tshirt_option || '-',
      tshirtSize: s.tshirtSize || s.tshirt_size || '-',
      // derive paymentCompleted: if tshirtOption indicates buy => true (Paid)
      // if tshirtOption indicates have => null (N/A). Otherwise fall back to stored value.
      paymentCompleted: (() => {
        const opt = (s.tshirtOption || s.tshirt_option || '').toString().toLowerCase();
        if (opt.includes('buy')) return true;
        if (opt.includes('have')) return null;
        return s.paymentCompleted || s.payment_completed || false;
      })(),
      createdAt: s.createdAt || s.created_at || null,
    }));
  }, [students]);

  // CSV export (Excel-compatible)
  const exportToCSV = () => {
    if (!sorted || sorted.length === 0) return;
    const header = ['#','Student Name','Branch','Parent','Mobile','T-Shirt Option','T-Shirt Size','T-Shirt Status','Paid','Submitted At'];
    const rows = sorted.map((s) => {
      const tshirtStatus = (() => {
        const opt = (s.tshirtOption || '').toString().toLowerCase();
        if (opt.includes('buy') || opt === 'yes' || opt === 'need') return 'To Buy';
        if (opt.includes('have') || opt === 'no' || opt === 'already') return 'Have';
        if (s.tshirtSize && s.tshirtSize !== '-') return 'Have';
        return '-';
      })();
      const paid = s.paymentCompleted ? 'Paid' : 'N/A';
      return [s.index, s.studentName, s.branch, s.parentName, s.parentMobile1, s.tshirtOption, s.tshirtSize, tshirtStatus, paid, s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'];
    });

    const csv = [header, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_costume_measurements_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    setSelected(new Set(sorted.map((r) => r.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const rawAPI = process.env.REACT_APP_API_URL || '';
  const API_BASE = rawAPI.replace(/\/$/, '');

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/costume-measurements`);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Expected JSON but received ${contentType || 'unknown content-type'} from ${API_BASE}/costume-measurements (status ${res.status})`);
      }
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : json;
      const seen = new Set();
      const unique = data.reduce((acc, item) => {
        const key = (item.studentName || item.student_name || item.id || '').toString().trim();
        if (!key) return acc;
        if (!seen.has(key)) {
          seen.add(key);
          acc.push(item);
        }
        return acc;
      }, []);
      setStudents(unique);
    } catch (err) {
      setError(err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const performBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} selected student(s)? This cannot be undone.`)) return;
    try {
      for (const id of Array.from(selected)) {
        const res = await fetch(`${API_BASE}/costume-measurements/${id}`, { method: 'DELETE' });
        if (!res.ok) console.warn('Failed to delete', id);
      }
      clearSelection();
      await refetch();
    } catch (err) {
      console.error(err);
      setError('Failed to delete selected items');
    }
  };

  

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mapped;
    return mapped.filter((r) =>
      [r.studentName, r.branch, r.parentName, r.parentMobile1, r.tshirtOption, r.tshirtSize]
        .join(' ').toLowerCase().includes(q)
    );
  }, [mapped, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, direction } = sort;
    if (!key) return arr;
    arr.sort((a, b) => {
      const va = a[key] ?? '';
      const vb = b[key] ?? '';
      // handle dates
      if (key === 'createdAt') {
        const da = va ? new Date(va).getTime() : 0;
        const db = vb ? new Date(vb).getTime() : 0;
        return direction === 'asc' ? da - db : db - da;
      }
      // numeric
      if (typeof va === 'number' && typeof vb === 'number') {
        return direction === 'asc' ? va - vb : vb - va;
      }
      // string
      return direction === 'asc'
        ? String(va).localeCompare(String(vb), undefined, { sensitivity: 'base' })
        : String(vb).localeCompare(String(va), undefined, { sensitivity: 'base' });
    });
    return arr;
  }, [filtered, sort]);

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key === key) {
        return { key, direction: s.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIndicator = (colKey) => {
    if (sort.key !== colKey) return '↕';
    return sort.direction === 'asc' ? '▲' : '▼';
  };

  if (loading) return <div className="student2026-loading">Loading...</div>;
  if (error) return <div className="student2026-error">Error: {error}</div>;

  return (
    <div className="student2026-container">
      <div className="student2026-header">
        <h2>Students Who Filled Costume Measurements</h2>
        <div className="student2026-controls">
          <label>
            Search:&nbsp;
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, branch, parent, mobile..." />
          </label>
          <div className="student2026-count">Total: {students.length}</div>
        </div>
      </div>

      <div className="student2026-actions">
        <button onClick={() => selectAllVisible()} className="btn">Select All Visible</button>
        <button onClick={() => clearSelection()} className="btn btn-ghost">Clear</button>
        <button onClick={performBulkDelete} className="btn btn-danger">Delete Selected</button>
        <button onClick={exportToCSV} className="btn btn-ghost">Export (Excel)</button>
      </div>

      <table className="student2026-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} onClick={() => c.key !== 'select' && toggleSort(c.key)} className={c.key !== 'select' ? 'sortable' : ''}>
                {c.key === 'select' ? (
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === sorted.length && sorted.length > 0}
                    onChange={(e) => (e.target.checked ? selectAllVisible() : clearSelection())}
                  />
                ) : (
                  <>
                    {c.label} <span className="sort-indicator">{renderSortIndicator(c.key)}</span>
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, idx) => {
            const tshirtStatus = (() => {
              const opt = (s.tshirtOption || '').toString().toLowerCase();
              if (opt.includes('buy') || opt === 'yes' || opt === 'need') return 'To Buy';
              if (opt.includes('have') || opt === 'no' || opt === 'already') return 'Have';
              if (s.tshirtSize && s.tshirtSize !== '-') return 'Have';
              return '-';
            })();

            return (
              <tr key={s.id || idx} className={selected.has(s.id) ? 'selected' : ''}>
                <td>
                  <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                </td>
                <td>{s.index}</td>
                <td>{s.studentName}</td>
                <td>{s.branch}</td>
                <td>{s.parentName}</td>
                <td>{s.parentMobile1}</td>
                <td>{s.tshirtOption}</td>
                <td>{s.tshirtSize}</td>
                <td>{tshirtStatus}</td>
                <td>{s.paymentCompleted ? 'Paid' : 'N/A'}</td>
                <td>{s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Student2026;
