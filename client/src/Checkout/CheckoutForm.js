import React, {useContext, useEffect, useState } from "react";
import AuthContext from '../AuthContext'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {createPaymentIntent,createOrder} from '../actions'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {withRouter} from 'react-router-dom'
import { Button,Form, FormGroup, Label, Input } from 'reactstrap';
import './CheckoutForm.scss'

const CheckoutForm = ({price,history}) => {
  const {state,dispatch} = useContext(AuthContext)
  const {orderConfirmation} = state;

  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [actualName,setActualName] = useState('')
  const [lastName,setLastName] = useState('')
  const [address,setAddress] = useState('')
  const [city,setCity] = useState('')
  const [province,setProvince] = useState('')
  const [postal_code,setPostalCode] = useState('')
  const [email,setEmail] = useState('')
  const stripe = useStripe();
  const elements = useElements();
  const mobileSize = useMediaQuery('(max-width:600px)');

  let cartTotal = JSON.parse(sessionStorage.getItem('cart'))
  let soldOutObjects = [];
  let message = '';
  let divBeginning = '<div>'
  let divEnd = '<div>'
  useEffect(() => {
    const item = {actualName,address,city,province,postal_code,email,price,cartTotal}
      createPaymentIntent(item)
      .then((clientSecret) => {
          setClientSecret(clientSecret.client_secret)
      })
      .catch((err) => {
        setError(err.message);
      });
  },[]);

  useEffect(() => {
    const item = {actualName,address,city,province,postal_code,email,price,cartTotal}
      createPaymentIntent(item)
      .then((clientSecret) => {
          setClientSecret(clientSecret.client_secret)
      })
      .catch((err) => {
        setError(err.message);
      });
  },[price]);

  useEffect(() => {
    console.log("orderConfirmation")
    console.log(orderConfirmation)
    console.log(typeof orderConfirmation)
    if(orderConfirmation && typeof orderConfirmation == 'object' && orderConfirmation.length > 0){
      console.log(orderConfirmation.length)
      if(orderConfirmation.length == 1){
        soldOutObjects = orderConfirmation[0].title
      } else{
          for(let x of orderConfirmation){
            console.log(x.title)
            soldOutObjects.push(x.title)
          }
          console.log("soldOutObjects")
          console.log(soldOutObjects)
          soldOutObjects.map(object =>{
            console.log(object)
            message += "\n" + object + "has unfortunately just sold out!" + "\n"
            console.log(message)
          })
        }
      dispatch({type:"SET_ALERT",payload:soldOutObjects})
      dispatch({type:"CREATE_CONFIRMATION",payload:null})
    } else if(typeof orderConfirmation == 'string'){
      history.push('/receipt')
    }
  },[orderConfirmation]);
  
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const item = {actualName,lastName,address,city,province,postal_code,email,price,cartTotal}
    
    createPaymentIntent(item)
    .then((clientSecret) => {
        setClientSecret(clientSecret.client_secret)
    })
    .catch((err) => {
      setError(err.message);
    });

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value,
        },
      },
    });

    console.log("payload:")
    console.log(payload)

    if (payload.error || !payload) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(true);
      console.log("[error]", payload.error);
    } else {
      setError(null);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      console.log("[PaymentIntent]", payload.paymentIntent)
      dispatch({type:"CREATE_ORDER",payload:item})
      createOrder(item,dispatch)
    }
  };

  const renderForm = () => {
    const options = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    };

    const formStyles = {
      margin: '0 0 8% 0',
      display:'flex',
      maxWidth:'100% !important'
    }

    const mobFormStyles = {
      margin: '0',
      display:'flex',
      maxWidth:'100% !important'
    }

    const outerStyles = {
      justifyContent:'spaceBetween',
      width:'13%'
    }

    const mobOuterStyles = {
      justifyContent:'spaceBetween',
      width:'0%'
    }

    const innerStyles = {
      justifyContent:'spaceBetween',
      width:'74%'
    }

    const mobInnerStyles = {
      justifyContent:'spaceBetween',
      width:'100%'
    }

    return (
        <div style={mobileSize ? mobFormStyles : formStyles}>
        <div style={mobileSize ? mobOuterStyles : outerStyles}></div>
      <Form style={mobileSize ? mobInnerStyles :innerStyles} onSubmit={handleSubmit}>

      <div className="form-row">
                <FormGroup className="col-md-6">
                <Label for="name">Name</Label>
                            <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            autoComplete="cardholder"
                            className="sr-input"
                            onChange={e => setActualName(e.target.value)}
                            value={actualName}
                            required
                            />
                </FormGroup>
                
                    <FormGroup className="col-md-6">
                    <Label for="lastName">Last Name</Label>
                        <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        className="sr-input"
                        onChange={e => setLastName(e.target.value)}
                        value={lastName}
                        required
                        />
                    </FormGroup>
              </div>
          <div className="form-row">
                  <FormGroup className="col-md-6">
                  <Label for="address">Address</Label>
                              <Input
                              type="text"
                              id="address"
                              name="Address"
                              placeholder="Address"
                              className="sr-input"
                              onChange={e => setAddress(e.target.value)}
                              value={address}
                              required
                              />
                  </FormGroup>

                  <FormGroup className="col-md-6">
                  <Label for="address">City</Label>
                  <Input
                    type="text"
                    id="city"
                    name="City"
                    placeholder="City"
                    className="sr-input"
                    onChange={e => setCity(e.target.value)}
                    value={city}
                    required
                    />
                  </FormGroup>
            </div>
            <div className="form-row">
                  <FormGroup className="col-md-6">
                  <Label for="address">State</Label>
                      <Input
                      type="text"
                      id="province"
                      name="province"
                      placeholder="State"
                      className="sr-input"
                      onChange={e => setProvince(e.target.value)}
                      value={province}
                      required
                      />
                  </FormGroup>
                
                  <FormGroup className="col-md-6">
                  <Label for="address">Postal Code</Label>
                      <Input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      placeholder="Postal Code"
                      className="sr-input"
                      onChange={e => setPostalCode(e.target.value)}
                      value={postal_code}
                      required
                      />
                  </FormGroup>
                
                  <FormGroup className="col-md-12">
                  <Label for="address">Email</Label>
                      <Input
                      type="text"
                      id="email"
                      name="email"
                      placeholder="Email"
                      className="sr-input"
                      onChange={e => setEmail(e.target.value)}
                      value={email}
                      required
                      />
                  </FormGroup>
          </div>

            <CardElement
              className="sr-input sr-card-element"
              options={options}
              required
              />

        {error && <div className="message sr-field-error">{error}</div>}

        <button
        className="btn"
          >
            {processing ? "Processing…" : "Pay"}
        </button>
          
      </Form>
      <div style={mobileSize ? mobOuterStyles : outerStyles}></div>
      </div>
    );
  };

  return (
    <div className="checkout-form">
      <div className="sr-payment-form">
        <div className="sr-form-row" />
        {renderForm()}
      </div>
    </div>
  );
}

export default withRouter(CheckoutForm)