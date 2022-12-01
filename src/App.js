import React from 'react'
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Contactus from './components/pages/Contactus';
import Classes from './components/pages/Classes';
import Performances from './components/pages/Performances';

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
              
          </Routes>
      </Router>
    </>
  );
}

export default App;