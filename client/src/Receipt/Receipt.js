import React, {useState,useEffect,useContext} from 'react'
import AuthContext from '../AuthContext'
import {totalPrice,totalItemPrice} from '../cart.utils'
import { Table } from 'reactstrap';

const divStyle = {
    margin:'30% 0 0 0'
}


const Receipt = () => {
    const {state,dispatch} = useContext(AuthContext)
    let {username,profile,orderCount} = state;
    const cartItems = JSON.parse(sessionStorage.getItem('cart'))
    
    let sessionItems = JSON.parse(sessionStorage.getItem('cart'))
    let maskTotal = totalPrice(sessionItems);
    let trueTotal = parseFloat(maskTotal) + 5.00;
    
    const getData = item => {
        console.log("get Data ran");
        console.log(item)
        console.log(item.length)
        sessionStorage.setItem('cart',0)
        sessionStorage.setItem('cartTotal',null)
        if(username == "alert_tester"){
            sessionStorage.setItem('orderCount',item.length)
        }
      };

    window.addEventListener('beforeunload', function (e) {
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        sessionStorage.removeItem('cart')
        sessionStorage.removeItem('cartTotal')

        Object.keys(sessionStorage).map(data =>{
            sessionStorage.removeItem(data)  
        })

        // Cancel the event
        // Chrome requires returnValue to be set
      });

    return (<div style={divStyle}>
            <div>Your payment was processed!</div>
            <Table responsive>
                <thead>
            <tr>
                <th className="text-center">Title</th>
                <th className="text-right">Cart</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Total</th>
            </tr>
            </thead>
            <tbody>
                {
                    cartItems.map((cart,idx) => {
                        console.log(cart.price)
                        return (
                        <tr key={idx}>
                            <td className="text-center">{cart.title}</td>
                            <td className="text-center">{cart.price}</td>
                            <td className="text-center">{cart.quantity}</td>
                            <td className="text-center">{totalItemPrice(cart)}</td>
                        </tr>
                            )
                        })
                    }
                Shipping: $5
                Masks: {totalPrice(cartItems)}
                Total: ${trueTotal}
            </tbody>
            </Table>
            </div>)
}

export default Receipt
