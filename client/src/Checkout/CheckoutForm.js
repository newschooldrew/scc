import React, {useContext, useEffect, useState } from "react";
import AuthContext from '../AuthContext'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {createPaymentIntent,createOrder,getProductDetails} from '../actions'
import {withRouter} from 'react-router-dom'
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const CheckoutForm = ({price,history}) => {
  const {state,dispatch} = useContext(AuthContext)
  const {username,cartItems} = state;
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [actualName,setActualName] = useState('')
  const [address,setAddress] = useState('')
  const [city,setCity] = useState('')
  const [province,setProvince] = useState('')
  const [postal_code,setPostalCode] = useState('')
  const stripe = useStripe();
  const elements = useElements();

  let cartTotal = JSON.parse(sessionStorage.getItem('cart'))

  useEffect(() => {
    const item = {username,actualName,address,city,province,postal_code,price,cartTotal}
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
      console.log(clientSecret)
    ev.preventDefault();
    setProcessing(true);

    const item = {username,actualName,address,city,province,postal_code,price,cartTotal}

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
    const item = {username,actualName,address,city,province,postal_code,price,cartTotal}
  };

  const renderForm = () => {
      console.log("stripe")
      console.log(stripe)
      console.log("clientSecret")
      console.log(clientSecret)
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

    return (
      <form onSubmit={handleSubmit}>
        <div className="sr-combo-inputs">
          <div className="sr-combo-inputs-row">
          <FormGroup>
          <Row >
            <Col md={3}>
                <FormGroup>
                <Label for="name">Name</Label>
                            <input
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
                </Col>

                <Col md={3}>
                    <FormGroup>
                    <Label for="address">Last Name</Label>
                        <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        className="sr-input"
                        // onChange={e => setAddress(e.target.value)}
                        value={address}
                        />
                    </FormGroup>
                </Col>
            </Row>
            
            <Row>
            <Col md={3}>
            <FormGroup>
            <Label for="address">Address</Label>
                        <input
                        type="text"
                        id="address"
                        name="Address"
                        placeholder="Address"
                        className="sr-input"
                        onChange={e => setAddress(e.target.value)}
                        value={address}
                        />
            </FormGroup>
            </Col>
            <Col md={3}>
            <FormGroup>
            <Label for="address">City</Label>
            <input
              type="text"
              id="city"
              name="City"
              placeholder="City"
              className="sr-input"
              onChange={e => setCity(e.target.value)}
              value={city}
              />
            </FormGroup>
            </Col>
        </Row>
        <Row>
        <Col md={3}>
          <FormGroup>
          <Label for="address">State</Label>
              <input
              type="text"
              id="province"
              name="province"
              placeholder="State"
              className="sr-input"
              onChange={e => setProvince(e.target.value)}
              value={province}
              />
          </FormGroup>
        </Col>

        <Col md={3}>
          <FormGroup>
          <Label for="address">Postal Code</Label>
              <input
              type="text"
              id="postal_code"
              name="postal_code"
              placeholder="Postal Code"
              className="sr-input"
              onChange={e => setPostalCode(e.target.value)}
              value={postal_code}
              />
          </FormGroup>
        </Col>
    </Row>
          <div className="sr-combo-inputs-row">
            <CardElement
              className="sr-input sr-card-element"
              options={options}
              />
              </div>
              </FormGroup>
              </div>

        {error && <div className="message sr-field-error">{error}</div>}

        <button
          className="btn"
          >
            {processing ? "Processing…" : "Pay"}
        </button>
          </div>
      </form>
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