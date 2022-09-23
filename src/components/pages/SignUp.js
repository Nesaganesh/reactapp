import emailjs from 'emailjs-com';
import './SignUp.css';
import Navbar from '../Navbar';

const SignUp = () => {
    
    function sendEmail(e){

        e.preventDefault(); // Prevents default refresh by the browser
        emailjs.sendForm('service_h6in7wb', 'template_cbzdbyr', e.target, 'WUNJawiU6bdr4-wXs')
        .then((result) => {
            console.log(result);
        },
        (error) => {
            console.log(error);
        }).catch(err => console.log(err));

    };
    return (
        <>
        <Navbar />
        <form className="form" onSubmit={sendEmail}>

            <div><h2>Register with FDC</h2>
                    <div className="form-body">
                        <div className="username">
                            <label className="form__label" for="firstName">FirstName </label>
                            <input className="form__input" type="text" id="firstname" placeholder="First Name" name="firstname"/>
                        </div>
                        <div className="lastname">
                            <label className="form__label" for="lastName">LastName </label>
                            <input  type="text" id="lastname"  className="form__input" placeholder="LastName" name="lastname"/>
                        </div>
                        <div className="gender">
                                <label className="form__label" for="lastName"> Male  </label>
                                <input className="form__input" type="radio" name="gender" value="male" id="gender" placeholder="Male" />
                                <label className="form__label" for="lastName">    Female    </label>
                                <input className="form__input" type="radio" name="gender" value="female" id="gender" placeholder="Female" />
                        </div>
                        <div className="dob">
                            <label className="form__label" for="dob">DOB </label>
                            <input className="form__input" type="dob"  id="dob" placeholder="dob" name="dob"/>
                        </div>
                        <div className="email">
                            <label className="form__label" for="email">Email </label>
                            <input  type="email" id="email" className="form__input" placeholder="Email" name="email"/>
                        </div>
                        <div className="phone">
                            <label className="form__label" for="phone">Phone </label>
                            <input className="form__input" id="phone" placeholder="Phone" name="phone"/>
                        </div>
                        <div className="message">
                            <label className="form__label" for="message">Message </label>
                            <textarea className="form__input" id="message" placeholder="message" rows="4" name="message"/>
                        </div>
                    </div>
                    <div class="footer">
                        <button type="submit" class="btn">Register</button>
                    </div>

                </div> 
        </form>
        </>
    );

};

export default SignUp;