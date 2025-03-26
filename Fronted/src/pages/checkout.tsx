import React, { useState } from 'react'
import {Elements, PaymentElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51R6fH6P2yJStPtnOLJVOBZfz22squ9QXKLYMGaSG6zrOp2izEJQ32F5sUVcXAsTYBucLicqDcDx18kWPNtsNE0Ye00fPHmyCjf');


const CheckOutButton = () => {
  // processing state 
  const [isprocessing , setIsProcessing] = useState<boolean>(false);

  const submitHandler = () => {};
// make the form


return (
          <div className='checkout-container'>
            <form onSubmit={submitHandler}>
              <button>{isprocessing ? 'Processing...' : "pay"}</button>
              <PaymentElement />
            </form>

          </div>
    )
}


const checkout = () => {
  return (
    <Elements options={{
      clientSecret: 'rohit234'
    }} stripe={stripePromise}>
      <CheckOutButton />
      </Elements>
  )
}

export default checkout
