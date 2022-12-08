import {React} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Xmas from './components/promotions/xmas';
import GoogleForm from './components/pages/Diwali/GoogleForm';

function App() {

  

  return (
    <>
      
      <Router>
          <Routes>
              {/* <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/contactus" element={<Contactus />}></Route>
              <Route path="/classes" element={<Classes />}></Route> */}
              <Route path="/xmas" element={<Xmas />}> </Route>
              <Route path="/imaregistration" element={<GoogleForm />}> </Route>
              
              {/* <Route path="/diwali" element={<Diwali />}></Route>
                
                <Route path="/diwalientry" element={<GoogleForm />}></Route>
              <Route path="/login" element={<LoginForm />}></Route> */}
          </Routes>
      </Router>
    </>
  );
}

export default App;