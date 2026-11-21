import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import './HowToViewReport.css';

function HowToViewReport() {
  return (
    <>
      <Navbar />
      <main className="report-guide-page">
        <section className="report-guide-shell" aria-labelledby="report-guide-title">
          <header className="report-guide-header">
            <p className="report-guide-company">💃 Flytoez Dance Company</p>
            <h1 id="report-guide-title">How to View Your Child’s Progress Report</h1>
            <p>Dear Parents,</p>
            <p>Your child’s progress report is now available online! 🌟</p>
            <strong>Please follow these 2 simple steps to access the report.</strong>
          </header>

          <div className="report-guide-steps">
            <article className="report-guide-card">
              <div className="report-guide-number" aria-hidden="true">1</div>
              <p className="report-guide-icon" aria-hidden="true">🔑</p>
              <h2>Generate Your Access Code</h2>
              <ol>
                <li>
                  Visit <a href="https://www.flytoez.co.uk/generateaccesscode">www.flytoez.co.uk/generateaccesscode</a>
                </li>
                <li>Select your child’s <strong>branch</strong>.</li>
                <li>Enter your <strong>child’s name</strong>.</li>
                <li>Generate and <strong>save your access code</strong>.</li>
              </ol>
              <Link className="report-guide-button" to="/generateaccesscode">Generate Access Code</Link>
            </article>

            <div className="report-guide-connector" aria-hidden="true">→</div>

            <article className="report-guide-card">
              <div className="report-guide-number" aria-hidden="true">2</div>
              <p className="report-guide-icon" aria-hidden="true">📊</p>
              <h2>View the Progress Report</h2>
              <ol>
                <li>
                  Visit <a href="https://www.flytoez.co.uk/parentreports">www.flytoez.co.uk/parentreports</a>
                </li>
                <li>Select the same <strong>branch</strong>.</li>
                <li>Enter your <strong>child’s name</strong>.</li>
                <li>Enter your <strong>access code</strong>.</li>
                <li>Submit to view the progress report.</li>
              </ol>
              <Link className="report-guide-button" to="/parentreports">View Progress Report</Link>
            </article>
          </div>

          <aside className="report-guide-notes" aria-labelledby="important-notes-title">
            <h2 id="important-notes-title">📌 Important Notes</h2>
            <ul>
              <li>🔒 Keep your access code private.</li>
              <li>💬 Lost your code? Please message <strong>Nesa privately</strong>.</li>
              <li>📩 For any technical issues, please send a private message.</li>
            </ul>
          </aside>

          <footer className="report-guide-footer">
            <p>Thank you for being part of the <strong>Flytoez Family!</strong> ❤️</p>
            <p className="report-guide-signature">Flytoez Dance Company</p>
            <a href="https://www.flytoez.co.uk">🌐 www.flytoez.co.uk</a>
          </footer>
        </section>
      </main>
    </>
  );
}

export default HowToViewReport;
