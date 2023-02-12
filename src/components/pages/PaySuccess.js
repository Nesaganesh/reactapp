import React from 'react';
import './Performances.css';
import '../Button.css';
import Navbar from '../Navbar'; 

function Payment() {

    return (
      <>    
              <Navbar />      
             
                <html lang="en">
                    <head>
                        <meta charset="utf-8" />
                        <title>Stripe Checkout Sample</title>
                        <meta name="description" content="A demo of Stripe Payment Intents" />

                        <link rel="icon" href="favicon.ico" type="image/x-icon" />
                        <link rel="stylesheet" href="css/normalize.css" />
                        <link rel="stylesheet" href="css/global.css" />

                        <script src="./success.js" defer></script>
                    </head>

                    <body>
                        <div class="togethere-background"></div>
                        <div class="sr-root">
                        <div class="sr-main">
                            <div class="sr-payment-summary completed-view">
                                <h1>Your payment succeeded</h1>
                                <h4>
                                View CheckoutSession response:
                                </h4>
                            </div>
                            <div class="completed-view-section">
                                <pre>

                                </pre>
                                <button onclick="window.location.href = '/';">Restart demo</button>

                                <form action="https://localhost:5001/customer-portal" method="POST">
                                <input type="hidden" name="sessionId" id="sessionId" />

                                <button>Manage Billing</button>
                                </form>
                            </div>
                            </div>
                            <div class="sr-content">
                            </div>
                        </div>
                    </body>
                </html>

      </>
    );
  }
  
  export default Payment;