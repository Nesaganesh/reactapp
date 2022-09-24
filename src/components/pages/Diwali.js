
import React from 'react';
import './Diwali.css';


function Diwali() {

    const navigate = () => {
        window.location.href = 'https://buy.stripe.com/test_3cs16je6g7FJ36w9AB';
    };
  return (
    <>
            <br/>
             {/* https://buy.stripe.com/test_3cs16je6g7FJ36w9AB */}
            
              <br/><br/>
            <div className='navbar-logo-diwali'>
                <img className='navbar-logo-diwali'src={'https://s3.amazonaws.com/flytoez.content/Diwali_Promo.png'} alt="Mylogo" /> 
            </div>
            <br/><br/>
            <div>
                    <div className="form-body-diwali">
                        
                        <p>
        
                           	   <b><u>More Details Follows</u></b>
                        </p> <br/><p>

Diwali is just not ‘Festival of lights’ its 
the is most beautiful time of the year where we welcome the winter with lighting diyas, seek blessing from God and indulge in feast.
Our main objective is to encourage the kids to understand our rich culture and come together as one family to celebrate the triumph of good over evil
</p> <br/><p>
<b><u>What you expect on the day</u></b>
</p> <br/><p>
Let's unite and enjoy this beautiful day with various cultural programs both adults and kids
</p> <br/><p>

<b><u>Events and Registration</u></b>
</p> <br/><p>
Kindly register yourself or on behalf of your kids for the events before 21st Oct
</p> <br/><p>

Singing:
</p><p>
(Both solo and group)
Register with 
WhatsApp: +447424529361
Mobile: +447741843819
</p><p>
Dance & Drama : 
</p><p>
Dance: 
FDC (FlyToez Dance Company) will support you perform on the big stage helping you in both Choreo and music, enrol to Adults solo, kids solo, Adults group and kids group 
</p><p>
Drama:
	15-20 mins of skit must be performed more of acting skills
    </p><p>
(Both solo and group)
Register with Nesa
WhatsApp: +447424529361
Mobile: +447741843819
</p><p>

Volunteers for Rangoli:
</p><p>
WhatsApp: +447424529361
Mobile: +447741843819
</p><p>
Food:
</p><p>
Menu yet to be decided as we are talking to few caters who can help us.
</p><p>
Tickets:
</p><p>
	Single. – £15
Couples - £25
	Family Pack – £30 (2A, 1C)
	Extra adults from same family – £10
    Extra child from same family – £5
    </p><p>
Account Details:<br/>
Name: Nesaganesh Panneerselvam <br/>
Account Number: 21663662<br/>
Sort-Code: 400317<br/>
<br/>
Pay for 1 Adult <button onClick={navigate}> PayNow  </button>
<br/>
<br/>
Pay for 2 Adults <button onClick={navigate}> PayNow  </button>
<br/>
<br/>
Pay for 2 Adults and 1 Children <button onClick={navigate}> PayNow  </button>
<br/>
<br/>
Pay for 2 Adults and 2 Children <button onClick={navigate}> PayNow  </button>
<br/>

                        </p>
                    </div>
                </div> 
    </>
  );
}

export default Diwali;