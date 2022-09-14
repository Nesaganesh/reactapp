import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Contactus from './components/pages/Contactus';


function App() {
  return (
    <>
      <Router>
        <Navbar />
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/contactus" element={<Contactus />}></Route>
              
          </Routes>
      </Router>
    </>
  );
}

export default App;