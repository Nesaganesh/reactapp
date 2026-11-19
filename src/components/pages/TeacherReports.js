import React, { useMemo, useState } from 'react';
import Navbar from '../Navbar';
import './ReportPortals.css';

const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE = `${API_ORIGIN}/api/student-reports`;
const branches = ['Ipswich', 'Colchester', 'Chelmsford', 'Croydon'];
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
const observationOptions = [
  [
    'Excellent step memory and performs choreography accurately with confidence.',
    'Good understanding of the steps, with some room to improve consistency.',
    'Performs well on stage but needs to focus more during class practice.',
    'Challenging choreography becomes easier with regular practice at home.'
  ],
  [
    'Excellent sense of rhythm and consistently performs in time with the music.',
    'Good timing overall, with opportunities to improve musical accuracy.',
    'Maintains good rhythm during performances but needs more consistency in class.',
    'Regular practice with music will help improve rhythm and timing.'
  ],
  [
    'Excellent body coordination, control and dance technique.',
    'Shows good coordination but can improve the accuracy of certain movements.',
    'Demonstrates strong technique on stage but needs to maintain it during classes.',
    'Practising movements slowly at home will help develop better coordination.'
  ],
  [
    'Excellent facial expressions and energy throughout the performance.',
    'Shows good energy but can improve facial expressions and engagement.',
    'Very expressive on stage but needs to bring the same energy to classes.',
    'Practising expressions and performing with enthusiasm will build confidence.'
  ],
  [
    'Performs confidently with excellent stage presence.',
    'Shows growing confidence and can become more comfortable performing.',
    'Confident on stage but could participate more actively during classes.',
    'Regular practice and performance opportunities will help build confidence.'
  ],
  [
    'Excellent teamwork, awareness of formations and cooperation with others.',
    'Works well with the team but can improve positioning and formation accuracy.',
    'Maintains formations well on stage but needs more focus during group practice.',
    'Regular group practice and attention to positioning will improve teamwork.'
  ]
];
const feedbackTemplates = [
  {
    value: 'very-good',
    label: 'Very Good',
    description: 'Positive feedback',
    text: 'Excellent effort and performance! You have demonstrated strong dance skills, confidence and enthusiasm. Keep up the fantastic work!'
  },
  {
    value: 'average',
    label: 'Average / Good Progress',
    description: 'Balanced feedback',
    text: 'Good progress so far! You are developing your dance skills and showing improvement. With regular practice and greater focus, you can achieve even better results.'
  },
  {
    value: 'needs-improvement',
    label: 'Needs Improvement',
    description: 'Constructive feedback',
    text: 'You have great potential! Try to focus more during lessons and practise the choreography at home. With consistent effort, your timing, coordination and confidence will continue to improve.'
  }
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
  const [unassignedMeasurementStudents, setUnassignedMeasurementStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [branchConfirmed, setBranchConfirmed] = useState(false);
  const [term, setTerm] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [scores, setScores] = useState(Array(skillNames.length).fill(''));
  const [observations, setObservations] = useState(Array(skillNames.length).fill(''));
  const [observationChoices, setObservationChoices] = useState(Array(skillNames.length).fill(''));
  const [comments, setComments] = useState('');
  const [feedbackType, setFeedbackType] = useState('custom');
  const [feedbackCopyMessage, setFeedbackCopyMessage] = useState('');
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
    event?.preventDefault();
    setBusy(true);
    setMessage('');
    setSelectedStudent(null);
    setSelectedStudentIds([]);
    setBulkMode(false);
    try {
      const query = new URLSearchParams({ branch, group });
      const data = await apiRequest(`/teacher/students?${query}`);
      setStudents(data.students);
      setUnassignedMeasurementStudents(data.unassignedMeasurementStudents || []);
      const notices = [];
      if (data.branchNeedsConfirmation) {
        notices.push('The supplied roster has group names but no verified branch assignments. Confirm the selected branch before creating a report.');
      }
      if (data.unassignedMeasurementStudents?.length) {
        notices.push(`${data.unassignedMeasurementStudents.length} existing costume measurement record(s) for ${branch} do not have a class group. Assign each to the correct group below.`);
      }
      if (data.importedCount) notices.push(`${data.importedCount} student(s) loaded from costume measurements.`);
      if (!data.students.length && !data.unassignedMeasurementStudents?.length) {
        notices.push('No CostumeMeasurements entries were found for this branch and group. Check that each student has the correct branch and class group in the costume details.');
      }
      setMessage(notices.join(' '));
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
    } finally {
      setBusy(false);
    }
  };

  const assignMeasurementGroup = async measurement => {
    setBusy(true);
    setMessage('');
    try {
      await apiRequest(`/teacher/measurements/${encodeURIComponent(measurement.id)}/group`, {
        method: 'POST',
        body: JSON.stringify({ branch, group })
      });
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
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
    setObservationChoices(Array(skillNames.length).fill(''));
    setComments('');
    setFeedbackType('custom');
    setFeedbackCopyMessage('');
    setGeneratedParentCode('');
    setTerm('');
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
    setObservationChoices(Array(skillNames.length).fill(''));
    setComments('');
    setFeedbackType('custom');
    setFeedbackCopyMessage('');
    setGeneratedParentCode('');
    setTerm('');
    setMessage('');
  };

  const saveReport = async event => {
    event.preventDefault();
    if (!allScoresEntered) {
      setMessage('Enter a score for all six skills before saving.');
      return;
    }
    if (observationChoices.some((choice, index) => choice === 'custom' && !observations[index].trim())) {
      setMessage('Add a custom observation or choose one of the suggested observations.');
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
      const savedTerm = term.trim();
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
      setObservationChoices(Array(skillNames.length).fill(''));
      setComments('');
      setFeedbackType('custom');
      setFeedbackCopyMessage('');
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
    } finally {
      setBusy(false);
    }
  };

  const copyFeedback = async () => {
    if (!comments.trim()) {
      setFeedbackCopyMessage('Enter feedback before copying.');
      return;
    }
    try {
      await navigator.clipboard.writeText(comments);
      setFeedbackCopyMessage('Feedback copied.');
    } catch (error) {
      setFeedbackCopyMessage('Copy is unavailable in this browser. Select and copy the feedback text.');
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

  const clearAllReports = async () => {
    const confirmation = window.prompt('This permanently deletes every student progress report in the database. Student profiles and parent codes will remain. Type DELETE ALL REPORTS to continue.');
    if (confirmation !== 'DELETE ALL REPORTS') return;
    setBusy(true);
    setMessage('');
    try {
      const data = await apiRequest('/teacher/reports/clear-all', {
        method: 'POST',
        body: JSON.stringify({ confirmation })
      });
      setStudents(previous => previous.map(student => ({ ...student, reports: [] })));
      setSelectedStudent(previous => previous ? { ...previous, reports: [] } : previous);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
    } finally {
      setBusy(false);
    }
  };

  const clearAllParentCodes = async () => {
    const confirmation = window.prompt('This permanently removes all parent authorization codes. Parents will need new codes generated individually. Type REMOVE ALL PARENT CODES to continue.');
    if (confirmation !== 'REMOVE ALL PARENT CODES') return;
    setBusy(true);
    setMessage('');
    setGeneratedParentCode('');
    try {
      const data = await apiRequest('/teacher/parent-codes/clear-all', {
        method: 'POST',
        body: JSON.stringify({ confirmation })
      });
      setStudents(previous => previous.map(student => ({ ...student, parentCodeSet: false })));
      setSelectedStudent(previous => previous ? { ...previous, parentCodeSet: false } : previous);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
      if (error.message.includes('sign-in')) setToken('');
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
                <section className="teacher-danger-zone" aria-labelledby="teacher-danger-zone-heading">
                  <div><h3 id="teacher-danger-zone-heading">Global reset tools</h3><p>These actions affect all students and all terms. They cannot be undone. Student profiles will remain.</p></div>
                  <div className="teacher-danger-actions">
                    <button className="teacher-danger-button" type="button" onClick={clearAllReports} disabled={busy}>{busy ? 'Working…' : 'Clear all reports'}</button>
                    <button className="teacher-danger-button" type="button" onClick={clearAllParentCodes} disabled={busy}>{busy ? 'Working…' : 'Remove all parent codes'}</button>
                  </div>
                </section>
                {message && <p className="portal-message" role="status">{message}</p>}
              </div>

              {students.length > 0 && (
                <section className="portal-card">
                  <div className="portal-card-heading"><div><h2>Student roster</h2><p>{students.length} students · {group}. Select students to apply the same report feedback to a group.</p></div></div>
                  {unassignedMeasurementStudents.length > 0 && <div className="teacher-measurement-import">
                    <div><h3>Costume entries without a group</h3><p>Confirm each student’s class before adding them to the report roster. Assigning adds the record to {group}.</p></div>
                    {unassignedMeasurementStudents.map(measurement => <div className="teacher-measurement-import-row" key={measurement.id}><span>{measurement.name}</span><button className="portal-small-button" type="button" onClick={() => assignMeasurementGroup(measurement)} disabled={busy || Boolean(selectedStudent) || bulkMode}>Assign to {group}</button></div>)}
                  </div>}
                  <div className="bulk-roster-actions">
                    <label className="bulk-select-all"><input type="checkbox" checked={students.length > 0 && selectedStudentIds.length === students.length} onChange={event => setSelectedStudentIds(event.target.checked ? students.map(student => student.id) : [])} /> Select all</label>
                    <button className="portal-secondary-button" type="button" onClick={openBulkFeedback} disabled={selectedStudentIds.length === 0}>
                      Write shared feedback{selectedStudentIds.length ? ` (${selectedStudentIds.length})` : ''}
                    </button>
                  </div>
                  <div className="portal-table-scroll"><table className="portal-roster-table"><thead><tr><th>Select</th><th>Student</th><th>Branch status</th><th>Saved reports</th><th>Action</th></tr></thead><tbody>
                    {students.map(student => <tr key={student.id} className={selectedStudentIds.includes(student.id) || selectedStudent?.id === student.id ? 'selected-roster-row' : ''}><td><input className="roster-student-checkbox" type="checkbox" aria-label={`Select ${student.name}`} checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} /></td><td>{student.name}</td><td>{student.branchUnassigned ? <span className="unassigned-tag">Needs branch confirmation</span> : student.branch}</td><td>{student.reports.length}</td><td><div className="roster-report-actions">{student.reports.length > 0 && <button className="portal-secondary-button" type="button" onClick={() => printReport([...student.reports].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))[0])} title="View or download the latest saved report">View report</button>}<button className="portal-small-button" type="button" onClick={() => openStudent(student)}>{selectedStudent?.id === student.id ? 'Selected' : 'Write report'}</button></div></td></tr>)}
                  </tbody></table></div>
                </section>
              )}

              {students.length === 0 && unassignedMeasurementStudents.length > 0 && <section className="portal-card">
                <div className="portal-card-heading"><div><h2>Costume entries without a group</h2><p>Confirm each student’s class before adding them to the report roster.</p></div></div>
                <div className="teacher-measurement-import">
                  {unassignedMeasurementStudents.map(measurement => <div className="teacher-measurement-import-row" key={measurement.id}><span>{measurement.name}</span><button className="portal-small-button" type="button" onClick={() => assignMeasurementGroup(measurement)} disabled={busy || Boolean(selectedStudent) || bulkMode}>Assign to {group}</button></div>)}
                </div>
              </section>}

              {(selectedStudent || bulkMode) && (
                <section className="portal-card teacher-student-workspace">
                  <div className="portal-card-heading"><div><p className="portal-eyebrow">{branch} · {group}</p><h2>{bulkMode ? `Shared feedback for ${selectedStudentIds.length} students` : `Report for ${selectedStudent.name}`}</h2>{bulkMode && <p>These scores, observations and comments will be copied to every selected student. Review the selection before saving.</p>}</div><button type="button" className="portal-quiet-button" onClick={() => { setSelectedStudent(null); setBulkMode(false); }}>Close</button></div>
                  {(bulkMode ? students.some(student => selectedStudentIds.includes(student.id) && student.branchUnassigned) : selectedStudent.branchUnassigned) && <label className="portal-warning branch-confirmation"><input type="checkbox" checked={branchConfirmed} onChange={event => setBranchConfirmed(event.target.checked)} /><span>The source roster did not include the branch for {bulkMode ? 'one or more selected students' : selectedStudent.name}. Confirm that {bulkMode ? 'they belong' : `${selectedStudent.name} belongs`} to {branch}; this assignment will be saved with the report.</span></label>}
                  <form className="teacher-assessment-form" onSubmit={saveReport}>
                    <div className="portal-form-grid">
                      <label className="portal-field"><span>Term name</span><input value={term} onChange={event => setTerm(event.target.value)} placeholder="e.g. Autumn 2026" maxLength="60" required /></label>
                      <label className="portal-field"><span>Assessment date</span><input type="date" value={assessmentDate} onChange={event => setAssessmentDate(event.target.value)} required /></label>
                    </div>
                    <div className="teacher-assessment-heading"><h3>Instructor assessment form</h3><span>6 areas</span></div>
                    <div className="teacher-assessment-areas">{skillNames.map((skill, index) => <fieldset className="teacher-assessment-area" key={skill}>
                      <legend>{index + 1}. {skill}</legend>
                      <div className="teacher-assessment-score-row"><span className="teacher-assessment-label">Score</span><div className="teacher-score-options" role="radiogroup" aria-label={`${skill} score`}>
                        {[1, 2, 3, 4, 5].map(score => <label className="teacher-radio-option" key={score}><input type="radio" name={`score-${index}`} value={score} checked={scores[index] === String(score)} onChange={event => setScores(previous => previous.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} required /><span>{score}</span></label>)}
                      </div></div>
                      <span className="teacher-assessment-label teacher-observation-label">Observation</span>
                      <div className="teacher-observation-options" role="radiogroup" aria-label={`${skill} observation`}>
                        {observationOptions[index].map(option => <label className="teacher-observation-option" key={option}><input type="radio" name={`observation-${index}`} value={option} checked={observationChoices[index] === option} onChange={() => { setObservationChoices(previous => previous.map((choice, itemIndex) => itemIndex === index ? option : choice)); setObservations(previous => previous.map((value, itemIndex) => itemIndex === index ? option : value)); }} /><span>{option}</span></label>)}
                        <label className="teacher-observation-option"><input type="radio" name={`observation-${index}`} value="custom" checked={observationChoices[index] === 'custom'} onChange={() => { setObservationChoices(previous => previous.map((choice, itemIndex) => itemIndex === index ? 'custom' : choice)); setObservations(previous => previous.map((value, itemIndex) => itemIndex === index ? '' : value)); }} /><span>Custom observation</span></label>
                      </div>
                      {observationChoices[index] === 'custom' && <label className="teacher-custom-observation"><span className="visually-hidden">Custom observation for {skill}</span><textarea rows="2" maxLength="500" value={observations[index]} onChange={event => setObservations(previous => previous.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="Write a custom observation…" required /></label>}
                    </fieldset>)}</div>
                    <div className="teacher-assessment-total"><div><strong>Total score</strong><span>{scores.filter(score => score !== '').length} of 6 areas scored · {observations.filter(observation => observation.trim()).length} observations selected</span></div><strong className="teacher-total-value">{total} / 30</strong></div>
                    <div className="portal-score-summary"><span>Grade <strong>{grade ? `${grade.grade} — ${grade.description}` : 'Score all skills'}</strong></span></div>
                    <section className="teacher-feedback-panel" aria-labelledby="teacher-feedback-heading">
                      <h3 id="teacher-feedback-heading">Personalised feedback — Teacher selection</h3>
                      <fieldset className="teacher-feedback-types">
                        <legend>Choose feedback type</legend>
                        {feedbackTemplates.map(template => <label className="teacher-feedback-choice" key={template.value}>
                          <input type="radio" name="feedback-type" value={template.value} checked={feedbackType === template.value} onChange={() => { setFeedbackType(template.value); setComments(template.text); setFeedbackCopyMessage(''); }} />
                          <span><strong>{template.label}</strong><small>{template.description}</small></span>
                        </label>)}
                        <label className="teacher-feedback-choice">
                          <input type="radio" name="feedback-type" value="custom" checked={feedbackType === 'custom'} onChange={() => { setFeedbackType('custom'); setFeedbackCopyMessage(''); }} />
                          <span><strong>Custom Feedback</strong><small>Teacher writes their own</small></span>
                        </label>
                      </fieldset>
                      <label className="portal-field portal-comments"><span>Feedback preview (editable)</span><textarea rows="5" maxLength="3000" value={comments} onChange={event => { setComments(event.target.value); setFeedbackType('custom'); setFeedbackCopyMessage(''); }} placeholder="Enter personalised feedback…" /></label>
                      <div className="teacher-feedback-actions"><span role="status" aria-live="polite">{feedbackCopyMessage}</span><button className="portal-secondary-button" type="button" onClick={copyFeedback}>Copy feedback</button></div>
                    </section>
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
          <p className="portal-footnote">The report roster is loaded from CostumeMeasurements. Progress reports and parent access records are stored in the student reports database.</p>
        </section>
      </main>
    </>
  );
}

export default TeacherReports;
