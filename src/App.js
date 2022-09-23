import React from 'react';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Contactus from './components/pages/Contactus';
import Classes from './components/pages/Classes';

import Diwali from './components/pages/Diwali';



function App() {
  return (
    <>
      <Router>
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/contactus" element={<Contactus />}></Route>
              <Route path="/classes" element={<Classes />}></Route>
              
              <Route path="/diwali" element={<Diwali />}></Route>
              
          </Routes>
      </Router>
    </>
  );
}

export default App;