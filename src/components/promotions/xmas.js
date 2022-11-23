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
<p>IMA Registration link please enroll <Link to='/imaregistration' ><b><u>HERE</u> </b></Link>   before doing the payment</p>
<p>After filling the form scroll down and click on the BACK button to do the payment </p>
<br/>
<p>
<b>Tickets:</b> <br/>

<br/>
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
Pay for 2 Adults with 1 Child (above 12 years of age )  <button onClick={navigate}  className='btns' > <b>PayNow £70</b>  </button>
<br/>
<br/>
Pay for 2 Adults with 2 Child (above 12 years of age )  <button onClick={navigate} className='btns' > <b>PayNow £70</b>  </button>
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
                            Joby whats app : +44 7417387527 <br/> <br/>

                        </p>
                    </div>
                </div> 
    </>
  );
}

export default Xmas;