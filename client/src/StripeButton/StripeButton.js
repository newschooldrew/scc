import React, {useContext} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import {withRouter} from 'react-router-dom'
import {createOrder} from '../../actions'
import AuthContext from '../../AuthContext'

const StripeCheckoutButton = ({ price,history }) => {
  const {state,dispatch} = useContext(AuthContext)
  const {username} = state;
  const cartTotal = JSON.parse(sessionStorage.getItem('cart'))
  const priceForStripe = price * 100;
  const publishableKey = 'pk_test_i7bJE84QP11alRDH8lY2Twkw00Jl1wYTZb'

  const onToken = token => {
    axios({
      url: 'payment',
      method: 'post',
      data: {
        amount: priceForStripe,
        token: token
      }
    })
      .then(res => {
        // createOrder(username,cartTotal,price,dispatch)
        history.push('/receipt')
      })
      .catch(error => {
        console.log('Payment Error: ', error);
        alert(
          'There was an issue with your payment! Please make sure you use the provided credit card.'
        );
      });
  };

  const handleSubmit = e =>{
    console.log(e)
    console.log("clicked")
  }

  return (
    <StripeCheckout
      label='Pay Now'
      name='Drews restaurant'
      billingAddress
      shippingAddress
      image='https://svgshare.com/i/CUz.svg'
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel='Pay Now'
      token={onToken}
      stripeKey={publishableKey}
      triggerEvent="onClick"
      onClick={handleSubmit}
    />
  );
};

export default withRouter(StripeCheckoutButton);