import React, { useState } from 'react';
import Navbar from '../Navbar';
import './StudentReport.css';

const skills = [
  'Choreography & step memory',
  'Rhythm & timing',
  'Coordination & technique',
  'Expression & energy',
  'Confidence & stage presence',
  'Teamwork & formations'
];

const gradeBands = [
  { minimum: 27, maximum: 30, grade: 'A+', description: 'Outstanding' },
  { minimum: 24, maximum: 26, grade: 'A', description: 'Excellent' },
  { minimum: 21, maximum: 23, grade: 'B+', description: 'Very good' },
  { minimum: 18, maximum: 20, grade: 'B', description: 'Good progress' },
  { minimum: 15, maximum: 17, grade: 'C', description: 'Developing' },
  { minimum: 0, maximum: 14, grade: 'D', description: 'More support recommended' }
];

const createInitialFormData = () => ({
  term: '',
  assessmentDate: '',
  studentName: '',
  branchGroup: '',
  routine: '',
  instructor: '',
  sessionsAttended: '',
  scores: skills.map(() => ''),
  observations: skills.map(() => ''),
  wentWell: '',
  practiseNext: '',
  encouragement: '',
  teacherSignature: '',
  parentAcknowledgement: ''
});

function StudentReport() {
  const [formData, setFormData] = useState(createInitialFormData);
  const completedScores = formData.scores.filter(score => score !== '').length;
  const totalScore = formData.scores.reduce((total, score) => total + (Number(score) || 0), 0);
  const grade = completedScores === skills.length
    ? gradeBands.find(band => totalScore >= band.minimum && totalScore <= band.maximum)
    : null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  };

  const handleScoreChange = (index, value) => {
    setFormData(previous => {
      const scores = [...previous.scores];
      scores[index] = value;
      return { ...previous, scores };
    });
  };

  const handleObservationChange = (index, value) => {
    setFormData(previous => {
      const observations = [...previous.observations];
      observations[index] = value;
      return { ...previous, observations };
    });
  };

  const resetReport = () => setFormData(createInitialFormData());

  return (
    <>
      <Navbar />
      <main className="student-report-page">
        <div className="student-report-actions">
          <button type="button" className="report-action-button report-print-button" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
          <button type="button" className="report-action-button report-reset-button" onClick={resetReport}>
            Clear report
          </button>
        </div>

        <article className="student-report-document">
          <header className="report-brand-header">
            <p className="report-eyebrow">Flytoez Dance Company</p>
            <h1>LEARN <span>•</span> PERFORM <span>•</span> PROGRESS</h1>
            <p className="report-subtitle">10-Week Dance Progress Assessment</p>
          </header>

          <section className="report-form-section" aria-labelledby="student-progress-heading">
            <div className="report-section-heading report-form-heading">
              <div>
                <p className="report-kicker">Individual assessment</p>
                <h2 id="student-progress-heading">Student progress report</h2>
              </div>
              <div className="report-term-date">
                <label className="compact-field"><span>Term</span><input name="term" value={formData.term} onChange={handleChange} placeholder="Enter term" /></label>
                <label className="compact-field"><span>Assessment date</span><input type="date" name="assessmentDate" value={formData.assessmentDate} onChange={handleChange} /></label>
              </div>
            </div>
            <div className="report-student-details">
              <label className="report-field"><span>Student name</span><input name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Student full name" /></label>
              <label className="report-field"><span>Branch</span><select name="branchGroup" value={formData.branchGroup} onChange={handleChange}>
                <option value="">Select branch</option>
                <option value="Ipswich">Ipswich</option>
                <option value="Colchester">Colchester</option>
                <option value="Chelmsford">Chelmsford</option>
              </select></label>
              {/* <label className="report-field"><span>Routine / Song</span><input name="routine" value={formData.routine} onChange={handleChange} placeholder="Routine or song" /></label> */}
              <label className="report-field"><span>Instructor</span><input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor name" /></label>
              <label className="report-field attendance-field"><span>Sessions attended</span><div className="attendance-input"><input type="number" name="sessionsAttended" value={formData.sessionsAttended} onChange={handleChange} min="0" max="10" placeholder="0" /><span>/ 10</span></div></label>
            </div>

            <div className="report-assessment-heading">
              <h3>Assessment scores</h3>
              <p>Choose a score from 1 to 5 and add a specific observation for each skill.</p>
            </div>
            <div className="report-score-table-wrap">
              <table className="report-score-table">
                <thead><tr><th>Skill</th><th>Score (1–5)</th><th>Teacher observation</th></tr></thead>
                <tbody>
                  {skills.map((skill, index) => (
                    <tr key={skill}>
                      <td className="skill-name">{skill}</td>
                      <td>
                        <label className="score-select-label" htmlFor={`report-score-${index}`}>Score for {skill}</label>
                        <select id={`report-score-${index}`} aria-label={`Score for ${skill}`} value={formData.scores[index]} onChange={event => handleScoreChange(index, event.target.value)}>
                          <option value="">—</option>
                          {[1, 2, 3, 4, 5].map(score => <option key={score} value={score}>{score} / 5</option>)}
                        </select>
                      </td>
                      <td><input aria-label={`Teacher observation for ${skill}`} value={formData.observations[index]} onChange={event => handleObservationChange(index, event.target.value)} placeholder="Add an observation" /></td>
                    </tr>
                  ))}
                  <tr className="score-total-row">
                    <td>TOTAL</td>
                    <td><strong>{totalScore} / 30</strong></td>
                    <td><span className="grade-result">Grade: <strong>{grade ? `${grade.grade} — ${grade.description}` : 'Complete all six scores'}</strong></span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="report-feedback-section">
              <h3>Personalised feedback</h3>
              <label className="feedback-field"><span>Comments</span><textarea name="wentWell" value={formData.wentWell} onChange={handleChange} rows="2" placeholder="Celebrate strengths and progress..." /></label>
              {/* <label className="feedback-field"><span>One skill to practise next term</span><textarea name="practiseNext" value={formData.practiseNext} onChange={handleChange} rows="2" placeholder="Choose one achievable next step..." /></label>
              <label className="feedback-field"><span>Instructor encouragement</span><textarea name="encouragement" value={formData.encouragement} onChange={handleChange} rows="2" placeholder="Add a personal word of encouragement..." /></label> */}
            </div>

            {/* <div className="report-signatures">
              <label className="signature-field"><span>Teacher signature</span><input name="teacherSignature" value={formData.teacherSignature} onChange={handleChange} /></label>
              <label className="signature-field"><span>Parent acknowledgement (optional)</span><input name="parentAcknowledgement" value={formData.parentAcknowledgement} onChange={handleChange} /></label>
            </div>
            <p className="report-assessment-note">
              <strong>Assessment note:</strong> Scores reflect skills demonstrated on the day, not a child’s potential or value.
              Adjustments can be made for individual learning needs.
            </p> */}
          </section>
          <section className="report-information" aria-labelledby="parent-information-heading">
            <div className="report-section-heading">
              <div>
                <p className="report-kicker">A supportive snapshot of growth</p>
                <h2 id="parent-information-heading">Parent information &amp; assessment guide</h2>
              </div>
              <span className="assessment-period-badge">10 weeks</span>
            </div>
            <p className="report-intro">
              Each area is marked from 1 (starting to develop) to 5 (consistently demonstrated). The six areas total 30 points.
              Assessments are age-appropriate, supportive and based on individual progress.
            </p>

            <div className="report-guide-grid">
              <div className="report-table-wrap">
                <h3>Assessment areas</h3>
                <table className="report-reference-table">
                  <thead><tr><th>Area</th><th>Points</th></tr></thead>
                  <tbody>
                    {skills.map(skill => <tr key={skill}><td>{skill}</td><td className="points-cell">/5</td></tr>)}
                    <tr className="reference-total"><td>TOTAL</td><td className="points-cell">/30</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="report-table-wrap">
                <h3>Flytoez internal grades</h3>
                <table className="report-reference-table grade-table">
                  <thead><tr><th>Score</th><th>Grade</th><th>Description</th></tr></thead>
                  <tbody>
                    {gradeBands.map(band => (
                      <tr key={band.grade}>
                        <td>{band.minimum}–{band.maximum}</td><td className="grade-mark">{band.grade}</td><td>{band.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="report-disclaimer">
              These are Flytoez internal progress grades, not externally accredited qualifications. For younger children,
              feedback focuses on strengths and next steps rather than ranking students.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}

export default StudentReport;