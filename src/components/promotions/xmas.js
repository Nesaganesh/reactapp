import React from 'react';
import './xmas.css';
import '../../components/PromotionSection.css';
import { Link } from 'react-router-dom';


function Xmas() {

    const navigate = () => {
      window.location.href = 'https://buy.stripe.com/cN20376l34SAexadQQ';
    };

  return (
    <>      
            
            <br />
            <div className='navbar-logo-diwali'>
                <img className='navbar-logo-diwali'src={'https://s3.amazonaws.com/flytoez.content/Xmas_Promo.jpeg'} alt="Mylogo" /> 
            </div>
            <br />
            <div>
                    <div className="form-body-diwali">
                        
<br/>

<p><b>Steps to Register & Pay for IMA Christmas & New Year Event </b></p>
<div className="steps">
<ul>
<li>Click on the REGISTER link below to fill the personal information.</li>
<li>Click 'Submit' button and scroll up to see the confirmation message.</li>
<li>Scroll down to bottom of the page to click on the 'Home' button</li>
<li>Scroll down and Click on the 'PayNow' button to pay for the event.</li>
<li>Check you received your confirmation email for your successfll payment.</li>
<li>Wait for QR code ticket through an email (will arrive one week before the event)</li>
</ul>
</div>
<br/>
<Link to='/imaregistration' ><b><u>REGISTER</u> </b></Link>
<br/>
<p>
<b>Tickets: 2 ways to pay for the event (Bank transfer / Pay through paybuttons </b> <br/>
<br/>
<p><b><u>Payment via Bank Transfer </u></b> </p>
<p>AccountName: IPSWICH MALAYALEE ASSOCIATION  </p>
<p>AccountNumber: 45881268 </p>
<p>SortCode: 30-94-55</p>
<p>PaymentReference:  'YourEmailId'</p>
<br/>
<p><b><u>Payment via below link </u></b> </p>
Click on any of the payment link, enter the respective amount choosen with all the details and click pay
<br />
Free for kids under 5 years old. 
<br />
Kindly pay as soon as possible, so that we can arrange everything well before the event.
<br/>
<br/>
Pay for 1 Adult <button onClick={navigate} className='btns' >  <b>PayNow £20</b>   </button>
<br/>
<br/>
Pay for 2 Adults   <button onClick={navigate}  className='btns' > <b>PayNow £40</b>  </button>
<br/>
<br/>
Pay for 2 Adults with 1 Child (5-12 years of age )  <button onClick={navigate}  className='btns' > <b>PayNow £50</b>  </button>
<br/>
<br/>
Pay for 2 Adults with 2 Child (5-12 years of age )  <button onClick={navigate} className='btns' > <b>PayNow £60</b>  </button>
<br/>
<br/>
Pay for 2 Adults with 2 Child (above 12 years of age )  <button onClick={navigate}  className='btns' > <b>PayNow £70</b>  </button>
<br/>
<br/>
Pay for 2 Adults with 3 Child (above 12 years of age )  <button onClick={navigate} className='btns' > <b>PayNow £75</b>  </button>
<br/>
<br/>
Additional Ticket  Adult - £20,  Child (5-12 years of age ) is £10 and Child above 12-18 years is £20 
<br/>

                        </p>
                        <p>
                            <b><u>Note</u></b>: Please reach out immediately to the below numbers or in WhatsApp <a href='https://chat.whatsapp.com/FmYfPmy9xBH6F7KCyxGMtS'>LINK</a> in case of any more clarity needed on the payments <br/>
                            We will also get back to you if there is any discrepancy on the payments  <br/>
                            Nesa whats app : +44 7424529361 <br/>
                            Shibi whats app : +44 7877795361 <br/>
                            Babu Mathai whats app : +44 7809686597 <br/> <br/>

                        </p>
                    </div>
                </div> 
    </>
  );
}

export default Xmas;