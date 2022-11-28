import {React} from 'react';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/pages/SignUp';
import Contactus from './components/pages/Contactus';
import Classes from './components/pages/Classes';
import Performances from './components/pages/Performances';


// import Diwali from './components/pages/Diwali/Diwali';
// import DiwaliSports from './components/pages/Diwali/DiwaliSports';
// import GoogleForm from './components/pages/Diwali/GoogleForm';

// import LoginForm from './components/loginform';

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