import React from 'react';
import './Diwali.css';
import '../PromotionSection.css';

function Diwali() {

    const navigate = () => {
        window.location.href = 'https://buy.stripe.com/8wMcOF4F82cV2re9AA';
    };
  return (
    <>
            <br/>
              <br/><br/>
            <div className='navbar-logo-diwali'>
                <img className='navbar-logo-diwali'src={'https://s3.amazonaws.com/flytoez.content/Diwali_Promo.png'} alt="Mylogo" /> 
            </div>
            <br/><br/>
            <div>
                    <div className="form-body-diwali">
                        
                        <p>
        
                           	   <b><u>More Details Follows</u></b>
                        </p> <p>

Diwali is just not ‘Festival of lights’ its 
the is most beautiful time of the year where we welcome the winter with lighting diyas, seek blessing from God and indulge in feast.
Our main objective is to encourage the kids to understand our rich culture and come together as one family to celebrate the triumph of good over evil
</p><p>
<b><u>What you expect on the day</u></b>
</p><p>
Let's unite and enjoy this beautiful day with various cultural programs both adults and kids
</p> <br/><p>

<b><u>Events and Registration</u></b>
</p> <p>
Kindly register yourself or on behalf of your kids for the events before 21st Oct
</p><p>

<b>Singing:</b>
</p><p>
(Both solo and group)
Register with <br/>
WhatsApp: +447424529361 <br/>
Mobile: +447741843819
</p><p>
<b>Dance and Drama : </b>
</p><p>
<u>Dance</u>:
Either please come with your own choreo or FDC happy to help make you perform on the stage, please register with them for both Solo or Group Dance for both Adults and Kids  
</p><p>
<u>Drama</u>:
	15-20 mins of skit must be performed more of acting skills
</p><p>
Register with Nesa :
<br/>
WhatsApp: +447424529361
<br/>
Mobile: +447741843819
</p><p>

<b>Volunteers for Rangoli:</b>
</p><p>
WhatsApp: +447424529361 <br/>
Mobile: +447741843819
</p><p>
<b>Food:</b>
</p><p>
Menu yet to be decided as we are talking to few caters who can help us.
</p><p>
<b>Tickets:</b> Can be paid either bank transfer or pay online using credit/debit card
</p>Free for kids under 5 years old<p>
	Single. – £15 <br/>
    Couples - £25 <br/>
	Family Pack – £30 (2A, 1C) <br/>
	Extra adults from same family – £10 <br/>
    Extra child from same family – £5 <br/>
    </p><p>
Bank Transfer - Account Details:<br/>
Name: Nesaganesh Panneerselvam <br/>
Account Number: 21663662<br/>
Sort-Code: 400317<br/>
<br/>
Pay for 1 Adult   <button onClick={navigate} className='btns' >  <b>PayNow £15</b>   </button>
<br/>
<br/>
Pay for 2 Adults or with 1 Child   <button onClick={navigate}  className='btns' > <b>PayNow £30</b>  </button>
<br/>
<br/>
Pay for 2 Adults with 2 Children  <button onClick={navigate} className='btns' > <b>PayNow £35</b>  </button>
<br/>
<br/>
Pay for 4 Adults with 2 Children  <button onClick={navigate} className='btns' > <b>PayNow £55</b>  </button>
<br/>

                        </p>
                    </div>
                </div> 
    </>
  );
}

export default Diwali;