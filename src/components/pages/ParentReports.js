import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import './ReportPortals.css';

const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE = `${API_ORIGIN}/api/student-reports`;
const branches = ['Ipswich', 'Colchester', 'Chelmsford', 'Croydon'];

function ParentReports() {
  const [branch, setBranch] = useState('');
  const [firstName, setFirstName] = useState('');
  const [step, setStep] = useState('student');
  const [accessCode, setAccessCode] = useState('');
  const [student, setStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const continueToCode = event => {
    event.preventDefault();
    if (!branch || !firstName.trim()) return;
    setStep('code');
    setMessage('Enter the authorization code provided by your dance school.');
  };

  const authorize = async event => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/parent/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The API verifies the first name, but parents may paste the full name here.
        body: JSON.stringify({ branch, firstName: firstName.trim().split(/\s+/)[0], accessCode })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to verify those details.');
      setStudent(data.student);
      setReports(data.reports);
      setStep('reports');
      setAccessCode('');
      setMessage(data.reports.length ? '' : 'Your access is verified. No term reports are available yet.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const signOut = () => {
    setStep('student');
    setStudent(null);
    setReports([]);
    setSelectedReport(null);
    setFirstName('');
    setAccessCode('');
    setMessage('');
  };

  const printReport = () => window.print();

  return (
    <>
      <Navbar />
      <main className="report-portal-page parent-portal-page">
        <section className="report-portal-shell">
          <header className="portal-header">
            <p className="portal-eyebrow">Flytoez Dance Company</p>
            <h1>Parent report access</h1>
            <p>View your child’s term-by-term dance progress reports.</p>
          </header>

          {step === 'student' && (
            <form className="portal-card portal-login" onSubmit={continueToCode}>
              <div className="portal-step-indicator"><span className="active">1</span><span className="step-line" /><span>2</span></div>
              <h2>Find your student</h2>
              <p>Choose the class branch and enter your child’s first name. If you enter the full name, we’ll use the first name.</p>
              <label className="portal-field"><span>Branch</span><select value={branch} onChange={event => setBranch(event.target.value)} required><option value="">Select branch</option>{branches.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="portal-field"><span>Student first name</span><input autoComplete="given-name" value={firstName} onChange={event => setFirstName(event.target.value)} required /></label>
              <button className="portal-primary-button" type="submit">Continue</button>
              <p className="parent-registration-prompt">Don’t have a code yet? <Link to="/generateaccesscode">Register for parent access</Link>.</p>
            </form>
          )}

          {step === 'code' && (
            <form className="portal-card portal-login" onSubmit={authorize}>
              <div className="portal-step-indicator"><span className="complete">✓</span><span className="step-line complete-line" /><span className="active">2</span></div>
              <h2>Verify parent access</h2>
              <p>Enter the six-digit code registered for {firstName.trim()}. Older teacher-issued codes are also accepted.</p>
              <label className="portal-field"><span>Authorization code</span><input type="password" inputMode="numeric" maxLength="128" autoComplete="one-time-code" value={accessCode} onChange={event => setAccessCode(event.target.value)} required /></label>
              <div className="portal-form-actions"><button className="portal-primary-button" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'View reports'}</button><button className="portal-quiet-button" type="button" onClick={() => { setStep('student'); setMessage(''); }}>Back</button></div>
              {message && <p className="portal-message" role="status">{message}</p>}
            </form>
          )}

          {step === 'reports' && (
            <section className="portal-card parent-reports-card">
              <div className="portal-card-heading"><div><p className="portal-eyebrow">{branch}</p><h2>Reports for {student.name}</h2><p>Only reports associated with this verified account are shown.</p></div><button className="portal-quiet-button" type="button" onClick={signOut}>Sign out</button></div>
              {reports.length > 0 ? (
                <div className="parent-term-grid">{reports.slice().sort((first, second) => new Date(second.assessmentDate) - new Date(first.assessmentDate)).map(report => <article className="parent-term-card" key={report.id}><div className="term-card-top"><span className="term-badge">{report.term}</span><span className="term-grade">{report.grade}</span></div><p>Assessment date: {report.assessmentDate}</p><p className="term-score">{report.totalScore}<small> / 30</small></p><p className="term-description">{report.gradeDescription}</p><button className="portal-primary-button" type="button" onClick={() => setSelectedReport(report)}>View report</button></article>)}</div>
              ) : <div className="portal-empty-state"><span className="empty-state-icon">✦</span><h3>No term reports yet</h3><p>Your teacher has not published a report for this student yet.</p></div>}
              {message && <p className="portal-message" role="status">{message}</p>}
            </section>
          )}

          {selectedReport && (
            <section className="portal-card parent-report-detail parent-report-print" aria-labelledby="parent-report-heading">
              <div className="portal-card-heading report-detail-toolbar"><div><p className="portal-eyebrow">{selectedReport.term} · {selectedReport.assessmentDate}</p><h2 id="parent-report-heading">{student.name}’s progress report</h2></div><div className="portal-form-actions"><button className="portal-primary-button" type="button" onClick={printReport}>Download / print</button><button className="portal-quiet-button" type="button" onClick={() => setSelectedReport(null)}>Close</button></div></div>
              <p className="portal-report-grade">{selectedReport.totalScore} / 30 <span>{selectedReport.grade} · {selectedReport.gradeDescription}</span></p>
              <div className="portal-table-scroll"><table className="portal-roster-table parent-score-table"><thead><tr><th>Skill</th><th>Score</th><th>Teacher observation</th></tr></thead><tbody>{selectedReport.skillNames.map((skill, index) => <tr key={skill}><td>{skill}</td><td>{selectedReport.scores[index]} / 5</td><td>{selectedReport.observations?.[index] || '—'}</td></tr>)}</tbody></table></div>
              <div className="parent-feedback"><h3>Personalised feedback</h3><p>{selectedReport.comments || 'Your instructor will add feedback to your next progress update.'}</p></div>
              <p className="portal-footnote">Scores reflect skills demonstrated on the assessment day, not a child’s potential or value. These are Flytoez internal progress grades, not externally accredited qualifications.</p>
            </section>
          )}
          {step !== 'reports' && <p className="portal-footnote">Student information is only returned after the authorization code has been verified by the server.</p>}
        </section>
      </main>
    </>
  );
}

export default ParentReports;
