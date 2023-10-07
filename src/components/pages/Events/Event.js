import React, { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2';


function Event() {

  const [customerName, setCustomerName] = useState('');
    const [food, setFood] = useState('');
    const [dietanaryComments, setDietanaryComments] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [terms, setTerms] = useState('');
    const [adults, setAdults] = useState('');
    const [child, setChild] = useState('');
    const [baby, setBaby] = useState('');

    const textInput = useRef();

    useEffect(() => {
        textInput.current.focus();
    }, [])

    let [changeText] = useState(true);

    let totalAmount = 0;
    const adultPrice = 20;
    const childPrice = 10;

      

    function calculate()
    {
      var childVal = child;
      if(childVal == '') {
        childVal = "0";
      }
    
      
      totalAmount =  parseInt(adults) * adultPrice +  parseInt(childVal) * childPrice;
      document.getElementById("totalPay").innerHTML = "Pay Now " + totalAmount;
      changeText = true;
        
    }

    const [openpopup, setopenpopup] = useState('');
    async function redirectToStripe() {

      //alert(adults);
      //alert(child);
      // alert(baby);
      // alert(customerName);
      // alert(food);
      // alert(dietanaryComments);
      // alert(email);
      // alert(phone);
      // alert(terms);
      

      if (!customerName || !food || !dietanaryComments || !email || !phone || !terms 
        || !adults  ) {
        
          return Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'All fields are required.',
              showConfirmButton: true
          });
      }else {

        calculate();
  
        Swal.fire({
          icon: 'info',
          title: 'Payment Info',
          text: 'Amount you are going to Pay ' + totalAmount,
          showConfirmButton: false,
          timer: 2500
        });
      }

    let currentWindowUrl = window.location.href;
    var price = totalAmount+"";

      var childVal1 = child;
      if(childVal1 == '') {
        childVal1 = "0";
      }
      var baby1 = baby;
      if(baby1 == '') {
        baby1 = "0";
      }

      var jsonData = {        
        "adults": adults,
        "child": childVal1,
        "baby": baby1,
        "name": customerName,
        "food": food,
        "Comments": dietanaryComments,
        "email": email,
        "phone": phone,
        "terms": terms,
        "priceid": price,
        "ProductDesc": "Test Dance Session",
        "CurrentUrl": currentWindowUrl        
      }
      //https://localhosr:5001/eventcustomer
      //https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/eventcustomer
      
      const response = await fetch('https://5csp3geevlboejfs32pm5oj7iy0asdcg.lambda-url.us-east-1.on.aws/eventcustomer', {
        method: 'POST', 
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(jsonData)
      });
      const data = await response.json();
      console.log(data);
      console.log(data.url);
      window.location.href = data.url;
    }
    
  return (
    <>      
        <br />
        <br />
        <div className='poster-image'>
                <img className='poster-image' src={'https://s3.amazonaws.com/flytoez.content/Diwali_Poster_2023.3.png'} alt="no image" 
                onClick={e => setopenpopup(true)} /> 
                {openpopup ? (
                      <dialog
                        className="dialog"
                        style={{ position: "absolute" }}
                        open
                        onClick={e => setopenpopup(false)}
                        >
                          <img
                            className="image"
                            src={'https://s3.amazonaws.com/flytoez.content/Diwali_Poster_2023.png'}
                            onClick={e => setopenpopup(false)}
                            alt="no image"
                          />
                        </dialog>
                ) : (
                  <div></div>
                )}
               
        </div>    
        <br/>
        <div className='container'>
            <div className='small-container'>
            <u><b>Ticket Price:</b></u>
            <br/>
            Adult X 1 = £20
            <br/>
            Child between 5-16 years X 1  = £10
            <br/>
            <b>Note:</b> Free for child below 5 years
            <br/>
            
            <form>
              <table>
                <tr>
                  <td><label htmlFor="playername">Adult above 16years</label>
            <select name="languages" id="adults" className='select-numberofcustomers' 
            ref={textInput} onChange={e => setAdults(e.target.value)
            }>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select></td>
                  <td><label htmlFor="playername">Child above 5years</label>
            <select name="languages" id="child" className='select-numberofcustomers' onChange={e => setChild(e.target.value)}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select></td>
                  <td><label htmlFor="playername">Child below 5years</label>
            <select name="languages" id="baby" className='select-numberofcustomers' onChange={e => setBaby(e.target.value)}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select></td>
                </tr>
              </table>
                <label htmlFor="customerName">Name</label>
                <input
                    id="customerName"
                    type="text"                    
                    name="customerName"
                    onChange={e => setCustomerName(e.target.value)}
                />
                <label htmlFor="gender">Food</label>
                <input
                    id="food"
                    type="radio"
                    name="food"
                    value='veg'
                    onChange={e => setFood(e.target.value)}
                /> <span>Veg     </span> 
                 <input
                    id="food"
                    type="radio"
                    name="food"
                    value='non-veg'
                    onChange={e => setFood(e.target.value)}
                /> <span>Non-Veg     </span> 
                <input
                    id="food"
                    type="radio"
                    name="food"
                    value='vegan'
                    onChange={e => setFood(e.target.value)}
                /> <span>Vegan     </span> 
                
                <label htmlFor="dietanaryComments">Dietanary Comments (Ex: how many veg/non-veg/vegan or anything related to alergy)</label>
                <textarea
                    id="dietanaryComments"
                    name="dietanaryComments"
                    onChange={e => setDietanaryComments(e.target.value)}
                />
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="number"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
                {/* <label htmlFor="terms">Terms & Conditions <a href=''> Read Now</a></label> */}
                <input type="checkbox"
                    id="terms" name="terms"
                    value="Checked"
                    onChange={e => setTerms(e.target.value)} 

                /> Are you happy for FDC to store your details until the time you have a business with us. 
               
            </form>
            <br/>
            {changeText ? (
            <button onClick={redirectToStripe} className='btns'><b> <spam id="totalPay">Pay Now</spam> </b></button>
          ) : (
            <div></div>
          )}
                <br />
      </div>
      </div>
        
    </>
  );
}

export default Event;