import  { FormEvent, useState } from 'react'
import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NewOrderRequest } from '../types/api-types';
import { responseToast } from '../utils/feature';
import { useNewOrderMutation } from '../redux/api/orderApi';
import { resetCart } from '../redux/reducer/cartReducer';


const stripePromise = loadStripe('pk_test_51R6fH6P2yJStPtnOLJVOBZfz22squ9QXKLYMGaSG6zrOp2izEJQ32F5sUVcXAsTYBucLicqDcDx18kWPNtsNE0Ye00fPHmyCjf');


const CheckOutButton = () => {
  // use the hooks 
  const stripe  = useStripe();
  const elements = useElements();


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.useReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharge,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [newOrder] = useNewOrderMutation();

  // processing state 
  const [isprocessing , setIsProcessing] = useState<boolean>(false);

  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!stripe || !elements) return;
    setIsProcessing(true);


    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharge,
      total,
      user: user?._id!,
    };


    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      return toast.error(error.message || "Something Went Wrong");
    }


    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
    }
    setIsProcessing(false);
  };

    // use the timeout make it more 
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

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
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;
  return (
    <Elements options={{
      // pass the cleinsecret when u get it frm th
      clientSecret: 'rohit234'
    }} stripe={stripePromise}>
      <CheckOutButton />
      </Elements>
  )
}

export default checkout
