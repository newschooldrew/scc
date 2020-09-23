import React, {useContext, useEffect, useState } from "react";
import AuthContext from '../AuthContext'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {createPaymentIntent,createOrder,removeItemFromInventory} from '../actions'
import {withRouter} from 'react-router-dom'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './CheckoutForm.scss'

const CheckoutForm = ({price,history}) => {
  const {state,dispatch} = useContext(AuthContext)
  const {cartItems} = state;
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
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

  let cartTotal = JSON.parse(sessionStorage.getItem('cart'))

  useEffect(() => {
    const item = {actualName,address,city,province,postal_code,email,price,cartTotal}
      createPaymentIntent(item)
      .then((clientSecret) => {
          console.log("clientSecret:")
          console.log(clientSecret.client_secret)
          setClientSecret(clientSecret.client_secret)
        console.log("clientSecret:")
        console.log(clientSecret)
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);
  
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    removeItemFromInventory(cartTotal)
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

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      console.log("[error]", payload.error);
    } else {
      setError(null);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      console.log("[PaymentIntent]", payload.paymentIntent)
    }
    createOrder(item)
    history.push('/receipt')
  };

  const renderSuccess = () => {
    const item = {actualName,address,city,province,postal_code,price,cartTotal}
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

    const outerStyles = {
      justifyContent:'spaceBetween',
      width:'13%'
    }

    const innerStyles = {
      justifyContent:'spaceBetween',
      width:'74%'
    }

    return (
      <div style={formStyles}>
        <div style={outerStyles}></div>
      <Form style={innerStyles} onSubmit={handleSubmit}>

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
                      />
                  </FormGroup>
          </div>

            <CardElement
              className="sr-input sr-card-element"
              options={options}
              />

        {error && <div className="message sr-field-error">{error}</div>}

        <button
          className="btn"
          >
            {processing ? "Processing…" : "Pay"}
        </button>
          
      </Form>
      <div style={outerStyles}></div>
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