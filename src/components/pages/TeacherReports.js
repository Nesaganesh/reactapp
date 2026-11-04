import React, { useMemo, useState } from 'react';
import Navbar from '../Navbar';
import './ReportPortals.css';

const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE = `${API_ORIGIN}/api/student-reports`;
const branches = ['Ipswich', 'Colchester', 'Chelmsford'];
const groups = [
  { value: 'PeppyToez', label: 'PeppyToez' },
  { value: 'LittleLegends', label: 'LittleLegends' },
  { value: 'EnergeticExpressors', label: 'EnergeticExpressors' },
  { value: 'TeensSociety', label: 'Teens Society' }
];
const skillNames = [
  'Choreography & step memory',
  'Rhythm & timing',
  'Coordination & technique',
  'Expression & energy',
  'Confidence & stage presence',
  'Teamwork & formations'
];
const gradeBands = [
  { min: 27, grade: 'A+', description: 'Outstanding' },
  { min: 24, grade: 'A', description: 'Excellent' },
  { min: 21, grade: 'B+', description: 'Very good' },
  { min: 18, grade: 'B', description: 'Good progress' },
  { min: 15, grade: 'C', description: 'Developing' },
  { min: 0, grade: 'D', description: 'More support recommended' }
];
const getGrade = total => gradeBands.find(band => total >= band.min);
const getErrorMessage = (data, fallback) => data.error || fallback;
const readApiResponse = async response => {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch (error) {
    if (/^\s*(<!doctype\s+html|<html\b)/i.test(body)) {
      throw new Error('The configured API URL returned a web page instead of an API response. Check REACT_APP_API_URL and confirm the updated backend is deployed.');
    }
    throw new Error(`The API returned an invalid response (HTTP ${response.status}). Check the backend service and deployment.`);
  }
};
const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

