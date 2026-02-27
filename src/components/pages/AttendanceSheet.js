import React, { useState, useEffect } from 'react';
import './AttendanceSheet.css';
import Navbar from '../Navbar';

const AttendanceSheet = () => {
  const branches = ['Ipswich', 'Colchester', 'Chelmsford'];
  const groups = ['Peppy Feet', 'Little Legends', 'Energetic Expressors', 'Teens Society'];
  
  const classSchedules = [
    { location: 'Goals, Ipswich', day: 'Friday', time: '6-7pm', ageGroup: '3-5 years', level: 'PeppyFeet', branch: 'Ipswich', group: 'Peppy Feet' },
    { location: 'Goals, Ipswich', day: 'Friday', time: '6-7pm', ageGroup: '6-9 years', level: 'Level 1', branch: 'Ipswich', group: 'Little Legends' },
    { location: 'Goals, Ipswich', day: 'Friday', time: '7-8pm', ageGroup: '9-12 years', level: 'Level 2', branch: 'Ipswich', group: 'Energetic Expressors' },
    { location: 'Goals, Ipswich', day: 'Friday', time: '8-9pm', ageGroup: '13+ years', level: 'Advanced', branch: 'Ipswich', group: 'Teens Society' },
    { location: 'Dance HQ, Mile End Road', day: 'Sunday', time: '2-3pm', ageGroup: '6-9 years', level: 'Level 1', branch: 'Colchester', group: 'Little Legends' },
    { location: 'Dance HQ, Mile End Road', day: 'Sunday', time: '3-4pm', ageGroup: '9-12 years', level: 'Level 2', branch: 'Colchester', group: 'Energetic Expressors' },
    { location: 'Dance HQ, Mile End Road', day: 'Sunday', time: '4-5pm', ageGroup: '13+ years', level: 'Advanced', branch: 'Colchester', group: 'Teens Society' },
    { location: 'Dance HQ, Mile End Road', day: 'Sunday', time: '5-6pm', ageGroup: 'Ladies', level: 'Level 2', branch: 'Colchester', group: 'Energetic Expressors' },
    { location: 'Boswells School, Chelmsford', day: 'Monday', time: '6-7pm', ageGroup: '6-9 years', level: 'Level 1', branch: 'Chelmsford', group: 'Little Legends' },
    { location: 'Boswells School, Chelmsford', day: 'Monday', time: '7-8pm', ageGroup: '13+ years', level: 'Advanced', branch: 'Chelmsford', group: 'Teens Society' }
  ];

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [startDate, setStartDate] = useState('2026-01-02');
  const [numberOfWeeks, setNumberOfWeeks] = useState(8);

  useEffect(() => {
    // Generate dates dynamically based on start date and number of weeks
    const generateDates = () => {
      const dates = [];
      const start = new Date(startDate);
      
      for (let i = 0; i < numberOfWeeks; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + (i * 7)); // Add 7 days for each week
        dates.push(date);
      }
      
      return dates;
    };

    if (startDate && numberOfWeeks > 0) {
      setAttendanceDates(generateDates());
    }
  }, [startDate, numberOfWeeks]);

  // Update existing students' attendance when dates change
  useEffect(() => {
    if (students.length > 0 && attendanceDates.length > 0) {
      setStudents(prevStudents => 
        prevStudents.map(student => {
          const updatedAttendance = attendanceDates.reduce((acc, date) => {
            const dateStr = date.toISOString();
            // Keep existing attendance value if date exists, otherwise set to empty
            acc[dateStr] = student.attendance[dateStr] || '';
            return acc;
          }, {});
          return {
            ...student,
            attendance: updatedAttendance
          };
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceDates]);

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedGroup('');
    setStudents([]);
    setClassInfo(null);
  };

  const handleGroupChange = (e) => {
    const group = e.target.value;
    setSelectedGroup(group);
    
    if (selectedBranch && group) {
      const schedule = classSchedules.find(
        s => s.branch === selectedBranch && s.group === group
      );
      
      if (schedule) {
        setClassInfo(schedule);
        // Initialize with empty students array
        setStudents([]);
      }
    }
  };

  const addStudent = () => {
    const newStudent = {
      id: Date.now(),
      name: '',
      attendance: attendanceDates.reduce((acc, date) => {
        acc[date.toISOString()] = '';
        return acc;
      }, {})
    };
    setStudents([...students, newStudent]);
  };

  const updateStudentName = (id, name) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, name } : student
    ));
  };

  const updateAttendance = (studentId, dateStr, value) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [dateStr]: value
          }
        };
      }
      return student;
    }));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const exportToCSV = () => {
    if (students.length === 0) return;

    let csv = 'Student Name,' + attendanceDates.map(d => formatDate(d)).join(',') + '\n';
    
    students.forEach(student => {
      const row = [
        student.name,
        ...attendanceDates.map(d => student.attendance[d.toISOString()] || '')
      ];
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${selectedBranch}_${selectedGroup}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="attendance-sheet-container">
        <h1>Student Attendance Sheet</h1>

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="branch">Select Branch *</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={handleBranchChange}
              className="filter-select"
            >
              <option value="">-- Choose Branch --</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="group">Select Group *</label>
            <select
              id="group"
              value={selectedGroup}
              onChange={handleGroupChange}
              className="filter-select"
              disabled={!selectedBranch}
            >
              <option value="">-- Choose Group --</option>
              {groups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="date-config-section">
          <h3>Date Configuration</h3>
          <div className="date-config-inputs">
            <div className="config-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <small className="help-text">First class date</small>
            </div>

            <div className="config-group">
              <label htmlFor="numberOfWeeks">Number of Weeks</label>
              <input
                type="number"
                id="numberOfWeeks"
                value={numberOfWeeks}
                onChange={(e) => setNumberOfWeeks(parseInt(e.target.value) || 0)}
                min="1"
                max="52"
                className="number-input"
              />
              <small className="help-text">Classes will repeat weekly (+7 days)</small>
            </div>

            <div className="config-group preview-dates">
              <label>Generated Dates Preview</label>
              <div className="dates-preview">
                {attendanceDates.slice(0, 4).map((date, index) => (
                  <span key={index} className="preview-date">
                    {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                ))}
                {attendanceDates.length > 4 && <span className="preview-more">... +{attendanceDates.length - 4} more</span>}
              </div>
            </div>
          </div>
        </div>

        {classInfo && (
          <div className="class-info-card">
            <h3>Class Information</h3>
            <div className="class-details">
              <p><strong>Location:</strong> {classInfo.location}</p>
              <p><strong>Schedule:</strong> {classInfo.day} {classInfo.time}</p>
              <p><strong>Age Group:</strong> {classInfo.ageGroup}</p>
              <p><strong>Level:</strong> {classInfo.level}</p>
            </div>
            <div className="action-buttons">
              <button onClick={addStudent} className="add-student-btn">
                + Add Student
              </button>
              {students.length > 0 && (
                <button onClick={exportToCSV} className="export-btn">
                  📥 Export to CSV
                </button>
              )}
            </div>
          </div>
        )}

        {students.length > 0 && (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th className="student-name-header">Student Name</th>
                  {attendanceDates.map(date => (
                    <th key={date.toISOString()} className="date-header">
                      {formatDate(date)}
                    </th>
                  ))}
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="student-name-cell">
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => updateStudentName(student.id, e.target.value)}
                        placeholder="Enter student name"
                        className="student-name-input"
                      />
                    </td>
                    {attendanceDates.map(date => {
                      const dateStr = date.toISOString();
                      const value = student.attendance[dateStr] || '';
                      return (
                        <td key={dateStr} className="attendance-cell">
                          <select
                            value={value}
                            onChange={(e) => updateAttendance(student.id, dateStr, e.target.value)}
                            className={`attendance-select ${value === 'yes' ? 'present' : value === 'no' ? 'absent' : ''}`}
                          >
                            <option value="">-</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </td>
                      );
                    })}
                    <td className="actions-cell">
                      <button 
                        onClick={() => deleteStudent(student.id)}
                        className="delete-btn"
                        title="Delete student"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedBranch && selectedGroup && students.length === 0 && (
          <div className="empty-state">
            <p>No students added yet. Click "Add Student" to start tracking attendance.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceSheet;
