import {React} from 'react';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Contactus from './components/pages/Contactus';
import Classes from './components/pages/Classes';
import Xmas from './components/promotions/xmas';
import GoogleForm from './components/pages/Diwali/GoogleForm';

function App() {

  

  return (
    <>
      
      <Router>
          <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/contactus" element={<Contactus />}></Route>
              <Route path="/classes" element={<Classes />}></Route>
              <Route path="/xmas" element={<Xmas />}> </Route>
              <Route path="/imaregistration" element={<GoogleForm />}> </Route>
              
              {/* <Route path="/diwali" element={<Diwali />}></Route>
              <Route path="/diwalisports" element={<DiwaliSports />}></Route>
              <Route path="/diwalientry" element={<GoogleForm />}></Route>
              <Route path="/login" element={<LoginForm />}></Route> */}
          </Routes>
      </Router>
    </>
  );
}

export default App;