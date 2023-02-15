import React from 'react'
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewSignup from './components/NewSignup';
import Contactus from './components/pages/Contactus';
import Classes from './components/pages/Classes';
import Performances from './components/pages/Performances';
import Payment from './components/pages/Payment';

import PaySuccess from './components/pages/PaySuccess';
import PayCancel from './components/pages/PayCancel';
import Diwali from './components/pages/Diwali/Diwali';

import Event from './components/pages/Events/Event';
import EventReg from './components/pages/Events/EventReg';
import StudentForm from './components/pages/students/StudentForm';
import QRCodeGen from './components/pages/QRCode/QRCodeGen';


function App() {

  return (
    <>
      
      <Router>
          <Routes>
              <Route path="/" element={<Event />}></Route>
              {/* <Route path="/signup" element={<NewSignup />}></Route>
              <Route path="/contactus" element={<Contactus />}></Route>
              <Route path="/classes" element={<Classes />}></Route>
              <Route path="/performances" element={<Performances />}></Route>
              <Route path="/payment" element={<Payment />}></Route>
              <Route path="/paysuccess" element={<PaySuccess />}></Route>
              <Route path="/paycancel" element={<PayCancel />}></Route>
              <Route path="/diwali" element={<Diwali />}></Route> */}
              <Route path="/event" element={<Event />}></Route>
              <Route path="/paysuccess" element={<QRCodeGen />}></Route>
              <Route path="/paycancel" element={<Event />}></Route>
              {/* <Route path="/studentForm" element={<StudentForm />}></Route>
              <Route path="/qrcode" element={<QRCodeGen />}></Route> */}
          </Routes>
      </Router>
    </>
  );
}

export default App;