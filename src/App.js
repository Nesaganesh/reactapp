import React from 'react'
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Contactus from './components/pages/Contactus';
import Classes from './components/pages/Classes';
import Performances from './components/pages/Performances';
import QRCodeGen from './components/pages/QRCode/QRCodeGen';
import QRForm from './components/pages/QRCode/QRForm';
import AttendanceSuccess from './components/pages/Attendance/AttendanceSuccess';
import AttendanceList from './components/pages/Attendance/AttendanceList';
import UpComingEvents from './components/pages/UpComingEvents';
import AnnualEvent from './components/pages/AnnualEvent';
import StudentList from './components/pages/Student/StudentList';
import Diwali from './components/pages/Diwali/Diwali';
import Videos from './components/pages/Videos';
import CostumeMeasurements from './components/pages/CostumeMeasurements';
import InvoiceGenerator from './components/pages/InvoiceGenerator';




function App() {

  

  return (
    <>
      
      <Router>
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/contactus" element={<Contactus />}></Route>
              <Route path="/classes" element={<Classes />}></Route>
              <Route path="/performances" element={<Performances />}></Route>
              <Route path="/qrcode" element={<QRCodeGen />}></Route>
              <Route path="/qrform" element={<QRForm />}></Route>
              <Route path="/attendanceSuccess" element={<AttendanceSuccess />}></Route>
              <Route path="/attendanceList" element={<AttendanceList />}></Route>              
              <Route path="/UpComingEvents" element={<UpComingEvents />}></Route>              
              <Route path="/annualevent" element={<AnnualEvent />}></Route> 
              <Route path="/studentList" element={<StudentList />}></Route> 
              <Route path="/videos" element={<Videos />}></Route> 
              <Route path="/costume-measurements" element={<CostumeMeasurements />}></Route> 
              <Route path="/invoices" element={<InvoiceGenerator />}></Route> 
              
              {/* <Route path="/diwali"  element={<Diwali />}></Route>  */}
              
          </Routes>
      </Router>
    </>
  );
}

export default App;