function TeacherReports() {
  const [token, setToken] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [branch, setBranch] = useState('');
  const [group, setGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [branchConfirmed, setBranchConfirmed] = useState(false);
  const [term, setTerm] = useState('Term 1');
  const [customTerm, setCustomTerm] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [scores, setScores] = useState(Array(skillNames.length).fill(''));
  const [observations, setObservations] = useState(Array(skillNames.length).fill(''));
  const [comments, setComments] = useState('');
  const [generatedParentCode, setGeneratedParentCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => scores.reduce((sum, score) => sum + (Number(score) || 0), 0), [scores]);
  const allScoresEntered = scores.every(score => score !== '');
  const grade = allScoresEntered ? getGrade(total) : null;

  const apiRequest = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
    const data = await readApiResponse(response);
    if (!response.ok) throw new Error(getErrorMessage(data, 'Request failed.'));
    return data;
  };

  const signIn = async event => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/teacher/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode })
      });
      const data = await readApiResponse(response);
      if (!response.ok) throw new Error(getErrorMessage(data, 'Unable to sign in.'));
      setToken(data.token);
      setAccessCode('');
      setMessage('Signed in.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const loadStudents = async event => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setSelectedStudent(null);
    setSelectedStudentIds([]);
    setBulkMode(false);
    try {
      const query = new URLSearchParams({ branch, group });
      const data = await apiRequest(`/teacher/students?${query}`);
      setStudents(data.students);
      if (data.branchNeedsConfirmation) {
        setMessage('The supplied roster has group names but no verified branch assignments. Confirm the selected branch before creating a report.');
      }
      if (!data.students.length) setMessage('No students are listed for this group yet. The supplied group names currently map to LittleLegends, EnergeticExpressors and TeensSociety.');
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
    } finally {
      setBusy(false);
    }
  };

  const addStudent = async event => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      await apiRequest('/teacher/students', {
        method: 'POST',
        body: JSON.stringify({ branch, group, name: newStudentName })
      });
      const query = new URLSearchParams({ branch, group });
      const data = await apiRequest(`/teacher/students?${query}`);
      setStudents(data.students);
      setNewStudentName('');
      setShowAddStudent(false);
      setMessage('Student added to this branch and group.');
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
    } finally {
      setBusy(false);
    }
  };

  const openStudent = student => {
    setBulkMode(false);
    setSelectedStudentIds([]);
    setSelectedStudent(student);
    setBranchConfirmed(!student.branchUnassigned);
    setScores(Array(skillNames.length).fill(''));
    setObservations(Array(skillNames.length).fill(''));
    setComments('');
    setGeneratedParentCode('');
    setTerm('Term 1');
    setCustomTerm('');
    setMessage('');
  };

  const toggleStudentSelection = studentId => {
    setSelectedStudentIds(previous => previous.includes(studentId)
      ? previous.filter(id => id !== studentId)
      : [...previous, studentId]);
  };

  const openBulkFeedback = () => {
    setSelectedStudent(null);
    setBulkMode(true);
    setBranchConfirmed(false);
    setScores(Array(skillNames.length).fill(''));
    setObservations(Array(skillNames.length).fill(''));
    setComments('');
    setGeneratedParentCode('');
    setTerm('Term 1');
    setCustomTerm('');
    setMessage('');
  };

  const saveReport = async event => {
    event.preventDefault();
    if (!allScoresEntered) {
      setMessage('Enter a score for all six skills before saving.');
      return;
    }
    const reportStudents = bulkMode
      ? students.filter(student => selectedStudentIds.includes(student.id))
      : [selectedStudent];
    if (bulkMode && !reportStudents.length) {
      setMessage('Select at least one student first.');
      return;
    }
    const unassignedStudents = reportStudents.filter(student => student.branchUnassigned);
    if (unassignedStudents.length && !branchConfirmed) {
      setMessage(`Confirm that the selected students belong to ${branch} before saving.`);
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const savedTerm = term === 'Custom term' ? customTerm.trim() : term;
      await apiRequest(bulkMode ? '/teacher/reports/bulk' : '/teacher/reports', {
        method: 'POST',
        body: JSON.stringify({
          ...(bulkMode ? { studentIds: selectedStudentIds } : { studentId: selectedStudent.id }),
          branch,
          group,
          term: savedTerm,
          assessmentDate,
          scores: scores.map(Number),
          observations,
          comments
        })
      });
      setMessage(bulkMode
        ? `Shared feedback saved for ${reportStudents.length} students.`
        : 'Progress report saved.');
      const query = new URLSearchParams({ branch, group });
      const data = await apiRequest(`/teacher/students?${query}`);
      setStudents(data.students);
      if (bulkMode) {
        setSelectedStudentIds([]);
        setBulkMode(false);
      } else {
        const updatedStudent = data.students.find(student => student.id === selectedStudent.id);
        setSelectedStudent(updatedStudent || null);
      }
      setScores(Array(skillNames.length).fill(''));
      setObservations(Array(skillNames.length).fill(''));
      setComments('');
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
    } finally {
      setBusy(false);
    }
  };

  const resetParentCode = async () => {
    if (!selectedStudent) return;
    if (selectedStudent.parentCodeSet && !window.confirm(`Reset the parent authorization code for ${selectedStudent.name}? The current code will stop working.`)) return;
    setBusy(true);
    setMessage('');
    setGeneratedParentCode('');
    try {
      const data = await apiRequest(`/teacher/students/${encodeURIComponent(selectedStudent.id)}/parent-code/reset`, {
        method: 'POST'
      });
      setGeneratedParentCode(data.accessCode);
      setSelectedStudent(previous => ({ ...previous, parentCodeSet: true }));
      setMessage('New parent authorization code generated. Share it directly with the parent; it will not be shown again.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const printReport = report => {
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (!reportWindow) {
      setMessage('Allow pop-ups to print a report.');
      return;
    }
    const rows = report.skillNames.map((skill, index) => `<tr><td>${escapeHtml(skill)}</td><td>${escapeHtml(report.scores[index])} / 5</td><td>${escapeHtml(report.observations[index])}</td></tr>`).join('');
    reportWindow.document.write(`<html><head><title>${escapeHtml(report.studentName)} - ${escapeHtml(report.term)}</title><style>body{font-family:Arial,sans-serif;color:#172033;padding:36px}h1{color:#bd1825}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{border:1px solid #d6dbe4;padding:10px;text-align:left}th{background:#f0f2f6}.muted{color:#586174}.total{font-weight:bold;background:#fff5e3}@media print{button{display:none}}</style></head><body><h1>FLYTOEZ DANCE COMPANY</h1><p>LEARN • PERFORM • PROGRESS</p><h2>Student Progress Report</h2><p><strong>Student:</strong> ${escapeHtml(report.studentName)} &nbsp; <strong>Branch:</strong> ${escapeHtml(report.branch)} &nbsp; <strong>Group:</strong> ${escapeHtml(report.group)}</p><p><strong>Term:</strong> ${escapeHtml(report.term)} &nbsp; <strong>Assessment date:</strong> ${escapeHtml(report.assessmentDate)}</p><table><thead><tr><th>Skill</th><th>Score</th><th>Teacher observation</th></tr></thead><tbody>${rows}<tr class="total"><td>TOTAL</td><td>${escapeHtml(report.totalScore)} / 30</td><td>Grade: ${escapeHtml(report.grade)} — ${escapeHtml(report.gradeDescription)}</td></tr></tbody></table><h3>Personalised feedback</h3><p>${escapeHtml(report.comments || '—')}</p><p class="muted">Scores reflect skills demonstrated on the day, not a child’s potential or value. Adjustments can be made for individual learning needs.</p><button onclick="window.print()">Print / Save as PDF</button></body></html>`);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  return (
    <>
      <Navbar />
      <main className="report-portal-page">
        <section className="report-portal-shell">
          <header className="portal-header">
            <p className="portal-eyebrow">Flytoez Dance Company</p>
            <h1>Instructor reports</h1>
            <p>Prepare term progress reports for Nessa and Poorni’s classes.</p>
          </header>

          {!token ? (
            <form className="portal-card portal-login" onSubmit={signIn}>
              <h2>Teacher sign in</h2>
              <p>Use the private teacher access code configured by the administrator.</p>
              <label className="portal-field"><span>Teacher access code</span><input type="password" autoComplete="current-password" value={accessCode} onChange={event => setAccessCode(event.target.value)} required /></label>
              <button className="portal-primary-button" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
              {message && <p className="portal-message" role="status">{message}</p>}
            </form>
          ) : (
            <>
              <div className="portal-card portal-filter-card">
                <div className="portal-card-heading"><div><h2>Choose class</h2><p>Select a branch and group to load the roster.</p></div><button className="portal-quiet-button" type="button" onClick={() => { setToken(''); setStudents([]); setSelectedStudent(null); setSelectedStudentIds([]); setBulkMode(false); }}>Sign out</button></div>
                <form className="portal-filter-form" onSubmit={loadStudents}>
                  <label className="portal-field"><span>Branch</span><select value={branch} onChange={event => setBranch(event.target.value)} required><option value="">Select branch</option>{branches.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label className="portal-field"><span>Group</span><select value={group} onChange={event => setGroup(event.target.value)} required><option value="">Select group</option>{groups.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                  <button className="portal-primary-button" type="submit" disabled={busy}>{busy ? 'Loading…' : 'Load students'}</button>
                </form>
                {branch && group && <div className="teacher-add-student-action">
                  <button className="portal-secondary-button" type="button" onClick={() => { setShowAddStudent(value => !value); setNewStudentName(''); setMessage(''); }}>
                    {showAddStudent ? 'Cancel adding student' : '+ Add student to this class'}
                  </button>
                </div>}
                {showAddStudent && <form className="teacher-add-student-form" onSubmit={addStudent}>
                  <div><h3>Add a student</h3><p>New student will be added to {branch} · {group}.</p></div>
                  <label className="portal-field"><span>Student name</span><input value={newStudentName} onChange={event => setNewStudentName(event.target.value)} maxLength="120" autoComplete="off" required /></label>
                  <button className="portal-primary-button" type="submit" disabled={busy}>{busy ? 'Adding…' : 'Add student'}</button>
                </form>}
                {message && <p className="portal-message" role="status">{message}</p>}
              </div>

              {students.length > 0 && (
                <section className="portal-card">
                  <div className="portal-card-heading"><div><h2>Student roster</h2><p>{students.length} students · {group}. Select students to apply the same report feedback to a group.</p></div></div>
                  <div className="bulk-roster-actions">
                    <label className="bulk-select-all"><input type="checkbox" checked={students.length > 0 && selectedStudentIds.length === students.length} onChange={event => setSelectedStudentIds(event.target.checked ? students.map(student => student.id) : [])} /> Select all</label>
                    <button className="portal-secondary-button" type="button" onClick={openBulkFeedback} disabled={selectedStudentIds.length === 0}>
                      Write shared feedback{selectedStudentIds.length ? ` (${selectedStudentIds.length})` : ''}
                    </button>
                  </div>
                  <div className="portal-table-scroll"><table className="portal-roster-table"><thead><tr><th>Select</th><th>Student</th><th>Branch status</th><th>Saved reports</th><th>Action</th></tr></thead><tbody>
                    {students.map(student => <tr key={student.id} className={selectedStudentIds.includes(student.id) || selectedStudent?.id === student.id ? 'selected-roster-row' : ''}><td><input className="roster-student-checkbox" type="checkbox" aria-label={`Select ${student.name}`} checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} /></td><td>{student.name}</td><td>{student.branchUnassigned ? <span className="unassigned-tag">Needs branch confirmation</span> : student.branch}</td><td>{student.reports.length}</td><td><button className="portal-small-button" type="button" onClick={() => openStudent(student)}>{selectedStudent?.id === student.id ? 'Selected' : 'Write report'}</button></td></tr>)}
                  </tbody></table></div>
                </section>
              )}

              {(selectedStudent || bulkMode) && (
                <section className="portal-card teacher-student-workspace">
                  <div className="portal-card-heading"><div><p className="portal-eyebrow">{branch} · {group}</p><h2>{bulkMode ? `Shared feedback for ${selectedStudentIds.length} students` : `Report for ${selectedStudent.name}`}</h2>{bulkMode && <p>These scores, observations and comments will be copied to every selected student. Review the selection before saving.</p>}</div><button type="button" className="portal-quiet-button" onClick={() => { setSelectedStudent(null); setBulkMode(false); }}>Close</button></div>
                  {(bulkMode ? students.some(student => selectedStudentIds.includes(student.id) && student.branchUnassigned) : selectedStudent.branchUnassigned) && <label className="portal-warning branch-confirmation"><input type="checkbox" checked={branchConfirmed} onChange={event => setBranchConfirmed(event.target.checked)} /><span>The source roster did not include the branch for {bulkMode ? 'one or more selected students' : selectedStudent.name}. Confirm that {bulkMode ? 'they belong' : `${selectedStudent.name} belongs`} to {branch}; this assignment will be saved with the report.</span></label>}
                  <form onSubmit={saveReport}>
                    <div className="portal-form-grid">
                      <label className="portal-field"><span>Term</span><select value={term} onChange={event => setTerm(event.target.value)}><option>Term 1</option><option>Term 2</option><option>Term 3</option><option>Term 4</option><option>Term 5 - 2026</option><option>Custom term</option></select></label>
                      {term === 'Custom term' && <label className="portal-field"><span>Term name</span><input value={customTerm} onChange={event => setCustomTerm(event.target.value)} required /></label>}
                      <label className="portal-field"><span>Assessment date</span><input type="date" value={assessmentDate} onChange={event => setAssessmentDate(event.target.value)} required /></label>
                    </div>
                    <div className="portal-skills-grid">{skillNames.map((skill, index) => <div className="portal-skill-row" key={skill}><label className="portal-field"><span>{skill}</span><select aria-label={`${skill} score`} value={scores[index]} onChange={event => setScores(previous => previous.map((score, itemIndex) => itemIndex === index ? event.target.value : score))} required><option value="">Score</option>{[1, 2, 3, 4, 5].map(score => <option key={score} value={score}>{score} / 5</option>)}</select></label><label className="portal-field"><span>Observation</span><input value={observations[index]} onChange={event => setObservations(previous => previous.map((observation, itemIndex) => itemIndex === index ? event.target.value : observation))} placeholder="Optional observation" /></label></div>)}</div>
                    <div className="portal-score-summary"><span>Total <strong>{total} / 30</strong></span><span>Grade <strong>{grade ? `${grade.grade} — ${grade.description}` : 'Score all skills'}</strong></span></div>
                    <label className="portal-field portal-comments"><span>Personalised feedback</span><textarea rows="3" value={comments} onChange={event => setComments(event.target.value)} placeholder="Strengths, next step and encouragement" /></label>
                    <div className="portal-form-actions"><button className="portal-primary-button" type="submit" disabled={busy}>{busy ? 'Saving…' : bulkMode ? `Save shared feedback for ${selectedStudentIds.length} students` : 'Save progress report'}</button></div>
                  </form>
                  {selectedStudent && <div className="parent-code-form">
                    <div>
                      <h3>Parent report access</h3>
                      <p>{selectedStudent.parentCodeSet ? 'A code is already set. Resetting it invalidates the current code.' : 'No parent code has been registered for this student yet.'}</p>
                    </div>
                    <button className="portal-secondary-button" type="button" onClick={resetParentCode} disabled={busy}>{busy ? 'Generating…' : selectedStudent.parentCodeSet ? 'Reset parent code' : 'Generate parent code'}</button>
                    {generatedParentCode && <div className="teacher-generated-code"><span>Share this six-digit code with the parent now</span><strong>{generatedParentCode}</strong></div>}
                  </div>}
                  {selectedStudent && selectedStudent.reports.length > 0 && <div className="saved-report-list"><h3>Saved reports</h3>{selectedStudent.reports.map(report => <div className="saved-report-row" key={report.id}><span>{report.term} · {report.totalScore}/30 · {report.grade}</span><button type="button" className="portal-small-button" onClick={() => printReport(report)}>View / download</button></div>)}</div>}
                  {message && <p className="portal-message" role="status">{message}</p>}
                </section>
              )}
            </>
          )}
          <p className="portal-footnote">Student profiles and progress reports are stored in DynamoDB. Teachers can add students to the selected branch and group from this page.</p>
        </section>
      </main>
    </>
  );
}

export default TeacherReports;
