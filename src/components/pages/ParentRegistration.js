import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import './ReportPortals.css';

const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_URL = `${API_ORIGIN}/api/student-reports/parent/register`;
const branches = ['Ipswich', 'Colchester', 'Chelmsford', 'Croydon'];

function ParentRegistration() {
  const [branch, setBranch] = useState('');
  const [studentName, setStudentName] = useState('');
  const [registration, setRegistration] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const registerStudent = async event => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, studentName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to register parent access.');
      setRegistration(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="report-portal-page parent-portal-page">
        <section className="report-portal-shell">
          <header className="portal-header">
            <p className="portal-eyebrow">Flytoez Dance Company</p>
            <h1>Parent access registration</h1>
            <p>Register your child once to receive a private code for progress reports.</p>
          </header>

          {!registration ? (
            <form className="portal-card portal-login" onSubmit={registerStudent}>
              <h2>Find your child</h2>
              <p>Enter the branch and your child’s full name as it appears on the class register.</p>
              <label className="portal-field">
                <span>Branch</span>
                <select value={branch} onChange={event => setBranch(event.target.value)} required>
                  <option value="">Select branch</option>
                  {branches.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="portal-field parent-registration-name">
                <span>Child’s full name</span>
                <input autoComplete="name" value={studentName} onChange={event => setStudentName(event.target.value)} maxLength="120" required />
              </label>
              <button className="portal-primary-button" type="submit" disabled={busy}>
                {busy ? 'Registering…' : 'Generate my code'}
              </button>
              {message && <p className="portal-message" role="alert">{message}</p>}
              <p className="portal-registration-note">Each student can register one code. If a code has already been created, a teacher must reset it before a replacement can be generated.</p>
            </form>
          ) : (
            <section className="portal-card parent-code-success" aria-live="polite">
              <div className="parent-code-success-icon" aria-hidden="true">✓</div>
              <p className="portal-eyebrow">Registration complete · {registration.branch}</p>
              <h2>Save your child’s code</h2>
              <p>This code is for <strong>{registration.studentName}</strong>. It is shown only now. Keep it private; a teacher must reset it if you lose it.</p>
              <output className="parent-generated-code" aria-label="Six-digit authorization code">{registration.accessCode}</output>
              <p className="portal-registration-note">Use this code with your child’s first name and branch on the Parent Reports page.</p>
              <Link className="portal-primary-button parent-code-link" to="/parentreports">Continue to parent reports</Link>
            </section>
          )}
          <p className="portal-footnote">The authorization code is stored securely as a hash and cannot be viewed again after this page.</p>
        </section>
      </main>
    </>
  );
}

export default ParentRegistration;
